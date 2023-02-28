import Debug from 'debug'

import { Sapo } from './sapo.service'
import type { SapoTenant } from './sapo.type'

const log = Debug('Sapo:sync-sapo')

export const sync = async (tenant: SapoTenant) => {
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

  log('Sync orders')
  await sapo.syncOrders()
}

sync('store-lam-moc')
  .then(() => sync('thichtulam'))
  .then(() => process.exit(0))
