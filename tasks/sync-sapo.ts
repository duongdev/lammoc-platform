import Debug from 'debug'

import { Sapo } from '~/services/sapo/sapo.server'

const log = Debug('Sapo:sync-sapo')

export const main = async () => {
  log('Sync sapo data...')
  const sapo = new Sapo('thichtulam')

  // await sapo.refreshCookies('thichtulam')
  // console.log(await sapo.getCookies())

  // const orders = await sapo.getOrders('thichtulam')

  // console.log(orders)
  const { account } = await sapo.profiles()
  log(`Signed in as [${account.id}] ${account.full_name}`)

  log(`Paginate customers`)
  await sapo.syncCustomers()
}

main()
