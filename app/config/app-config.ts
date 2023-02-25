import type { AccountRole } from '@prisma/client'

export const APP_NAME = 'Thích Làm Mộc'
export const PASSWORD_SALT = 10
export const JWT_EXPIRES_IN = '7d'
export const ADMIN_ROLES: AccountRole[] = ['ADMIN', 'DEVELOPER', 'STAFF']
