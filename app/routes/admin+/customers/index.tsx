import type { FC } from 'react'

import { Box, Group, Pagination, Stack, TextInput } from '@mantine/core'
import type { Prisma } from '@prisma/client'
import type { ActionArgs, LoaderArgs } from '@remix-run/node'
import {
  Form,
  useFetcher,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from '@remix-run/react'
import { IconSearch } from '@tabler/icons-react'

import PageTitle from '~/components/page-title'
import prisma from '~/libs/prisma.server'
import { createAuthSession, getAuthSession } from '~/services/session.server'
import { normalizePhoneNumber } from '~/utils/account'
import { getSearchParams, normalizeSearchText } from '~/utils/common'

const PER_PAGE = 20

export const loader = async ({ request }: LoaderArgs) => {
  const searchParams = getSearchParams(request)
  const page = +(searchParams.get('page') ?? 1)
  const search = searchParams.get('search')
  const status = searchParams.get('status')

  const where: Prisma.CustomerWhereInput = {
    orders: status ? { some: { status } } : undefined,
  }

  if (search) {
    where.OR = [
      { phone: search ? { has: normalizePhoneNumber(search) } : undefined },
      {
        name: search ? { search: normalizeSearchText(search) } : undefined,
      },
    ]
  }

  const customers = await prisma.customer.findMany({
    where,
    orderBy: { orders: { _count: 'desc' } },
    include: { _count: true },
    take: PER_PAGE,
    skip: (page - 1) * PER_PAGE,
  })

  const totalCount = await prisma.customer.count()

  return { customers, totalCount }
}

export const action = async ({ request }: ActionArgs) => {
  const customerId = (await request.formData()).get('customerId')
  const { accountId } = await getAuthSession(request)

  const customer = await prisma.customer.findUnique({
    where: { id: customerId?.toString() ?? '' },
  })

  if (!(accountId && customer)) {
    return null
  }

  return createAuthSession({
    accountId,
    __unsafeDeveloperOverridesPhones: customer.phone,
    redirectTo: '/app',
  })
}

export type CustomerListProps = {}

const CustomerList: FC<CustomerListProps> = () => {
  const { customers, totalCount } = useLoaderData<typeof loader>()
  const fetcher = useFetcher()
  const [search] = useSearchParams()
  const navigate = useNavigate()
  const page = +(search.get('page') ?? 1)

  const handleSignInAsCustomer = (customerId: string) => {
    return fetcher.submit({ customerId }, { method: 'post' })
  }

  return (
    <>
      <Group position="apart">
        <PageTitle count={totalCount}>Khách hàng</PageTitle>
        <Form method="get">
          <TextInput
            defaultValue={search.get('search') ?? ''}
            icon={<IconSearch size="1rem" />}
            name="search"
            placeholder="Tìm khách hàng..."
          />
        </Form>
      </Group>

      <Stack mt="lg" spacing={16}>
        {customers.map((customer) => (
          <Box
            key={customer.id}
            onClick={() => handleSignInAsCustomer(customer.id)}
            sx={{ cursor: 'pointer' }}
          >
            [{customer.tenant}] <b>{customer.name}</b>{' '}
            {customer.phone.join(' - ')} - {customer._count.orders} đơn .{' '}
            {/* {customer._count} */}
          </Box>
        ))}
      </Stack>

      <Pagination
        mt={32}
        onChange={(page) => navigate({ search: `page=${page}` })}
        total={totalCount / PER_PAGE}
        value={page}
      />
    </>
  )
}

export default CustomerList
