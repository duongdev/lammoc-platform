import type { FC } from 'react'

import type { Account } from '@prisma/client'
import type { LoaderArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { Outlet, useLoaderData } from '@remix-run/react'

import { ADMIN_ROLES } from '~/config/app-config'
import { AuthProvider } from '~/contexts/auth-context'
import { getAuthAccount } from '~/utils/session.server'

export async function loader({ request }: LoaderArgs) {
  const account = await getAuthAccount(request)

  if (!account?.roles.some((role) => ADMIN_ROLES.includes(role))) {
    return redirect('/auth')
  }

  return { account }
}

export type AdminProps = {}

const Admin: FC<AdminProps> = () => {
  const data = useLoaderData()

  if (!data.account) {
    return null
  }

  return (
    <AuthProvider account={data.account as Account} roles={data.account.roles}>
      <Outlet />
    </AuthProvider>
  )
}

export default Admin
