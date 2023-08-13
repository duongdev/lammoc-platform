import { SapoLoyalty } from '../services/sapo-loyalty.service'
import { Sapo } from '../services/sapo.service'

async function main() {
  const sapo = new Sapo('thichtulam')

  const importPrice = await sapo.getVariantImportPrice({
    variantId: '236951019'
  })

  console.log(importPrice)
}

main()
