import type { Debugger } from 'debug'
import debug from 'debug'
import type { Got } from 'got-cjs'
import got from 'got-cjs'
import puppeteer from 'puppeteer'

import prisma from '~/libs/prisma.server'

import { PUPPETEER_CONFIG, SAPO_PASS, SAPO_USER } from './sapo.config'
import type { SapoTenant } from './sapo.type'
import { gotExtendOptions } from './sapo.util'

export class SapoLoyalty {
  private sapo: Got
  private log: Debugger
  private SESSION_KEY: string
  private username = SAPO_USER!
  private password = SAPO_PASS!

  constructor(private readonly tenant: SapoTenant, logger?: Debugger) {
    this.log = logger || debug(`Sapo:Loyalty:${tenant}`)

    if (!(this.username && this.password)) {
      throw new Error(`Sapo username or password is not defined`)
    }

    this.SESSION_KEY = `SAPO_LOYALTY_COOKIE_${this.tenant}`

    this.sapo = got.extend({
      prefixUrl: 'https://loyalty.sapocorp.net/api',
      ...gotExtendOptions({
        log: this.log,
        getCookies: this.getCookies,
        refreshCookies: this.refreshCookies,
      }),
    })
  }

  async getCookies() {
    let cookies: string
    try {
      const dbCookies = await prisma.appMeta.findUniqueOrThrow({
        where: { id: this.SESSION_KEY },
      })

      cookies = dbCookies.value
    } catch (error) {
      cookies = JSON.stringify(await this.refreshCookies())
    }

    return JSON.parse(cookies)
  }

  async refreshCookies() {
    const log = this.log.extend(this.refreshCookies.name)
    log('Refreshing cookies')

    const browser = await puppeteer.launch(PUPPETEER_CONFIG)
    const page = await browser.newPage()

    await page.goto(
      `https://loyalty.sapocorp.net/signin?store=${this.tenant}.mysapo.net`,
    )

    await page.waitForSelector('input')

    await page.type('input', this.tenant!)
    await page.click('button')

    await page.waitForNetworkIdle()

    await page.type('#username', this.username)
    await page.type('#password', this.password)
    await page.click('.btn-login')

    await page.waitForSelector('.admin-logo')

    log('Current page URL:', page.url())
    if (page.url().startsWith('https://loyalty.sapocorp.net/admin')) {
      log(`Signed in successfully`)
    }

    const cookies = await page.cookies()

    await browser.close()

    const cookiesValue = JSON.stringify(cookies)
    await prisma.appMeta.upsert({
      where: { id: this.SESSION_KEY },
      create: { id: this.SESSION_KEY, value: cookiesValue },
      update: { value: cookiesValue },
    })

    this.log('Cookies refreshed')

    return cookies
  }

  
}
