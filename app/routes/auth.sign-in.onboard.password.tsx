import { useEffect, useRef } from 'react'

import { Alert, Button, Group, PasswordInput } from '@mantine/core'
import type { ActionArgs } from '@remix-run/node'
import { redirect, json } from '@remix-run/node'
import { useActionData, useTransition } from '@remix-run/react'

import {
  INVALID_PASSWORD_LENGTH,
  UNABLE_TO_SET_PASSWORD,
} from '~/config/messages'
import { awUsers } from '~/libs/appwrite.server'
import { firebaseAdmin } from '~/libs/firebase.server'
import { JWT_SECRET, sign } from '~/libs/jwt.server'
import {
  getAuthEmailFromPhone,
  getUserIdFromPhone,
  normalizePhoneNumber,
} from '~/utils/account'
import { getFormData } from '~/utils/forms'

export async function action({ request }: ActionArgs) {
  const url = new URL(request.url)
  const phone = url.searchParams.get('phone')
  const token = url.searchParams.get('token')
  const { password } = await getFormData<{ password?: string }>(request)

  if (!(phone && token && password)) {
    return json(
      {
        success: false,
        errorMessage: UNABLE_TO_SET_PASSWORD,
      },
      { status: 400 },
    )
  }

  if ((password?.length ?? 0) < 8) {
    return json(
      {
        success: false,
        errorMessage: INVALID_PASSWORD_LENGTH,
      },
      { status: 400 },
    )
  }

  try {
    const decoded = await firebaseAdmin.auth().verifyIdToken(token)

    if (!decoded.phone_number) {
      return json(
        { success: false, errorMessage: UNABLE_TO_SET_PASSWORD },
        { status: 500 },
      )
    }

    // Phone number not match
    if (
      normalizePhoneNumber(phone) !== normalizePhoneNumber(decoded.phone_number)
    ) {
      return json(
        { success: false, errorMessage: UNABLE_TO_SET_PASSWORD },
        { status: 400 },
      )
    }

    // Update user
    const userId = getUserIdFromPhone(decoded.phone_number)
    const userPhone = normalizePhoneNumber(phone)
    const userEmail = getAuthEmailFromPhone(userPhone)

    await awUsers
      .updatePassword(userId, password)
      .then((res) => console.log(`[updatePassword]`, res))
    await awUsers
      .updateEmail(userId, userEmail)
      .then((res) => console.log(`[updateEmail]`, res))
    await awUsers
      .updateEmailVerification(userId, true)
      .then((res) => console.log(`[updateEmailVerification]`, res))
    await awUsers
      .updatePhoneVerification(userId, true)
      .then((res) => console.log(`[updatePhoneVerification]`, res))

    const appToken = sign({ userId, email: userEmail, password }, JWT_SECRET, {
      expiresIn: '5m',
    })

    return redirect(`/auth/verify?token=${appToken}`, { status: 302 })
  } catch (error: any) {
    console.error(error)
    return json(
      { success: false, errorMessage: UNABLE_TO_SET_PASSWORD },
      { status: 500 },
    )
  }
}

export default function AuthSignInOnboardPassword() {
  const { errorMessage } = useActionData<typeof action>() ?? {}
  const transition = useTransition()
  const passwordRef = useRef<HTMLInputElement>(null)

  const isLoading = transition.type !== 'idle'

  useEffect(() => {
    if (errorMessage) {
      setTimeout(() => passwordRef.current?.focus(), 100)
    }
  }, [errorMessage])

  return (
    <>
      <Alert>
        Hãy thiết lập mật khẩu để thuận tiện cho các lần đăng nhập sau.
      </Alert>

      <PasswordInput
        autoFocus
        required
        disabled={isLoading}
        label="Mật khẩu"
        name="password"
        placeholder="••••••"
        ref={passwordRef}
      />

      {errorMessage && <Alert color="red">{errorMessage}</Alert>}

      <Group>
        <Button loading={isLoading} type="submit">
          Lưu mật khẩu
        </Button>
        <Button disabled color="dark" type="button" variant="default">
          Bỏ qua
        </Button>
      </Group>
    </>
  )
}
