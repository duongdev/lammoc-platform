import type { FC } from 'react'

import {
  Box,
  Container,
  Pagination,
  Stack,
  TextInput,
  Title,
} from '@mantine/core'
import type { ActionArgs, LoaderArgs } from '@remix-run/node'
import {
  Form,
  useFetcher,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from '@remix-run/react'

import prisma from '~/libs/prisma.server'
import { createAuthSession, getAuthSession } from '~/services/session.server'
import { normalizePhoneNumber } from '~/utils/account'
import { getSearchParams } from '~/utils/common'

const PER_PAGE = 20

export const loader = async ({ request }: LoaderArgs) => {
  const searchParams = getSearchParams(request)
  const page = +(searchParams.get('page') ?? 1)
  const search = searchParams.get('search')
  const status = searchParams.get('status')

  const customers = await prisma.customer.findMany({
    where: {
      phone: search ? { has: normalizePhoneNumber(search) } : undefined,
      orders: status ? { some: { status } } : undefined,
    },
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
    <Container sx={{ marginTop: 40, marginBottom: 40 }}>
      <Title mb={40}>Khách hàng ({totalCount})</Title>

      <Stack spacing={16}>
        <Form method="get">
          <TextInput name="search" placeholder="Search SĐT" />
        </Form>
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
        page={page}
        total={totalCount / PER_PAGE}
      />
    </Container>
  )
}

export default CustomerList
