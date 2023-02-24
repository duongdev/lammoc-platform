import Debug from 'debug'

import { Sapo } from 'tasks/sapo/sapo.service'

const log = Debug('Sapo:sync-sapo')

export const main = async () => {
  log('Sync sapo data...')
  const sapo = new Sapo('thichtulam')

  const { account } = await sapo.profiles()
  log(`Signed in as [${account.id}] ${account.full_name}`)

  log(`Sync customers`)
  // await sapo.syncCustomers()

  log('Sync product categories')
  // await sapo.syncProductCategories()

  log('Sync products')
  // await sapo.syncProducts()

  log('Sync orders')
  await sapo.syncOrders()
}

main()
