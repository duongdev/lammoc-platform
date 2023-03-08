import type { FC } from 'react'
import { useMemo, useEffect } from 'react'

import { Box, Group, Image, Paper, SimpleGrid, Text } from '@mantine/core'
import { useInterval } from '@mantine/hooks'
import type { Tenant } from '@prisma/client'
import { useRevalidator } from '@remix-run/react'
import { addDays, formatDistanceToNowStrict } from 'date-fns'
import numeral from 'numeral'

import PageTitle from '~/components/page-title'
import { LOGO_URL } from '~/config/app-config'
import prisma from '~/libs/prisma.server'
import { superjson, useSuperLoaderData } from '~/utils/data'

export async function loader() {
  const order = prisma.order.groupBy({
    by: ['tenant'],
    _count: { _all: true },
    _sum: { total: true },
    _max: { syncedAt: true },
  })

  const customer = prisma.customer.groupBy({
    by: ['tenant'],
    _count: { _all: true },
    _max: { syncedAt: true },
  })

  const account = prisma.account.aggregate({
    _count: { _all: true },
    _max: { lastLoggedIn: true },
  })

  const newAccounts = prisma.account.aggregate({
    where: { createdAt: { gte: addDays(new Date(), -1) } },
    _count: { _all: true },
  })

  const loyaltyPointEvent = prisma.loyaltyPointEvent.groupBy({
    by: ['tenant'],
    _sum: { points: true },
    _max: { syncedAt: true },
  })

  const data = await prisma.$transaction([
    order,
    customer,
    account,
    loyaltyPointEvent,
    newAccounts,
  ])

  return superjson(data)
}

export type AdminIndexProps = {}

const fN = (n: number) => numeral(n).format('0,0')

const AdminIndex: FC<AdminIndexProps> = () => {
  const [order, customer, account, loyaltyPointEvent, newAccounts] =
    useSuperLoaderData<typeof loader>()
  const revalidator = useRevalidator()
  const interval = useInterval(() => revalidator.revalidate(), 5000)

  useEffect(() => {
    // interval.start()
    return interval.stop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const stats = useMemo<StatItemProps[]>(
    () => [
      {
        title: 'Đơn hàng',
        value: order[0]._count._all,
        subValue: numeral(order[0]._sum.total ?? 0).format('0.0 a'),
        tenant: order[0].tenant,
        time: order[0]._max.syncedAt,
      },
      {
        title: 'Đơn hàng',
        value: order[1]._count._all,
        subValue: numeral(order[1]._sum.total ?? 0).format('0.0 a'),
        tenant: order[1].tenant,
        time: order[1]._max.syncedAt,
      },
      {
        title: 'Khách hàng',
        value: customer[0]._count._all,
        time: customer[0]._max.syncedAt,
        tenant: customer[0].tenant,
      },
      {
        title: 'Khách hàng',
        value: customer[1]._count._all,
        time: customer[1]._max.syncedAt,
        tenant: customer[1].tenant,
      },
      {
        title: 'Loyalty',
        value: loyaltyPointEvent[0]._sum.points ?? 0,
        time: loyaltyPointEvent[0]._max.syncedAt,
        tenant: loyaltyPointEvent[0].tenant,
      },
      {
        title: 'Loyalty',
        value: loyaltyPointEvent[1]._sum.points ?? 0,
        time: loyaltyPointEvent[1]._max.syncedAt,
        tenant: loyaltyPointEvent[1].tenant,
      },
      {
        title: 'Tài khoản',
        value: account._count._all,
        subValue: `+${newAccounts._count._all}`,
        timePrefix: 'Đăng nhập',
        time: account._max.lastLoggedIn,
      },
    ],
    [
      account._count._all,
      account._max.lastLoggedIn,
      customer,
      loyaltyPointEvent,
      newAccounts._count._all,
      order,
    ],
  )

  return (
    <>
      <PageTitle>Administration</PageTitle>

      <SimpleGrid
        cols={4}
        mt="4rem"
        breakpoints={[
          { maxWidth: 'md', cols: 3 },
          { maxWidth: 'xs', cols: 1 },
        ]}
      >
        {stats.map((stat) => (
          <StatItem key={stat.title + stat.tenant} {...stat} />
        ))}
      </SimpleGrid>
    </>
  )
}

type StatItemProps = {
  title: string
  value: number
  subValue?: string
  time?: Date | null
  timePrefix?: string
  tenant?: Tenant
}

const StatItem: FC<StatItemProps> = ({
  title,
  value,
  subValue,
  time,
  timePrefix = 'Cập nhật',
  tenant,
}) => {
  return (
    <Paper withBorder p="md" radius="md">
      <Group position="apart" spacing="xs">
        <Text color="dimmed" fw="bold" size="xs" transform="uppercase">
          {title}
        </Text>
        {tenant && <Image mr="-0.5rem" mt="-0.5rem" src={LOGO_URL[tenant]} width={64} />}
      </Group>

      <Box mt="1rem">
        <Group position="apart">
          <Text size="xl">{fN(value)}</Text>
          {subValue && <Text>{subValue}</Text>}
        </Group>
        {time && (
          <Text color="dimmed" size="sm">
            {timePrefix && `${timePrefix} `}
            {time && formatDistanceToNowStrict(time, { addSuffix: true })}
          </Text>
        )}
      </Box>
    </Paper>
  )
}

export default AdminIndex
