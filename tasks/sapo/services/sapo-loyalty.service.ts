import type {
  LoyaltyMember,
  LoyaltyPointEvent,
  LoyaltyTier,
  Prisma,
  Tenant,
} from '@prisma/client'
import type { Debugger } from 'debug'
import debug from 'debug'
import type { Got } from 'got-cjs'
import got from 'got-cjs'
import { toNumber } from 'lodash'
import puppeteer from 'puppeteer'

import prisma, { createChunkTransactions } from '~/libs/prisma.server'
import { normalizePhoneNumber } from '~/utils/account'

import { PUPPETEER_CONFIG, SAPO_PASS, SAPO_USER } from '../sapo.config'
import { SAPO_TENANT } from '../sapo.const'
import type {
  SapoLoyaltyMemberItem,
  SapoLoyaltyPointEventItem,
  SapoLoyaltyTierItem,
  SapoTenant,
} from '../sapo.type'
import { getPaginationOptions, gotExtendOptions, id } from '../sapo.util'

const TRANSACTION_SIZE = +(process.env.TRANSACTION_SIZE ?? 50)

export class SapoLoyalty {
  private sapo: Got
  private log: Debugger
  private SESSION_KEY: string
  private DB_TENANT: Tenant
  private username = SAPO_USER!
  private password = SAPO_PASS!

