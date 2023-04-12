import { Sapo } from './sapo.service'
import { syncAllDb, syncNewOrders } from './sync-sapo-db'
import { syncLoyalty } from './sync-sapo-loyalty'

const main = async () => {
  const slm = new Sapo('store-lam-moc')
  const ttl = new Sapo('thichtulam')

  try {
    // await Promise.all([slm, ttl].map((sapo) => sapo.refreshCookies()))
    await slm.refreshCookies()
    await ttl.refreshCookies()
  } catch (error) {
    console.error(error)
  }

  await Promise.all([
    syncNewOrders('store-lam-moc'),
    syncNewOrders('thichtulam'),
    syncAllDb('store-lam-moc'),
    syncAllDb('thichtulam'),
    syncLoyalty('store-lam-moc'),
    syncLoyalty('thichtulam'),
  ])

  main()
}

main()
