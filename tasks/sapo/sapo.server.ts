import type { Prisma, Product } from '@prisma/client'
import type { Debugger } from 'debug'
import Debug from 'debug'
import type { Got } from 'got-cjs'
import got from 'got-cjs'
import { flatten, toString } from 'lodash'
import puppeteer from 'puppeteer'

import { PUPPETEER_CONFIG, SAPO_PASS, SAPO_USER } from '~/config/app-config'
import prisma, { transactionChunk } from '~/libs/prisma.server'
import { normalizePhoneNumber } from '~/utils/account'

import { SAPO_TENANT } from './sapo.const'
import type {
  SapoAccount,
  SapoCustomer,
  SapoProductCategory,
  SapoProductItem,
  SapoTenant,
} from './sapo.type'
import type { PaginationInput } from './sapo.util'
import { getPaginationOptions } from './sapo.util'

const TRANSACTION_SIZE = 500

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

  /** Sync all customers from Sapo to DB */
  async syncCustomers(options?: PaginationInput) {
    this.log('Sync all customers', options)

    const paginate = this.sapo.paginate<SapoCustomer>(
      'customers/doSearch.json',
      getPaginationOptions({
        ...options,
        searchParams: {
          sort: 'modified_on,desc',
        },
      }),
    )

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

      const upserted = await prisma.customer.upsert({
        where: {
          id: customer.id.toString(),
        },
        create: customerData,
        update: customerData,
      })

      this.log(
        `${
          upserted.createdAt === upserted.updatedAt ? 'Created' : 'Updated'
        } customer [${customer.id}] ${customer.name} (${
          customer.phone_number
        })`,
      )
    }
  }

  /** Sync all categories from Sapo to DB */
  async syncProductCategories(options?: PaginationInput) {
    this.log('Sync all categories', options)

    const paginate = this.sapo.paginate<SapoProductCategory>(
      'categories.json',
      getPaginationOptions(options),
    )

    let [created, updated] = [0, 0]

    for await (const category of paginate) {
      const categoryData: Prisma.ProductCategoryCreateInput = {
        id: toString(category.id),
        code: toString(category.code),
        name: category.name,
        tenant: SAPO_TENANT[this.tenant],
        createdAt: new Date(category.created_on),
        description: category.description,
      }

      const upserted = await prisma.productCategory.upsert({
        where: { id: categoryData.id },
        create: categoryData,
        update: categoryData,
      })

      if (upserted.createdAt === upserted.updatedAt) created += 1
      else updated += 1
    }

    this.log(`Synced categories`, { created, updated })
  }

  async syncProducts(options?: PaginationInput) {
    this.log('Sync all products', options)

    const paginate = this.sapo.paginate<SapoProductItem>(
      'products.json',
      getPaginationOptions(options),
    )

    const transactions = transactionChunk<Product>({
      size: TRANSACTION_SIZE,
      log: this.log,
    })

    for await (const product of paginate) {
      const productData: Prisma.ProductCreateInput = {
        id: toString(product.id),
        name: product.name,
        tenant: SAPO_TENANT[this.tenant],
        brand: product.brand_id
          ? {
              connectOrCreate: {
                where: { id: toString(product.brand_id) },
                create: {
                  id: toString(product.brand_id),
                  name: product.brand,
                  tenant: SAPO_TENANT[this.tenant],
                },
              },
            }
          : undefined,
        category: product.category_id
          ? {
              connect: { id: toString(product.category_id) },
            }
          : undefined,
        createdAt: new Date(product.created_on),
        description: product.description,
        tags: product.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter((t) => !!t),
        images:
          product.images.map((img) => img.full_path).filter((i) => !!i) ?? [],
      }

      await transactions.add(
        prisma.product.upsert({
          where: { id: productData.id },
          create: productData,
          update: productData,
        }),
      )
    }

    this.log(`Synced products`)
  }
}
