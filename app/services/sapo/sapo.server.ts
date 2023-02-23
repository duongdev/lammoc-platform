import type { Prisma } from '@prisma/client'
import type { Debugger } from 'debug'
import Debug from 'debug'
import type { Got } from 'got-cjs'
import got from 'got-cjs'
import { flatten } from 'lodash'
import puppeteer from 'puppeteer'

import { PUPPETEER_CONFIG, SAPO_PASS, SAPO_USER } from '~/config/app-config'
import prisma from '~/libs/prisma.server'
import { normalizePhoneNumber } from '~/utils/account'

import { SAPO_TENANT } from './sapo.const'
import type { SapoAccount, SapoCustomer, SapoTenant } from './sapo.type'

export class Sapo {
  private sapo: Got
  private log: Debugger

  constructor(
    /* eslint-disable no-unused-vars */
    private readonly tenant: SapoTenant,
    private readonly username: string = SAPO_USER!,
    private readonly password: string = SAPO_PASS!,
  ) /* eslint-enable no-unused-vars */ {
    this.log = Debug(`Sapo:${tenant}`)

    this.sapo = got.extend({
      prefixUrl: `https://${this.tenant}.mysapogo.com/admin`,
      hooks: {
        beforeRetry: [
          async ({ code, options, name, message, response }, retryCount) => {
            if (code === 'CERT_HAS_EXPIRED' || response?.statusCode === 401) {
              const cookies =
                retryCount <= 1
                  ? await this.getCookies()
                  : await this.refreshCookies()
              const headers = {
                Cookie: cookies
                  .map((cookie: any) => `${cookie.name}=${cookie.value}`)
                  .join('; '),
              }
              options.context.headers = headers
              return
            }

            this.log(`[beforeRetry] Unhandled error`, {
              code,
              name,
              message,
              retryCount,
              status: response?.statusCode,
            })
          },
        ],
        beforeRequest: [
          (options) => {
            options.headers = (options.context.headers as any) ?? {}
          },
        ],
        beforeError: [
          (error) => {
            this.log('Error calling Sapo API', error)
            return error
          },
        ],
      },
      retry: {
        limit: 3,
        errorCodes: [
          'ETIMEDOUT',
          'ECONNRESET',
          'EADDRINUSE',
          'ECONNREFUSED',
          'EPIPE',
          'ENOTFOUND',
          'ENETUNREACH',
          'EAI_AGAIN',
          'CERT_HAS_EXPIRED',
        ],
        statusCodes: [401],
      },
    })
  }

  async getCookies() {
    let cookies: string
    try {
      const dbCookies = await prisma.appMeta.findUniqueOrThrow({
        where: { id: `SAPO_TOKEN_${this.tenant}` },
      })

      cookies = dbCookies.value
    } catch (error) {
      cookies = JSON.stringify(await this.refreshCookies())
    }

    return JSON.parse(cookies)
  }

  /** Re-authenticate and update cookies to database */
  async refreshCookies() {
    this.log('Refreshing cookies')
    const browser = await puppeteer.launch(PUPPETEER_CONFIG)
    const page = await browser.newPage()

    await page.goto(
      `https://accounts.sapo.vn/login?clientId=a2KG8sj3g1&domain=${this.tenant}&relativeContextPath=/admin/orders`,
      { waitUntil: 'domcontentloaded' },
    )

    await page.type('#username', this.username)
    await page.type('#password', this.password)
    await page.click('.btn-login')

    await page.waitForSelector('.sb-avatar', {
      timeout: 3 * 60 * 1000, // 3m - sometimes it takes very long to sign in
    })

    const cookies = await page.cookies()

    await browser.close()

    const cookiesValue = JSON.stringify(cookies)
    await prisma.appMeta.upsert({
      where: { id: `SAPO_TOKEN_${this.tenant}` },
      create: { id: `SAPO_TOKEN_${this.tenant}`, value: cookiesValue },
      update: { value: cookiesValue },
    })

    this.log('Cookies refreshed')

    return cookies
  }

  async profiles() {
    const profiles = await this.sapo
      .get('profiles.json')
      .json<{ account: SapoAccount }>()
    return profiles
  }

  async syncCustomers({
    countLimit,
    perPage = 250,
  }: {
    countLimit?: number
    perPage?: number
  } = {}) {
    this.log('Sync all customers', { countLimit, perPage })
    let totalCustomers = -1

    const paginate = this.sapo.paginate<SapoCustomer>(
      'customers/doSearch.json',
      {
        searchParams: {
          limit: perPage,
          sort: 'modified_on,desc',
        },
        pagination: {
          paginate: ({ currentItems, response }) => {
            // If there are no more data, finish.
            if (currentItems.length === 0) {
              return false
            }

            const metadata = JSON.parse((response as any).body).metadata

            if (totalCustomers < 0) {
              totalCustomers = metadata.total
            }

            return {
              searchParams: {
                page: +metadata.page + 1,
                limit: perPage,
              },
            }
          },
          transform: (response: any) => {
            return JSON.parse(response.body).customers
          },
          ...(countLimit ? { countLimit } : {}),
        },
      },
    )

    let index = 1

    for await (const customer of paginate) {
      const customerData: Prisma.CustomerCreateInput = {
        id: customer.id.toString(),
        name: customer.name,
        code: customer.code,
        phone: flatten(
          (customer.phone_number ?? '').split(' / ').map((phone) =>
            phone
              .split(' - ')
              .filter((p) => !!p)
              .map((phone) => normalizePhoneNumber(phone)),
          ),
        ),
        tenant: SAPO_TENANT[this.tenant],
        email: customer.email,
        createdAt: new Date(customer.created_on),
      }

      const res = await prisma.customer.upsert({
        where: {
          id: customer.id.toString(),
        },
        create: customerData,
        update: customerData,
      })

      this.log(
        `[${index} / ${totalCustomers}] ${
          res.createdAt === res.updatedAt ? 'Created' : 'Updated'
        } customer [${customer.id}] ${customer.name} (${
          customer.phone_number
        })`,
      )

      index += 1
    }
  }
}
