import debug from 'debug'

import { wait } from '~/utils/common'

import { SapoLoyalty } from './sapo-loyalty.service'
import type { SapoTenant } from './sapo.type'

const _log = debug('Sapo:sync-loyalty')

export const syncLoyalty = async (tenant: SapoTenant) => {
  const log = _log.extend(`syncLoyalty:${tenant}`)

  log('Sync sapo loyalty...')

  const sapo = new SapoLoyalty(tenant, log)

  try {
    await sapo.syncTiers()
  } catch (error) {
    log('sync tiers failed', error)
  }

  try {
    await sapo.syncLoyaltyMembers()
  } catch (error) {
    log('sync members failed', error)
  }

  try {
    await sapo.syncLoyaltyPointEvents()
  } catch (error) {
    log('sync point events failed', error)
  }

  await wait(60_000)
}
