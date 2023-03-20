import type { FC } from 'react'

import { Box, Paper } from '@mantine/core'
import type { Tenant } from '@prisma/client'
import type { LoaderArgs } from '@remix-run/node'
import { useParams } from '@remix-run/react'

import prisma from '~/libs/prisma.server'
import { getAuthSession } from '~/services/session.server'
import { superjson, useSuperLoaderData } from '~/utils/data'

export async function loader({ request, params }: LoaderArgs) {
  const { tenant } = params
  const { accountId, customerPhones } = await getAuthSession(request)

  if (!(accountId && tenant)) {
    return superjson([])
  }

  // Get event by tenant and customer
  const loyaltyPointEvents = await prisma.loyaltyPointEvent.findMany({
    where: {
      tenant: tenant as Tenant,
      member: { phone: { in: customerPhones } },
    },
  })

  return superjson(loyaltyPointEvents)
}

export type LoyaltyTenantProps = {}

const LoyaltyTenant: FC<LoyaltyTenantProps> = () => {
  const { tenant } = useParams()
  const loyaltyPointEvents = useSuperLoaderData<typeof loader>()
  console.log(loyaltyPointEvents)

  return (
    <Paper withBorder>
      {loyaltyPointEvents.map((pointEvent) => (
        <Box key={pointEvent.id}>{pointEvent.activity}</Box>
      ))}
    </Paper>
  )
}

export default LoyaltyTenant
