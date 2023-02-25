import type { FC } from 'react'

import { Box, Tabs, Title } from '@mantine/core'
import type { V2_MetaFunction } from '@remix-run/node'
import { useNavigate, useSearchParams } from '@remix-run/react'

import { getTitle } from '~/utils/meta'

export const meta: V2_MetaFunction = () => [{ title: getTitle('Đơn hàng') }]

export type OrdersIndexProps = {}

const OrdersIndex: FC<OrdersIndexProps> = () => {
  const navigate = useNavigate()
  const [params] = useSearchParams()

  const status = params.get('status') ?? 'all'

  return (
    <>
      <Title>Đơn hàng của bạn</Title>

      <Box mt={24}>
        <Tabs
          defaultValue="all"
          onTabChange={(value) => navigate(`.?status=${value}`)}
          value={status}
        >
          <Tabs.List>
            <Tabs.Tab value="all">Tất cả</Tabs.Tab>
            <Tabs.Tab value="new">Đơn mới</Tabs.Tab>
            <Tabs.Tab value="processing">Đang xử lý</Tabs.Tab>
            <Tabs.Tab value="completed">Hoàn thành</Tabs.Tab>
            <Tabs.Tab value="canceled">Đã huỷ</Tabs.Tab>
          </Tabs.List>
        </Tabs>

        {status}
      </Box>
    </>
  )
}

export default OrdersIndex
