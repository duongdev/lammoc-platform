import type { V2_MetaFunction } from '@remix-run/node'
import { Outlet } from '@remix-run/react'

import { APP_NAME } from '~/config/app-config'
import { AuthProvider } from '~/hooks/useAuth'

export const meta: V2_MetaFunction = () => [{ title: APP_NAME }]

export default function App() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  )
}
