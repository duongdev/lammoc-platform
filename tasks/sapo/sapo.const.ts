import type { Tenant } from '@prisma/client'

import type { SapoTenant } from './sapo.type'

export const SAPO_TENANT: Record<SapoTenant, Tenant> = {
  'store-lam-moc': 'STORE_LAM_MOC',
  thichtulam: 'THICH_TU_LAM',
}
