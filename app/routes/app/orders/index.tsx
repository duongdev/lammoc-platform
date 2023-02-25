import type { FC } from 'react'

import { Outlet } from '@remix-run/react'

export type OrdersProps = {}

const Orders: FC<OrdersProps> = () => {
  return (
    <>
      <Outlet />
    </>
  )
}

export default Orders
