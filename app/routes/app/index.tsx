import type { LoaderArgs, V2_MetaFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node'
import { Outlet } from '@remix-run/react'

import { APP_NAME } from '~/config/app-config'
import { AuthProvider } from '~/hooks/useAuth'
import { getAuthAccount } from '~/utils/session.server'

export const meta: V2_MetaFunction = () => [{ title: APP_NAME }]

export async function loader({ request }: LoaderArgs) {
  const account = await getAuthAccount(request)

  if (!(account && account.customer)) {
    const searchParams = new URLSearchParams([['redirectTo', request.url]])
    throw redirect(`/auth/sign-in?${searchParams}`)
  }
  
  return account
}

export default function App() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  )
}
