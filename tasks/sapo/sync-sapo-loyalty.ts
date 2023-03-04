import debug from 'debug'

import { SapoLoyalty } from './sapo-loyalty.service'
import type { SapoTenant } from './sapo.type'

const _log = debug('Sapo:sync-loyalty')

const syncLoyalty = async (tenant: SapoTenant) => {
  const log = _log.extend(`syncLoyalty:${tenant}`)

  log('Sync sapo loyalty...')

  const sapo = new SapoLoyalty(tenant, log)

  await sapo.syncTiers()
  // await sapo.syncLoyaltyMembers()
  await sapo.syncLoyaltyPointEvents()
}

syncLoyalty('store-lam-moc')
