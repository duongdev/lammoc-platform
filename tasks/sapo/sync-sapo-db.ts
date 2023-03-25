import Debug from 'debug'

import { wait } from '~/utils/common'

import { Sapo } from './sapo.service'
import type { SapoTenant } from './sapo.type'

const _log = Debug('Sapo:sync-sapo')

export const syncAllDb = async (tenant: SapoTenant) => {
  const log = _log.extend(`syncAll:${tenant}`)

  try {
    log('Sync sapo data...')
    const sapo = new Sapo(tenant)

    const { account } = await sapo.profiles()
    log(`Signed in as [${account.id}] ${account.full_name}`)

    await Promise.all([
      sapo.syncCustomers(),
      sapo.syncProductCategories(),
      sapo.syncProducts(),
      sapo.syncOrders(),
    ])
  } catch (error) {
    log('ERROR!', error)
  }

  await wait(60_000)
  await syncAllDb(tenant)
}

export const syncNewOrders = async (tenant: SapoTenant): Promise<void> => {
  const log = _log.extend(`syncNewOrders:${tenant}`)

  try {
    log('Sync new orders...')
    const sapo = new Sapo(tenant)

    const { account } = await sapo.profiles()
    log(`Signed in as [${account.id}] ${account.full_name}`)

    log('Sync orders')
    await sapo.syncOrders({ onlyModified: true })
  } catch (error) {
    log('ERROR!', error)
  }

  await wait(60_000)

  syncNewOrders(tenant)
}
