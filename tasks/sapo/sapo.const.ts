import type { Tenant } from '@prisma/client'

import type { SapoTenant } from './sapo.type'

export const SAPO_TENANT: Record<SapoTenant, Tenant> = {
  'store-lam-moc': 'STORE_LAM_MOC',
  thichtulam: 'THICH_TU_LAM',
}

export const VAT_IDS = {
  'store-lam-moc': {
    in: 694578,
    out: 694576,
  },
  thichtulam: {
    in: 903819,
    out: 903817,
  },
}

export const BASE_VARIANT_PRICE = 2_000_000
export const VARIANT_PRICE = {
  retail: {
    'store-lam-moc': 705928,
    thichtulam: 919812,
    name: 'Giá bán lẻ',
    fLow: 1,
    fHigh: 1,
  },
  wholesale: {
    'store-lam-moc': 705926,
    thichtulam: 919810,
    name: 'Giá sỉ',
    fLow: 1,
    fHigh: 1,
  },
  tiktok: {
    'store-lam-moc': 1994800,
    thichtulam: 1994793,
    name: 'Giá Tiktok',
    fLow: 0.85,
    fHigh: 0.9,
  },
  shopee: {
    'store-lam-moc': 1994798,
    thichtulam: 1994791,
    name: 'Giá Shopee',
    fLow: 0.85,
    fHigh: 0.9,
  },
  tiki: {
    'store-lam-moc': 1994801,
    thichtulam: 2053898,
    name: 'Giá Tiki',
    fLow: 0.8,
    fHigh: 0.85,
  },
  lazada: {
    'store-lam-moc': 1994799,
    thichtulam: 1994792,
    name: 'Giá Lazada',
    fLow: 0.8,
    fHigh: 0.85,
  },
}
