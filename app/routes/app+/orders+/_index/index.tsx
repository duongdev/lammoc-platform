import type { FC } from 'react'
import { useMemo, useCallback } from 'react'

import {
  Box,
  Center,
  Group,
  Loader,
  Pagination,
  ScrollArea,
  SegmentedControl,
  Space,
  Stack,
  Tabs,
  TextInput,
} from '@mantine/core'
import { Tenant } from '@prisma/client'
import type { LoaderArgs, V2_MetaFunction } from '@remix-run/node'
import { Form, useNavigation, useSearchParams } from '@remix-run/react'
import { IconSearch } from '@tabler/icons-react'

import EmptyState from '~/components/empty-state'
import OrderItem from '~/components/orders/order-item'
import PageTitle from '~/components/page-title'
import { getCustomerOrders } from '~/services/order.server'
import { getAuthSession } from '~/services/session.server'
import { getSearchParams } from '~/utils/common'
import { ORDER_STATUS } from '~/utils/constants'
import { superjson, useSuperLoaderData } from '~/utils/data'
import { useIsMobile } from '~/utils/hooks'
import { getTitle } from '~/utils/meta'

import OrderStats from './stats'

const PER_PAGE = 20

export const meta: V2_MetaFunction = () => [{ title: getTitle('Đơn hàng') }]

export async function loader({ request }: LoaderArgs) {
  const { customerPhones } = await getAuthSession(request)
  const searchParams = getSearchParams(request)

  const page = +(searchParams.get('page') ?? 1)
  const status = searchParams.get('status') ?? undefined
  const searchText = searchParams.get('searchText') ?? undefined
  const tenant: any = searchParams.get('tenant') ?? undefined

  const { orders, totalCount, totalPages, totalExpense } =
    await getCustomerOrders(customerPhones, {
      skip: (page - 1) * PER_PAGE,
      take: PER_PAGE,
      status: status === 'all' ? undefined : status,
      tenant: tenant === 'all' ? undefined : tenant,
      searchText,
    })

  return superjson({
    orders,
    totalCount,
    page,
    perPage: PER_PAGE,
    totalPages,
    totalExpense,
  })
}

export type OrdersIndexProps = {}

const OrdersIndex: FC<OrdersIndexProps> = () => {
  const [params, setParams] = useSearchParams()
  const { orders, totalPages, page, totalCount, totalExpense } =
    useSuperLoaderData<typeof loader>()
  const navigation = useNavigation()
  const isMobile = useIsMobile()

  const fetching = navigation.state !== 'idle'

  const status = params.get('status') ?? 'all'
  const tenant = params.get('tenant') ?? 'all'
  const searchText = params.get('searchText') ?? ''

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
        <PageTitle>Đơn hàng của bạn</PageTitle>
        <OrderStats expenses={totalExpense} orders={totalCount} />
      </Group>

      <Space h={24} />

      <Group spacing="sm">
        <Form method="get" style={{ flexGrow: 1 }}>
          <TextInput
            defaultValue={searchText}
            icon={<IconSearch />}
            name="searchText"
            placeholder="Tìm đơn hàng..."
            sx={{ '& input': { height: 42 } }}
          />
        </Form>

        <SegmentedControl
          onChange={handleFilterChange('tenant', 'reset_page')}
          style={{ flexWrap: 'nowrap !important' as any }}
          value={tenant}
          data={[
            { label: 'Tất cả', value: 'all' },
            { label: 'Store Làm Mộc', value: Tenant.STORE_LAM_MOC },
            { label: 'Thích Tự Làm', value: Tenant.THICH_TU_LAM },
          ]}
          sx={(theme) => ({
            height: 42,
            border: 'solid 1px',
            borderColor: theme.colors.gray[4],
            '@media (max-width: 640px)': {
              width: '100%',
            },
          })}
        />
      </Group>

      <Space h={24} />

      <Box>
        <ScrollArea
          scrollbarSize={0}
          style={{ width: '100%', paddingRight: 0 }}
        >
          <Tabs
            defaultValue="all"
            onTabChange={handleFilterChange('status', 'reset_page')}
            sx={{ '& > div': { flexWrap: 'nowrap !important' as any } }}
            value={status}
          >
            <Tabs.List>
              <Tabs.Tab value="all">Tất cả</Tabs.Tab>
              {Object.entries(ORDER_STATUS).map(([value, { label, color }]) => (
                <Tabs.Tab color={color} key={value} value={value}>
                  {label}
                </Tabs.Tab>
              ))}
            </Tabs.List>
          </Tabs>
        </ScrollArea>

        {fetching ? (
          <Center mt="lg">
            <Loader />
          </Center>
        ) : (
          <Stack mt="lg" spacing="md">
            {orderList}
            <Space />

            <Center>
              <Pagination
                boundaries={1}
                onChange={handleFilterChange('page')}
                siblings={isMobile ? 0 : 1}
                total={totalPages}
                value={page}
              />
            </Center>
          </Stack>
        )}
      </Box>
    </>
  )
}

export default OrdersIndex
