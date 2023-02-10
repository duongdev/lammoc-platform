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
  useSearchParams,
  useTransition,
} from '@remix-run/react'
import { AppwriteException } from 'appwrite'

import LockedAuthPhoneInput from '~/components/locked-auth-phone'
import { INVALID_AUTH_CREDENTIALS, RATE_LIMIT_EXCEEDED } from '~/config/messages'
import { awAccount } from '~/libs/appwrite'
import { awUsers } from '~/libs/appwrite.server'
import { JWT_SECRET, sign } from '~/libs/jwt.server'
import { getAuthEmailFromPhone, getUserIdFromPhone } from '~/utils/account'
import { wait } from '~/utils/common'
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

  const userId = getUserIdFromPhone(phone)
  const userEmail = getAuthEmailFromPhone(phone)

  // Verify
  try {
    const session = await awAccount.createEmailSession(userEmail, password)

    const appToken = sign({ userId, email: userEmail, password }, JWT_SECRET, {
      expiresIn: '5m',
    })

    await awUsers.deleteSession(userId, session.$id)
    await wait(500)

    return redirect(`/auth/verify?token=${appToken}`, { status: 302 })
  } catch (error) {
    console.error(error)
    if (error instanceof AppwriteException && error.code === 429) {
      return json({ errorMessage: RATE_LIMIT_EXCEEDED }, { status: 429 })
    }
  }

  return json({ errorMessage: INVALID_AUTH_CREDENTIALS }, { status: 400 })
}

export default function AuthSignInPassword() {
  const actionData = useActionData<typeof action>()
  const { state } = useTransition()
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
