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
