import { useMemo } from 'react'

import { Container } from '@mantine/core'
import type { LoaderArgs, V2_MetaFunction } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { Outlet, useCatch } from '@remix-run/react'

import ErrorHandler from '~/components/error-handler'
import AppBar from '~/components/nav/app-bar'
import { ADMIN_ROLES, APP_NAME } from '~/config/app-config'
import { AuthProvider } from '~/contexts/auth-context'
import { getAuthAccount, getAuthSession } from '~/services/session.server'
import { superjson, useSuperLoaderData } from '~/utils/data'

export const meta: V2_MetaFunction = () => [{ title: APP_NAME }]

export async function loader({ request }: LoaderArgs) {
  const account = await getAuthAccount(request)
  const { customerPhones } = await getAuthSession(request)

  if (!account) {
    console.warn('account not found in session', { account })
    const searchParams = new URLSearchParams([['redirectTo', request.url]])
    throw redirect(`/auth/sign-in?${searchParams}`)
  }

  return superjson({ account, customerPhones })
}

export default function App() {
  const data = useSuperLoaderData<typeof loader>()

  const navLinks = useMemo(() => {
    const links = [
      { label: 'Tài khoản', link: '/app/account' },
      { label: 'Đơn hàng', link: '/app/orders' },
    ]

    if (data.account.roles.some((role) => ADMIN_ROLES.includes(role))) {
      links.push({ label: 'Admin', link: '/admin' })
    }

    return links
  }, [data.account.roles])

  return (
    <AuthProvider
      account={data.account}
      customerPhones={data.customerPhones}
      roles={data.account.roles}
    >
      <AppBar links={navLinks} />
      <Container my={40} sx={{ overflow: 'hidden' }}>
        <Outlet />
      </Container>
    </AuthProvider>
  )
}

export function CatchBoundary() {
  const caught = useCatch()
  console.log('app/_layout.tsx')
  return (
    <Container sx={{ display: 'grid', placeItems: 'center' }}>
      <ErrorHandler caught={caught} />
    </Container>
  )
}
