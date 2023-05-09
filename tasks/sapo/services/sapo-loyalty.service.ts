import type {
  LoyaltyMember,
  LoyaltyPointEvent,
  LoyaltyTier,
  Prisma,
  Tenant,
} from '@prisma/client'
import { isAfter, isSameDay } from 'date-fns'
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
  SapoLoyaltyAdjustItem,
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
        description: t.description ?? [],
        imageUrl: t.image.path,
        minCondition: toNumber(t.min_condition ?? 0),
        updatedAt: new Date(t.updated_at),
        rewards: t.rewards
          ? {
              connectOrCreate: t.rewards.map((r) => ({
                where: { id: id(r.id) },
                create: {
                  id: id(r.id),
                  name: r.name,
                  point: toNumber(r.point),
                  imageUrl: r.image.path,
                  tenant: this.DB_TENANT,
                },
              })),
            }
          : undefined,
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

    for await (const member of paginate) {
      const customer = await prisma.customer.findFirst({
        where: {
          phone: { has: normalizePhoneNumber(member.phone) },
          tenant: this.DB_TENANT,
        },
      })

      if (!customer) {
        log(`Customer not found:`, member.phone)
        failed += 1

        continue
      }

      const tier = await prisma.loyaltyTier.findUnique({
        where: { id: id(member.tier.tier_id) },
      })

      if (!tier) {
        log(`Tier not found:`, member.tier.tier_name, member.tier.tier_id)
        failed += 1

        continue
      }

      const memberData: Prisma.LoyaltyMemberCreateInput = {
        id: id(member.id),
        tenant: this.DB_TENANT,
        customer: { connect: { id: customer.id } },
        phone: normalizePhoneNumber(member.phone),
        status: member.status,
        tier: { connect: { id: id(member.tier.tier_id) } },
        createdAt: new Date(member.created_at),
        expireDate: member.expire_date && new Date(member.expire_date),
        lastActivityAt: member.activity_at && new Date(member.activity_at),
        lastOrderAt: member.last_order && new Date(member.last_order),
        nextTierRemainingMoney: toNumber(
          member.tier.remaining_money_for_next_tier ?? 0,
        ),
        nextCondition: member.tier.next_condition,
        nextTierRemainingPoints: member.tier.remaining_point_for_next_tier,
        points: toNumber(member.present_point ?? 0),
        tierSpentPeriod: toNumber(member.tier_spent_period ?? 0),
        totalSpent: toNumber(member.total_spent ?? 0),
        totalOrders: toNumber(member.total_order ?? 0),
        totalUncompletedOrders: toNumber(member.total_uncompleted_order ?? 0),
        updatedAt: new Date(member.updated_at),
        usedPoints: toNumber(member.used_point ?? 0),
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

    for await (const loyaltyEvent of paginate) {
      const order =
        loyaltyEvent.order_id &&
        (await prisma.order.findUnique({
          where: { id: id(loyaltyEvent.order_id) },
        }))

      if (!loyaltyEvent.order_id && !order) {
        log(
          'Failed to update loyalty event. Order not found',
          loyaltyEvent.order_id,
        )
        failed += 1
        continue
      }

      const member =
        loyaltyEvent.customer_id &&
        (await prisma.loyaltyMember.findUnique({
          where: { id: id(loyaltyEvent.customer_id) },
        }))

      if (loyaltyEvent.customer_id && !member) {
        log(
          'Failed to update loyalty event. Customer not found',
          loyaltyEvent.customer_id,
        )
        failed += 1
        continue
      }

      const eventData: Prisma.LoyaltyPointEventCreateInput = {
        id: id(loyaltyEvent.id),
        tenant: this.DB_TENANT,
        activity: loyaltyEvent.activity,
        code: loyaltyEvent.code,
        member: { connect: { id: id(loyaltyEvent.customer_id) } },
        adjustPoints: toNumber(loyaltyEvent.adjust_point) ?? 0,
        createdAt: new Date(loyaltyEvent.created_at),
        order: loyaltyEvent.order_id
          ? { connect: { id: id(loyaltyEvent.order_id) } }
          : undefined,
        orderCode: loyaltyEvent.order_code,
        points: toNumber(loyaltyEvent.point) ?? 0,
        returnPoint: !!loyaltyEvent.return_point,
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

  /** Mr. Vinh's request
   * He updated points for some customers in Sapo
   * by mistake, and he wants to fix it.
   * This function should only run once.
   */
  async fixUnintendedLoyaltyPoints() {
    const log = this.log.extend(this.fixUnintendedLoyaltyPoints.name)

    log(`Starting...`)

    const paginate = this.sapo.paginate<SapoLoyaltyMemberItem>(
      'customers',
      getPaginationOptions({
        searchParams: {
          sort: 'createdAt,ASC',
        },
        perPage: 250,
      }),
    )

    let count = 0
    let adjustQueue: SapoLoyaltyAdjustItem[] = []
    let proceeded = 0

    const clearQueue = () => {
      adjustQueue = []
    }

    const proceedQueue = async () => {
      await this.adjustLoyaltyPoint(adjustQueue)
      proceeded += adjustQueue.length

      log(`\n\nProceeded ${proceeded} unintended adjust points\n\n`)

      clearQueue()
    }

    const addAdjustItem = async (adjustItem: SapoLoyaltyAdjustItem) => {
      adjustQueue.push(adjustItem)

      if (adjustQueue.length >= 100) {
        await proceedQueue()
      }
    }

    for await (const member of paginate) {
      count += 1

      // Get his latest point events from Sapo
      const result = await this.sapo
        .get(
          `customers/point-event?id=${member.id}&page=0&per_page=250`, // Assume that he has less than 250 point events
        )
        .json<{ data: SapoLoyaltyPointEventItem[] }>()

      const pointEvents = result.data

      const unintendedUpdate = pointEvents.find(
        (event) =>
          // Has bonus up rank event with "200.00"
          event.code === 'bonus_up_rank' &&
          event.adjust_point === '200.00' &&
          // It's created within May 06 2023,
          isSameDay(new Date(event.created_at), new Date('2023-05-06')),
      )

      if (!unintendedUpdate) {
        log('Skipped unintended update')
        continue
      }

      const revertUpdate = pointEvents.find(
        (event) =>
          event.code === 'adjust_manual_point' &&
          +event.adjust_point <= -199 &&
          // It's created after May 08 2023,
          isAfter(new Date(event.created_at), new Date('2023-05-08')),
      )

      if (revertUpdate) {
        log('Skipped reverted')
        continue
      }

      log(
        `[${count}] Fixing unintended update for member [${member.id}] ${member.full_name} (${member.phone}) https://loyalty.sapocorp.net/admin/customers/${member.id}`,
      )

      // Revert the update
      // Don't need to await
      await addAdjustItem({
        customerId: member.id.toString(),
        adjustPoint: +member.present_point - 200,
        currentPoint: +member.present_point,
        customerName: member.full_name,
        phone: member.phone,
      })
    }

    await proceedQueue()

    log(
      `Finished fixing unintended loyalty points for ${proceeded}/${count} members`,
    )
  }

  async adjustLoyaltyPoint(adjustItems: SapoLoyaltyAdjustItem[]) {
    const log = this.log.extend(`${this.adjustLoyaltyPoint.name}`)

    const items = adjustItems.map(
      ({ adjustPoint, currentPoint, customerId, customerName, phone }) => ({
        adjust_point: adjustPoint,
        currentPoint: currentPoint,
        note: '',
        phone,
        customerName,
        customerId: customerId,
        showNote: false,
      }),
    )

    const adjustTicket = await this.sapo
      .post('adjust-paper', {
        json: {
          id: 0,
          code: '',
          note: '',
          tags: [],
          type: 'point',
          items,
        },
      })
      .json<{ id: number }>()

    log(`Adjust ticket created:`, adjustTicket.id)

    // Publish the ticket
    await this.sapo.put(`adjust-paper/${adjustTicket.id}?mode=adjust`, {
      json: {
        note: '',
        tags: [],
      },
    })

    log(`Adjust ticket published successfully`)
  }
}
