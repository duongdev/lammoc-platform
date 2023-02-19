import puppeteer from 'puppeteer'

import { PUPPETEER_CONFIG, SAPO_PASS, SAPO_USER } from '~/config/app-config'
import prisma from '~/libs/prisma.server'

export type SapoTenant = 'store-lam-moc' | 'thichtulam'

export class Sapo {
  constructor(
    /* eslint-disable no-unused-vars */
    private readonly username: string = SAPO_USER!,
    private readonly password: string = SAPO_PASS!,
  ) /* eslint-enable no-unused-vars */ {}

  async getCookies() {
    let cookies: string
    try {
      const dbCookies = await prisma.appMeta.findUniqueOrThrow({
        where: { id: 'SAPO_TOKEN' },
      })

      cookies = dbCookies.value
    } catch (error) {
      cookies = JSON.stringify(await this.refreshCookies())
    }

    return JSON.parse(cookies)
  }

  /** Re-authenticate and update cookies to database */
  async refreshCookies(tenant: SapoTenant = 'store-lam-moc') {
    const browser = await puppeteer.launch(PUPPETEER_CONFIG)
    const page = await browser.newPage()

    await page.goto(
      `https://accounts.sapo.vn/login?clientId=a2KG8sj3g1&domain=${tenant}&relativeContextPath=/admin/orders`,
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
      where: { id: 'SAPO_TOKEN' },
      create: { id: 'SAPO_TOKEN', value: cookiesValue },
      update: { value: cookiesValue },
    })

    return cookies
  }

  async getOrders(tenant: SapoTenant = 'store-lam-moc') {
    const browser = await puppeteer.launch(PUPPETEER_CONFIG)
    const page = await browser.newPage()

    const cookies = await this.getCookies()

    await page.setCookie(...cookies)

    await page.goto(`https://${tenant}.mysapogo.com/admin/orders.json`)
    const data = (await page.content())
      .replace(
        new RegExp(
          '^<html><head></head><body><pre style="word-wrap: break-word; white-space: pre-wrap;">',
        ),
        '',
      )
      .replace(new RegExp('</pre></body></html>$'), '')

    return data
  }
}
