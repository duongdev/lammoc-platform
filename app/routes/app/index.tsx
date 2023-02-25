import type { LoaderArgs, V2_MetaFunction } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { Outlet, useLoaderData } from '@remix-run/react'

import AppBar from '~/components/nav/app-bar'
import { APP_NAME } from '~/config/app-config'
import { AuthProvider } from '~/contexts/auth-context'
import { getAuthAccount } from '~/utils/session.server'

export const meta: V2_MetaFunction = () => [{ title: APP_NAME }]

export async function loader({ request }: LoaderArgs) {
  const account = await getAuthAccount(request)

  if (!(account && account.customer)) {
    const searchParams = new URLSearchParams([['redirectTo', request.url]])
    throw redirect(`/auth/sign-in?${searchParams}`)
  }

  return { account, customer: account.customer }
}

export default function App() {
  const data = useLoaderData()

  return (
    <AuthProvider account={data.account} customer={data.customer} roles={[]}>
      <AppBar
        links={[
          { label: 'Đơn hàng', link: '/app/orders' },
          { label: 'Tài khoản', link: '/app/account' },
        ]}
      />
      <Outlet />
    </AuthProvider>
  )
}
