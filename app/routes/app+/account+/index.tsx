import type { FC } from 'react'
import { useMemo } from 'react'

import { Group, Stack } from '@mantine/core'
import type { LoaderArgs, V2_MetaFunction } from '@remix-run/node'
import { IconAward, IconShoppingCart } from '@tabler/icons-react'
import { flatten, get } from 'lodash'

import AppMenu from '~/components/nav/app-menu'
import PageTitle from '~/components/page-title'
import prisma from '~/libs/prisma.server'
import { getAuthSession } from '~/services/session.server'
import type { UseDataFunctionReturn } from '~/utils/data'
import { superjson, useSuperLoaderData } from '~/utils/data'
import { getTitle } from '~/utils/meta'
import type { ArrayElement } from '~/utils/types'

import LoyaltyMembers from '../../../components/loyalty/loyalty-members'

export const meta: V2_MetaFunction = ({ data }) => [
  { title: getTitle(get(data, 'json.account.name', 'Tài khoản')) },
]

export async function loader({ request }: LoaderArgs) {
  const { accountId, customerPhones } = await getAuthSession(request)

  const account = accountId
    ? await prisma.account.findUnique({ where: { id: accountId } })
    : null
  const customers = await prisma.customer.findMany({
    where: { phone: { hasSome: customerPhones } },
    include: {
      loyaltyMembers: {
        include: { customer: true, tier: true, nextTier: true },
      },
    },
  })

  return superjson({ account, customers })
}

export type LoyaltyMemberItem = ArrayElement<
  ArrayElement<
    UseDataFunctionReturn<typeof loader>['customers']
  >['loyaltyMembers']
>

export type AccountIndexProps = {}

const AccountIndex: FC<AccountIndexProps> = () => {
  const { account, customers } = useSuperLoaderData<typeof loader>()

  const loyaltyMembers = useMemo(
    () =>
      flatten(customers.map((customer) => customer.loyaltyMembers)).filter(
        (m) => !!m,
      ),
    [customers],
  )

  if (!account) {
    return null
  }

  return (
    <Stack>
      <Group position='apart' pt={2}>
        <PageTitle>Chào, {account.name}</PageTitle>
        <AppMenu
        items={[
          { label: 'Đơn hàng', icon: IconShoppingCart, to: '/app/orders' },
          { label: 'Tích điểm', icon: IconAward, to: '/app/loyalty' },
        ]}
      />
      </Group>

      <LoyaltyMembers members={loyaltyMembers} />
    </Stack>
  )
}

export default AccountIndex
