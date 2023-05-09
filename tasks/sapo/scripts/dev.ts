import { SapoLoyalty } from '../services/sapo-loyalty.service'

async function main() {
  const sapo = new SapoLoyalty('store-lam-moc')

  await sapo.fixUnintendedLoyaltyPoints()
  // await sapo.adjustLoyaltyPoint('8316', {
  //   adjustPoint: 100,
  //   currentPoint: 2,
  //   customerName: '!!! Dương Test !!!',
  //   phone: '0979477635',
  // })
}

main()
