import type { FC } from 'react'

import { Box, Container, Stack, Title } from '@mantine/core'
import type { ActionArgs } from '@remix-run/node'
import { useFetcher, useLoaderData } from '@remix-run/react'

import prisma from '~/libs/prisma.server'
import { createAuthSession, getAuthSession } from '~/services/session.server'

export const loader = async () => {
  const customers = await prisma.customer.findMany({
    orderBy: { orders: { _count: 'desc' } },
    include: { orders: true, accounts: true },
    take: process.env.NODE_ENV === 'development' ? 50 : undefined,
  })

  return { customers }
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

  console.log('customerPhones', customer.phone)

  return createAuthSession({
    accountId,
    __unsafeDeveloperOverridesPhones: customer.phone,
    redirectTo: '/app',
  })
}

export type CustomerListProps = {}

const CustomerList: FC<CustomerListProps> = () => {
  const { customers } = useLoaderData<typeof loader>()
  const fetcher = useFetcher()

  const handleSignInAsCustomer = (customerId: string) => {
    return fetcher.submit({ customerId }, { method: 'post' })
  }

  return (
    <Container>
      <Title mb={40} mt={40}>
        Khách hàng ({customers.length})
      </Title>

      <Stack spacing={16}>
        {customers.map((customer) => (
          <Box
            key={customer.id}
            onClick={() => handleSignInAsCustomer(customer.id)}
          >
            [{customer.tenant}] <b>{customer.name}</b>{' '}
            {customer.phone.join(' - ')} - {customer.orders.length} đơn
          </Box>
        ))}
      </Stack>
    </Container>
  )
}

export default CustomerList
