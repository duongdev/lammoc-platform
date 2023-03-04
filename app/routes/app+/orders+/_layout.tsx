import type { FC } from 'react'

import {
  Container,
} from '@mantine/core'
import { Outlet, useCatch } from '@remix-run/react'

import ErrorHandler from '~/components/error-handler'

export type OrdersProps = {}

const Orders: FC<OrdersProps> = () => {
  return (
    <>
      <Outlet />
    </>
  )
}

export function CatchBoundary() {
  const caught = useCatch()
  console.log('app/orders/index.tsx')
  return (
    <Container sx={{ display: 'grid', placeItems: 'center' }}>
      <ErrorHandler caught={caught} />
    </Container>
  )
}

export default Orders
