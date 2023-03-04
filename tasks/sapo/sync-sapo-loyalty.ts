import debug from 'debug'

import { wait } from '~/utils/common'

import { SapoLoyalty } from './sapo-loyalty.service'
import type { SapoTenant } from './sapo.type'

const _log = debug('Sapo:sync-loyalty')

export const syncLoyalty = async (tenant: SapoTenant) => {
  const log = _log.extend(`syncLoyalty:${tenant}`)

  log('Sync sapo loyalty...')

  const sapo = new SapoLoyalty(tenant, log)

  await sapo.syncTiers()
  await sapo.syncLoyaltyMembers()
  await sapo.syncLoyaltyPointEvents()

  await wait(60_000)

  syncLoyalty(tenant)
}