  constructor(private readonly tenant: SapoTenant, logger?: Debugger) {
    this.log = logger || debug(`Sapo:Loyalty:${tenant}`)

    if (!(this.username && this.password)) {
      throw new Error(`Sapo username or password is not defined`)
    }

    this.DB_TENANT = SAPO_TENANT[this.tenant]
    this.SESSION_KEY = `SAPO_LOYALTY_TOKEN_${this.tenant}`

    this.sapo = got.extend({
      prefixUrl: 'https://loyalty.sapocorp.net/api',
      ...gotExtendOptions({
        log: this.log,
        getCookies: () => this.getCookies(),
        refreshCookies: () => this.refreshCookies(),
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

    await page.waitForNetworkIdle({ timeout: 3 * 60 * 1000 })

    await page.type('#username', this.username)
    await page.type('#password', this.password)
    await page.click('.btn-login')

    await page.waitForSelector('.admin-logo', { timeout: 3 * 60 * 1000 })

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

  async syncTiers(options: { newOnly?: boolean } = {}) {
    const { newOnly = false } = options
    const log = this.log.extend(this.syncTiers.name)
    log(`Starting with options:`, options)

    const lastSync = (
      await prisma.loyaltyTier.findFirst({
        orderBy: { syncedAt: 'desc' },
      })
    )?.syncedAt

    this.log(`Last sync:`, lastSync)

    const paginate = this.sapo.paginate<SapoLoyaltyTierItem>(
      'tiers',
      getPaginationOptions({
        perPage: 250,
        shouldContinue:
          newOnly && lastSync
            ? (data) => new Date(data.item.created_at) > lastSync
            : undefined,
      }),
    )

    const transaction = createChunkTransactions<LoyaltyTier>({
      size: TRANSACTION_SIZE,
      log,
    })

    for await (const t of paginate) {
      const tierData: Prisma.LoyaltyTierCreateInput = {
        id: id(t.id),
        tenant: this.DB_TENANT,
        criteria: t.criteria,
        discount: t.discount,
        maxDiscountAmount: toNumber(t.max_discount_amount ?? 0),
        name: t.name,
        status: t.status,
        totalMembers: t.members,
        createdAt: new Date(t.created_at),
        description: t.description,
        imageUrl: t.image.path,
        minCondition: toNumber(t.min_condition ?? 0),
        updatedAt: new Date(t.updated_at),
      }

      await transaction.add(
        prisma.loyaltyTier.upsert({
          where: { id: tierData.id },
          create: tierData,
          update: tierData,
        }),
      )
    }

    await transaction.close()

    log(`Synced ${transaction.proceeded()} loyalty tiers`)
  }

  async syncLoyaltyMembers(options: { newOnly?: boolean } = {}) {
    const { newOnly = false } = options
    const log = this.log.extend(this.syncLoyaltyMembers.name)
    log(`Starting with options:`, options)

    const lastSync = (
      await prisma.loyaltyPointEvent.findFirst({
        orderBy: { syncedAt: 'desc' },
      })
    )?.syncedAt

    this.log(`Last sync:`, lastSync)

    const paginate = this.sapo.paginate<SapoLoyaltyMemberItem>(
      'customers',
      getPaginationOptions({
        perPage: 250,
        shouldContinue:
          newOnly && lastSync
            ? (data) => new Date(data.item.created_at) > lastSync
            : undefined,
      }),
    )

    const transaction = createChunkTransactions<LoyaltyMember>({
      size: TRANSACTION_SIZE,
      log,
    })
    let failed = 0

    for await (const m of paginate) {
      const customer = await prisma.customer.findFirst({
        where: {
          phone: { has: normalizePhoneNumber(m.phone) },
          tenant: this.DB_TENANT,
        },
      })
      const tier = await prisma.loyaltyTier.findUnique({
        where: { id: id(m.tier.tier_id) },
      })

      if (!(customer && tier)) {
        log('member sync failed')
        log(m)
        failed += 1

        continue
      }

      const memberData: Prisma.LoyaltyMemberCreateInput = {
        id: id(m.id),
        tenant: this.DB_TENANT,
        customer: { connect: { id: customer.id } },
        phone: normalizePhoneNumber(m.phone),
        status: m.status,
        tier: { connect: { id: id(m.tier.tier_id) } },
        createdAt: new Date(m.created_at),
        expireDate: m.expire_date && new Date(m.expire_date),
        lastActivityAt: m.activity_at && new Date(m.activity_at),
        lastOrderAt: m.last_order && new Date(m.last_order),
        nextTierRemainingMoney: toNumber(
          m.tier.remaining_money_for_next_tier ?? 0,
        ),
        nextCondition: m.tier.next_condition,
        nextTierRemainingPoints: m.tier.remaining_point_for_next_tier,
        points: toNumber(m.present_point ?? 0),
        tierSpentPeriod: toNumber(m.tier_spent_period ?? 0),
        totalSpent: toNumber(m.total_spent ?? 0),
        totalOrders: toNumber(m.total_order ?? 0),
        totalUncompletedOrders: toNumber(m.total_uncompleted_order ?? 0),
        updatedAt: new Date(m.updated_at),
        usedPoints: toNumber(m.used_point ?? 0),
      }

      await transaction.add(
        prisma.loyaltyMember.upsert({
          where: { id: memberData.id },
          create: memberData,
          update: memberData,
        }),
      )
    }

    await transaction.close()

    log(`Sync ${transaction.proceeded()} loyalty members. Failed: ${failed}`)
  }

  async syncLoyaltyPointEvents(options: { newOnly?: boolean } = {}) {
    const { newOnly = false } = options
    const log = this.log.extend(this.syncLoyaltyPointEvents.name)
    log(`Starting with options:`, options)

    const lastSync = (
      await prisma.loyaltyPointEvent.findFirst({
        orderBy: { syncedAt: 'desc' },
      })
    )?.syncedAt

    this.log(`Last sync:`, lastSync)

    const paginate = this.sapo.paginate<SapoLoyaltyPointEventItem>(
      'customers/point-event',
      getPaginationOptions({
        perPage: 250,
        shouldContinue:
          newOnly && lastSync
            ? (data) => new Date(data.item.created_at) > lastSync
            : undefined,
      }),
    )

    const transaction = createChunkTransactions<LoyaltyPointEvent>({
      size: TRANSACTION_SIZE,
      log,
    })
    let failed = 0

    for await (const e of paginate) {
      const order =
        e.order_id &&
        (await prisma.order.findUnique({
          where: { id: id(e.order_id) },
        }))
      const member =
        e.customer_id &&
        (await prisma.loyaltyMember.findUnique({
          where: { id: id(e.customer_id) },
        }))

      if ((e.order_id && !order) || (e.customer_id && !member)) {
        log('event failed', e)
        failed += 1
        continue
      }

      const eventData: Prisma.LoyaltyPointEventCreateInput = {
        id: id(e.id),
        tenant: this.DB_TENANT,
        activity: e.activity,
        code: e.code,
        member: { connect: { id: id(e.customer_id) } },
        adjustPoints: toNumber(e.adjust_point) ?? 0,
        createdAt: new Date(e.created_at),
        order: e.order_id ? { connect: { id: id(e.order_id) } } : undefined,
        orderCode: e.order_code,
        points: toNumber(e.point) ?? 0,
        returnPoint: !!e.return_point,
      }
      await transaction.add(
        prisma.loyaltyPointEvent.upsert({
          where: { id: eventData.id },
          create: eventData,
          update: eventData,
        }),
      )
    }

    await transaction.close()

    log(`Synced ${transaction.proceeded()} loyalty events. Failed: ${failed}`)
  }
}
