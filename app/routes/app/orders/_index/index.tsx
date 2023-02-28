import type { FC } from 'react'
import { useMemo, useCallback } from 'react'

import {
  Box,
  Center,
  Group,
  Loader,
  Pagination,
  SegmentedControl,
  Space,
  Stack,
  Tabs,
  Title,
} from '@mantine/core'
import { Tenant } from '@prisma/client'
import type { LoaderArgs, V2_MetaFunction } from '@remix-run/node'
import { useSearchParams, useTransition } from '@remix-run/react'

import EmptyState from '~/components/empty-state'
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
  const tenant: any = searchParams.get('tenant') ?? undefined

  const { orders, totalCount, totalPages } = await getCustomerOrders(
    customerPhones,
    {
      skip: (page - 1) * PER_PAGE,
      take: PER_PAGE,
      status: status === 'all' ? undefined : status,
      tenant: tenant === 'all' ? undefined : tenant,
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
  const [params, setParams] = useSearchParams()
  const { orders, totalPages, page } = useSuperLoaderData<typeof loader>()
  const transition = useTransition()

  const status = params.get('status') ?? 'all'
  const tenant = params.get('tenant') ?? 'all'

  const handleFilterChange = useCallback(
    (name: string, action?: 'reset_page') => (value: any) => {
      if (action === 'reset_page') {
        params.delete('page')
      }

      if (value === 'all') {
        params.delete(name)
      } else {
        params.set(name, value)
      }

      setParams(params)
    },
    [params, setParams],
  )

  const orderList = useMemo(() => {
    if (!orders.length) {
      return <EmptyState message="Không có đơn hàng nào" />
    }
    return orders.map((order) => <OrderItem key={order.id} order={order} />)
  }, [orders])

  return (
    <>
      <Group position="apart">
        <Title>Đơn hàng của bạn</Title>
        <SegmentedControl
          onChange={handleFilterChange('tenant', 'reset_page')}
          value={tenant}
          data={[
            { label: 'Tất cả', value: 'all' },
            { label: 'Store Làm Mộc', value: Tenant.STORE_LAM_MOC },
            { label: 'Thích Tự Làm', value: Tenant.THICH_TU_LAM },
          ]}
        />
      </Group>

      <Box mt={24}>
        <Tabs
          defaultValue="all"
          onTabChange={handleFilterChange('status', 'reset_page')}
          value={status}
        >
          <Tabs.List>
            <Tabs.Tab value="all">Tất cả</Tabs.Tab>
            <Tabs.Tab value="new">Đơn mới</Tabs.Tab>
            <Tabs.Tab value="processing">Đang xử lý</Tabs.Tab>
            <Tabs.Tab value="completed">Hoàn thành</Tabs.Tab>
            <Tabs.Tab value="cancelled">Đã huỷ</Tabs.Tab>
          </Tabs.List>
        </Tabs>

        {transition.state === 'loading' ? (
          <Center mt="lg">
            <Loader />
          </Center>
        ) : (
          <Stack mt="lg" spacing="md">
            {orderList}
            <Space />

            <Center>
              <Pagination
                onChange={handleFilterChange('page')}
                page={page}
                total={totalPages}
              />
            </Center>
          </Stack>
        )}
      </Box>
    </>
  )
}

export default OrdersIndex
