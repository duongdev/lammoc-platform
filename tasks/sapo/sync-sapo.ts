import { syncAllDb, syncNewOrders } from './sync-sapo-db'
import { syncLoyalty } from './sync-sapo-loyalty'

const main = async () => {
  syncNewOrders('store-lam-moc')
  syncNewOrders('thichtulam')
  syncAllDb('store-lam-moc')
  syncAllDb('thichtulam')
  syncLoyalty('store-lam-moc')
  syncLoyalty('thichtulam')
}

main()
