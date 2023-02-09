import { Box, Button, Checkbox, PasswordInput, Stack } from '@mantine/core'
import type { LoaderFunction } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { Form, useSearchParams } from '@remix-run/react'

import LockedAuthPhoneInput from '~/components/locked-auth-phone'

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url)
  const phone = url.searchParams.get('phone')

  if (!phone) {
    return redirect('..')
  }

  return { phone }
}

export default function AuthSignInPassword() {
  const [searchParams] = useSearchParams()
  const phone = searchParams.get('phone')!

  return (
    <Form method="post">
      <Stack>
        <LockedAuthPhoneInput editTo=".." phone={phone} />
        <PasswordInput
          autoFocus
          required
          label="Mật khẩu"
          name="password"
          placeholder="••••••••"
        />
        <Checkbox label="Ghi nhớ đăng nhập" name="rememberLogin" />
        <Box>
          <Button type="submit">Đăng nhập</Button>
        </Box>
      </Stack>
    </Form>
  )
}
