import type { FC } from 'react'
import { useMemo } from 'react'

import { Container } from '@mantine/core'
import type { Account } from '@prisma/client'
import type { LoaderArgs, V2_MetaFunction } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { Outlet } from '@remix-run/react'

import AppBar from '~/components/nav/app-bar'
import { ADMIN_ROLES } from '~/config/app-config'
import { AuthProvider } from '~/contexts/auth-context'
import { getAuthAccount } from '~/services/session.server'
import { superjson, useSuperLoaderData } from '~/utils/data'
import { getTitle } from '~/utils/meta'

export const meta: V2_MetaFunction = () => [
  { title: getTitle('Administration') },
]

export async function loader({ request }: LoaderArgs) {
  const account = await getAuthAccount(request)

  if (!account?.roles.some((role) => ADMIN_ROLES.includes(role))) {
    return redirect('/auth')
  }

  return superjson({ account })
}

export type AdminProps = {}

const Admin: FC<AdminProps> = () => {
  const data = useSuperLoaderData()

  const navLinks = useMemo(() => {
    const links = [
      { label: 'Livestream', link: './streams' },
      { label: 'Khách hàng', link: './customers' },
      { label: 'Tài khoản', link: './accounts' },
    ]

    return links
  }, [])

  if (!data.account) {
    return null
  }

  return (
    <AuthProvider
      account={data.account as Account}
      customerPhones={data.account.phone}
      roles={data.account.roles}
    >
      <AppBar links={navLinks} />
      <Container my={40} sx={{ overflow: 'hidden' }}>
        <Outlet />
      </Container>
    </AuthProvider>
  )
}

export default Admin
