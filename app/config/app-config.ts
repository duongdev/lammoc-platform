import type { AccountRole, Tenant } from '@prisma/client'

export const APP_NAME = 'Store Thích Tự Làm Mộc'
export const PASSWORD_SALT = 10
export const JWT_EXPIRES_IN = '7d'
export const ADMIN_ROLES: AccountRole[] = ['ADMIN', 'DEVELOPER', 'STAFF']
export const ORDER_LIST_MAX_ITEMS = 5
export const LOYALTY_CARD_ASPECT_RATIO = 866 / 540 // ATM card size in mm
export const LOGO_URL: Record<Tenant, string> = {
  STORE_LAM_MOC: '/img/slm-logo.png',
  THICH_TU_LAM: '/img/ttl-logo.png',
}
