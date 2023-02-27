import type { FC } from 'react'

import { Box, Pagination, Space, Stack, Tabs, Title } from '@mantine/core'
import type { LoaderArgs, V2_MetaFunction } from '@remix-run/node'
import { useNavigate, useSearchParams } from '@remix-run/react'

import OrderItem from '~/components/order-item'
import { getCustomerOrders } from '~/services/order.server'
import { getAuthSession } from '~/services/session.server'
import { getSearchParams } from '~/utils/common'
import { superjson, useSuperLoaderData } from '~/utils/data'
import { getTitle } from '~/utils/meta'

const PER_PAGE = 20

export const meta: V2_MetaFunction = () => [{ title: getTitle('Đơn hàng') }]

export async function loader({ request }: LoaderArgs) {
  const { customerPhones } = await getAuthSession(request)
  const searchParams = getSearchParams(request)

  const page = +(searchParams.get('page') ?? 1)
  const status = searchParams.get('status') ?? undefined

  const { orders, totalCount, totalPages } = await getCustomerOrders(
    customerPhones,
    {
      skip: (page - 1) * PER_PAGE,
      take: PER_PAGE,
      status,
    },
  )

  return superjson({
    orders,
    totalCount,
    page,
    perPage: PER_PAGE,
    totalPages,
  })
}

export type OrdersIndexProps = {}

const OrdersIndex: FC<OrdersIndexProps> = () => {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { orders, totalPages, page } = useSuperLoaderData<typeof loader>()

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

        <Stack mt="lg" spacing="md">
          {orders.map((order) => (
            <OrderItem key={order.id} order={order} />
          ))}

          <Space />

          <Pagination
            onChange={(page) => navigate(`?page=${page}`)}
            page={page}
            total={totalPages}
          />
        </Stack>
      </Box>
    </>
  )
}

export default OrdersIndex
