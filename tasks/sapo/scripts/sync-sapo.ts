import Debug from 'debug'

import { wait } from '~/utils/common'

import type { SapoTenant } from '../sapo.type'
import { SapoLoyalty } from '../services/sapo-loyalty.service'
import { Sapo } from '../services/sapo.service'

const main = async () => {
  const slm = new Sapo('store-lam-moc')
  const ttl = new Sapo('thichtulam')

  try {
    // Verify credentials before running
    await slm.profiles()
    await ttl.profiles()
  } catch (error) {
    // Retry verify credentials until success
    console.error(error)
    main()
    return
  }

  await Promise.all([
    syncNewOrders('store-lam-moc'),
    syncNewOrders('thichtulam'),
    syncAllDb('store-lam-moc'),
    syncAllDb('thichtulam'),
    syncLoyalty('store-lam-moc'),
    syncLoyalty('thichtulam'),
  ])

  await wait(60_000)
  main()
}

main()

const _log = Debug('Sapo:sync-sapo')

export const syncAllDb = async (tenant: SapoTenant) => {
  const log = _log.extend(`syncAll:${tenant}`)

  try {
    log('Sync sapo data...')
    const sapo = new Sapo(tenant)

    const { account } = await sapo.profiles()
    log(`Signed in as [${account.id}] ${account.full_name}`)

    await Promise.all([
      sapo.syncCustomers(),
      sapo.syncProductCategories(),
      sapo.syncProducts(),
      sapo.syncProductVariantPrices(),
    ])
  } catch (error) {
    log('ERROR!', error)
  }

  await wait(60_000)
}

export const syncNewOrders = async (tenant: SapoTenant): Promise<void> => {
  const log = _log.extend(`syncNewOrders:${tenant}`)

  try {
    log('Sync new orders...')
    const sapo = new Sapo(tenant)

    const { account } = await sapo.profiles()
    log(`Signed in as [${account.id}] ${account.full_name}`)

    log('Sync orders')
    await sapo.syncOrders({ onlyModified: true })
  } catch (error) {
    log('ERROR!', error)
  }
}

export const syncLoyalty = async (tenant: SapoTenant) => {
  const log = _log.extend(`syncLoyalty:${tenant}`)

  log('Sync sapo loyalty...')

  const sapo = new SapoLoyalty(tenant, log)

  try {
    await sapo.syncTiers()
  } catch (error) {
    log('sync tiers failed', error)
  }

  try {
    await sapo.syncLoyaltyMembers()
  } catch (error) {
    log('sync members failed', error)
  }

  try {
    await sapo.syncLoyaltyPointEvents()
  } catch (error) {
    log('sync point events failed', error)
  }

  await wait(60_000)
}
