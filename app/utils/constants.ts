import type { DefaultMantineColor } from '@mantine/core'
import type { Tenant } from '@prisma/client'

export const NOT_FOUND_PRODUCT_NAME = '[Sản phẩm dừng kinh doanh]'

export const ORDER_STATUS: Record<
  string,
  { label: string; color?: DefaultMantineColor }
> = {
  draft: {
    label: 'Đơn mới',
    color: 'cyan',
  },
  finalized: {
    label: 'Đang xử lý',
    color: 'indigo',
  },
  completed: {
    label: 'Hoàn thành',
    color: 'teal',
  },
  cancelled: {
    label: 'Đã huỷ',
    color: 'pink',
  },
}

export const TENANT_LABEL: Record<Tenant, string> = {
  STORE_LAM_MOC: 'Store Làm Mộc',
  THICH_TU_LAM: 'Thích Tự Làm',
}

export const PAYMENT_STATUS: Record<string, string> = {
  unpaid: 'Chưa thanh toán',
  paid: 'Đã thanh toán',
}

export const PAYMENT_INFO_BUTTON_DEFAULT_LABEL = 'Thanh toán ngay'

export const TENANT_BANK: Record<
  Tenant,
  {
    bankName: string
    brandName: string
    accountNumber: string
    accountName: string
  }
> = {
  STORE_LAM_MOC: {
    bankName: 'Ngoại thương Việt Nam (VCB)',
    brandName: 'Hùng Vương (HCM)',
    accountName: 'Công ty TNHH Store Làm Mộc',
    accountNumber: '0421000539383',
  },
  THICH_TU_LAM: {
    bankName: 'Ngoại thương Việt Nam (VCB)',
    brandName: 'Hùng Vương (HCM)',
    accountName: 'Công ty Cổ Phần Thích Tự Làm',
    accountNumber: '0421000547910',
  },
}
