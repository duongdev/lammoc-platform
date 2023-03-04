import Debug from 'debug'

import { Sapo } from './sapo.service'
import type { SapoTenant } from './sapo.type'

const _log = Debug('Sapo:sync-sapo')

const syncAll = async (tenant: SapoTenant) => {
  const log = _log.extend(`syncAll:${tenant}`)

  log('Sync sapo data...')
  const sapo = new Sapo(tenant)

  const { account } = await sapo.profiles()
  log(`Signed in as [${account.id}] ${account.full_name}`)

  log(`Sync customers`)
  await sapo.syncCustomers()

  log('Sync product categories')
  await sapo.syncProductCategories()

  log('Sync products')
  await sapo.syncProducts()

  // log('Sync orders')
  // await sapo.syncOrders()
}

const syncNewOrders = async (tenant: SapoTenant): Promise<void> => {
  const log = _log.extend(`syncAll:${tenant}`)

  log('Sync new orders...')
  const sapo = new Sapo(tenant)

  const { account } = await sapo.profiles()
  log(`Signed in as [${account.id}] ${account.full_name}`)

  log('Sync orders')
  await sapo.syncOrders({ onlyModified: true })

  syncNewOrders(tenant)
}

syncNewOrders('store-lam-moc')
syncNewOrders('thichtulam')

syncAll('store-lam-moc')
syncAll('thichtulam')
