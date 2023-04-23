import { Sapo } from '../services/sapo.service'

async function main() {
  const sapo = new Sapo('store-lam-moc')

  await sapo.syncProducts({ countLimit: 1000 })
  await sapo.syncProductVariantPrices()
}

main()
