import { Container } from '@mantine/core'
import type { LoaderArgs, V2_MetaFunction } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { Outlet, useLoaderData } from '@remix-run/react'

import AppBar from '~/components/nav/app-bar'
import { APP_NAME } from '~/config/app-config'
import { AuthProvider } from '~/contexts/auth-context'
import { getAuthAccount, getAuthSession } from '~/services/session.server'

export const meta: V2_MetaFunction = () => [{ title: APP_NAME }]

export async function loader({ request }: LoaderArgs) {
  const account = await getAuthAccount(request)
  const { customerPhones } = await getAuthSession(request)

  if (!account) {
    console.warn('account not found in session', { account })
    const searchParams = new URLSearchParams([['redirectTo', request.url]])
    throw redirect(`/auth/sign-in?${searchParams}`)
  }

  return { account, customerPhones }
}

export default function App() {
  const data = useLoaderData()

  return (
    <AuthProvider
      account={data.account}
      customerPhones={data.customerPhones}
      roles={data.account.roles}
    >
      <AppBar
        links={[
          { label: 'Đơn hàng', link: '/app/orders' },
          { label: 'Tài khoản', link: '/app/user' },
        ]}
      />
      <Container my={40}>
        <Outlet />
      </Container>
    </AuthProvider>
  )
}
