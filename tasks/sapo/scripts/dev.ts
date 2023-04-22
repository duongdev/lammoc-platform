import { Sapo } from '../services/sapo.service'

async function main() {
  const sapo1 = new Sapo('store-lam-moc')
  const sapo2 = new Sapo('thichtulam')

  await Promise.all([
    await sapo1.syncProducts({
      enforceVat: true,
      updateDb: false,
    }),
    await sapo2.syncProducts({
      enforceVat: true,
      updateDb: false,
    }),
  ])
}

main()
