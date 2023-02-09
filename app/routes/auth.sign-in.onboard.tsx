import { Stack } from '@mantine/core'
import type { LoaderFunction } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { Form, Outlet, useSearchParams } from '@remix-run/react'

import LockedAuthPhoneInput from '~/components/locked-auth-phone'

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url)
  const phone = url.searchParams.get('phone')

  if (!phone) {
    return redirect('..')
  }

  return { phone }
}

export default function AuthSignInOnboard() {
  const [searchParams] = useSearchParams()
  const phone = searchParams.get('phone')!

  return (
    <Form method="post">
      <Stack>
        <LockedAuthPhoneInput editTo=".." phone={phone ?? ''} />
        <Outlet />
      </Stack>
    </Form>
  )
}
