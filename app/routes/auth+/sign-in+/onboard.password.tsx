import { useEffect, useRef } from 'react'

import { Alert, Button, Group, PasswordInput } from '@mantine/core'
import type { ActionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useActionData, useNavigation } from '@remix-run/react'

import { MIN_PASSWORD_LENGTH, PASSWORD_SALT } from '~/config/app-config'
import {
  CUSTOMER_NOT_FOUND,
  INVALID_PASSWORD_LENGTH,
  UNABLE_TO_SET_PASSWORD,
} from '~/config/messages'
import { hashSync } from '~/libs/bcrypt.server'
import { firebaseAdmin } from '~/libs/firebase.server'
import prisma from '~/libs/prisma.server'
import { createAuthSession } from '~/services/session.server'
import { normalizePhoneNumber } from '~/utils/account'
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

  if ((password?.length ?? 0) < MIN_PASSWORD_LENGTH) {
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

    const normalizedPhone = normalizePhoneNumber(phone)

    // Phone number not match
    if (normalizedPhone !== normalizePhoneNumber(decoded.phone_number)) {
      return json(
        { success: false, errorMessage: UNABLE_TO_SET_PASSWORD },
        { status: 400 },
      )
    }

    const hashedPassword = hashSync(password, PASSWORD_SALT)

    const customer = await prisma.customer.findFirst({
      where: { phone: { has: normalizedPhone } },
    })

    if (!customer) {
      return json(
        { success: false, errorMessage: CUSTOMER_NOT_FOUND },
        { status: 404 },
      )
    }

    let account = await prisma.account.findFirst({
      where: { phone: normalizedPhone },
    })

    // If account exists, update password & verifiedPhone
    if (account) {
      account = await prisma.account.update({
        where: { id: account.id },
        data: {
          password: hashedPassword,
          phoneVerified: true,
          customerId: customer.id,
        },
      })
    } else {
      // If account doesn't exist, create new account
      account = await prisma.account.create({
        data: {
          name: customer.name,
          password: hashedPassword,
          customerId: customer.id,
          lastLoggedIn: new Date(),
          phone: normalizedPhone,
          phoneVerified: true,
        },
      })
    }

    return createAuthSession({ accountId: account.id, redirectTo: '/app' })
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
  const transition = useNavigation()
  const passwordRef = useRef<HTMLInputElement>(null)

  const isLoading = transition.state !== 'idle'

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
