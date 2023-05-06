import { SapoLoyalty } from "../services/sapo-loyalty.service"

async function main() {
  const sapo = new SapoLoyalty('store-lam-moc')

  await sapo.syncTiers()
  await sapo.syncLoyaltyMembers()
  await sapo.syncLoyaltyPointEvents()
}

main()
