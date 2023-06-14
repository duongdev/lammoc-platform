import { SapoWeb } from 'tasks/sapo/services/sapo-web.service'

async function run() {
  const sapoWeb1 = new SapoWeb('store-lam-moc')
  const sapoWeb2 = new SapoWeb('thichtulam')
  
  await Promise.all([
    sapoWeb1.generateProductDescriptionByVendors(),
    sapoWeb2.generateProductDescriptionByVendors(),
  ])

  run()
}

run()
