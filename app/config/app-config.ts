import type { AccountRole } from '@prisma/client'

export const APP_NAME = 'Store Thích Tự Làm Mộc'
export const PASSWORD_SALT = 10
export const JWT_EXPIRES_IN = '7d'
export const ADMIN_ROLES: AccountRole[] = ['ADMIN', 'DEVELOPER', 'STAFF']
export const ORDER_LIST_MAX_ITEMS = 5
