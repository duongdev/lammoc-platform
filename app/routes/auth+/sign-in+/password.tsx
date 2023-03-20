import {
  Alert,
  Box,
  Button,
  Checkbox,
  PasswordInput,
  Stack,
} from '@mantine/core'
import type { ActionArgs, LoaderFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import {
  Form,
  useActionData,
  useNavigation,
  useSearchParams,
} from '@remix-run/react'

import LockedAuthPhoneInput from '~/components/locked-auth-phone'
import { INVALID_AUTH_CREDENTIALS } from '~/config/messages'
import { signIn } from '~/services/auth.server'
import { createAuthSession } from '~/services/session.server'
import { normalizePhoneNumber } from '~/utils/account'
import { getFormData } from '~/utils/forms'

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url)
  const phone = url.searchParams.get('phone')

  if (!phone) {
    return redirect('..')
  }

  return { phone }
}

export async function action({ request }: ActionArgs) {
  const { phone, password } = await getFormData<{
    phone: string
    password: string
  }>(request)

  if (!(phone && password)) {
    return json({ errorMessage: INVALID_AUTH_CREDENTIALS }, { status: 400 })
  }

  const account = await signIn({ phone: normalizePhoneNumber(phone), password })

  if (!account) {
    return json({ errorMessage: INVALID_AUTH_CREDENTIALS }, { status: 400 })
  }

  return createAuthSession({ accountId: account.id, redirectTo: '/app' })
}

export default function AuthSignInPassword() {
  const actionData = useActionData()
  const { state } = useNavigation()
  const [searchParams] = useSearchParams()

  const phone = searchParams.get('phone')!
  const isSubmitting = state === 'submitting'

  return (
    <Form method="post">
      <Stack>
        <LockedAuthPhoneInput editTo=".." phone={phone} />
        <input hidden readOnly name="phone" value={phone} />
        <PasswordInput
          autoFocus
          required
          disabled={isSubmitting}
          label="Mật khẩu"
          name="password"
          placeholder="••••••••"
        />
        <Checkbox label="Ghi nhớ đăng nhập" name="rememberLogin" />
        {actionData?.errorMessage && (
          <Alert color="red">{actionData.errorMessage}</Alert>
        )}
        <Box>
          <Button loading={isSubmitting} type="submit">
            Đăng nhập
          </Button>
        </Box>
      </Stack>
    </Form>
  )
}
