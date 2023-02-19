import { Sapo } from '~/services/sapo/sapo.server'

export const main = async () => {
  console.log('Sync sapo orders')
  const sapo = new Sapo()
  await sapo.refreshCookies('thichtulam')

  const orders = await sapo.getOrders('thichtulam')

  console.log(orders)
}

main()
