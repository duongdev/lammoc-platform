import { SapoLoyalty } from '../services/sapo-loyalty.service'
import { Sapo } from '../services/sapo.service'

async function main() {
  const sapo = new Sapo('thichtulam')

  await sapo.syncOneProductVariantPrice({
    variantId: '236951019'
  })
}

main()
