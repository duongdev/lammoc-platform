import type { FC } from 'react'

import { Box, Stack } from '@mantine/core'
import type { Account } from '@prisma/client'
import { useLoaderData } from '@remix-run/react'

import prisma from '~/libs/prisma.server'

export async function loader() {
  const accounts = await prisma.account.findMany()
  return { accounts }
}

export type AccountsProps = {}

const Accounts: FC<AccountsProps> = () => {
  const { accounts } = useLoaderData<{ accounts: Account[] }>()

  return (
    <Stack spacing="md">
      {accounts.map((account) => (
        <Box key={account.id}>{account.name}</Box>
      ))}
    </Stack>
  )
}

export default Accounts
