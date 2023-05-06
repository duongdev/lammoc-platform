import { Sapo } from '../services/sapo.service'

async function main() {
  const sapo = new Sapo('thichtulam')

  await sapo.syncProducts()
  await sapo.syncProductVariantPrices()
}

main()
