import type { FC } from 'react'

import {
  ActionIcon,
  Badge,
  Group,
  Menu,
  Table,
  Text,
  TextInput,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import type { Prisma } from '@prisma/client'
import type { LoaderArgs, V2_MetaFunction } from '@remix-run/node'
import { Form, useSearchParams } from '@remix-run/react'
import {
  IconDotsVertical,
  IconSearch,
  IconUserBolt,
  IconUserX,
} from '@tabler/icons-react'
import { format } from 'date-fns'
import numeral from 'numeral'

import { UpdateAccountRolesModal } from '~/components/accounts/update-account-roles'
import PageTitle from '~/components/page-title'
import prisma from '~/libs/prisma.server'
import { normalizePhoneNumber } from '~/utils/account'
import { getSearchParams, normalizeSearchText } from '~/utils/common'
import type { UseDataFunctionReturn } from '~/utils/data'
import { superjson, useSuperLoaderData } from '~/utils/data'
import { getTitle } from '~/utils/meta'
import type { ArrayElement } from '~/utils/types'

export const meta: V2_MetaFunction = () => [{ title: getTitle('Tài khoản') }]

export async function loader({ request }: LoaderArgs) {
  const searchParams = getSearchParams(request)

  const searchText = searchParams.get('search')

  const where: Prisma.AccountWhereInput = {}

  if (searchText) {
    where.OR = [
      { name: normalizeSearchText(searchText) },
      { phone: normalizePhoneNumber(searchText) },
    ]
  }

  const accounts = await prisma.account.findMany({
    where,
    orderBy: {
      customer: { orders: { _count: 'desc' } },
    },
    include: {
      customer: { include: { orders: { include: { _count: true } } } },
    },
  })
  return superjson({ accounts })
}

export type AccountsProps = {}

type AccountItem = ArrayElement<
  UseDataFunctionReturn<typeof loader>['accounts']
>

const Accounts: FC<AccountsProps> = () => {
  const { accounts } = useSuperLoaderData<typeof loader>()
  const [searchParams] = useSearchParams()

  const searchText = searchParams.get('search') ?? ''

  return (
    <>
      <Group position="apart">
        <PageTitle count={accounts.length}>Tài khoản</PageTitle>
        <Form method="get">
          <TextInput
            defaultValue={searchText}
            icon={<IconSearch size="1rem" />}
            name="search"
            placeholder="Tìm kiếm..."
          />
        </Form>
      </Group>
      <Table mt="sm">
        <thead>
          <tr>
            <th>Khách hàng</th>
            <th>Đơn hàng</th>
            <th>Đăng nhập</th>
            <th>Phân quyền</th>
            <th style={{ width: 1 }} />
          </tr>
        </thead>
        <tbody>
          {accounts.map((account) => (
            <tr key={account.id}>
              <Account account={account} />
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  )
}

const Account: FC<{ account: AccountItem }> = ({ account }) => {
  const [updateRoleOpen, { open, close }] = useDisclosure(false)

  return (
    <>
      <td>
        <Text>{account.name}</Text>
        <Text color="dimmed">{account.phone}</Text>
      </td>
      <td>
        <Text>
          {numeral(account.customer?.orders.length ?? 0).format('0,0')}
        </Text>
      </td>
      <td>
        <Text>
          {account.lastLoggedIn
            ? format(account.lastLoggedIn, 'HH:mm:ss dd/MM/yy')
            : 'N/A'}
        </Text>
      </td>
      <td>
        <Group spacing="xs">
          {account.roles.map((role) => (
            <Badge color="blue" key={role}>{role}</Badge>
          ))}
        </Group>
      </td>
      <td>
        <Menu width={200}>
          <Menu.Target>
            <ActionIcon>
              <IconDotsVertical />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item icon={<IconUserBolt />} onClick={open}>
              Phân quyền
            </Menu.Item>
            <Menu.Item disabled color="red" icon={<IconUserX />}>
              Vô hiệu hoá
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </td>
      <UpdateAccountRolesModal
        accountId={account.id}
        onClose={close}
        opened={updateRoleOpen}
        roles={account.roles}
        onUpdated={() => {
          close()
          notifications.show({
            title: 'Thành công',
            message: 'Đã cập nhật phân quyền',
            color: 'teal',
          })
        }}
      />
    </>
  )
}

export default Accounts
