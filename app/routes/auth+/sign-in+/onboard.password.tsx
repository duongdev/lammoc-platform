import { useEffect, useRef } from 'react'

import { Alert, Button, Group, PasswordInput } from '@mantine/core'
import type { ActionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useActionData, useTransition } from '@remix-run/react'

import { PASSWORD_SALT } from '~/config/app-config'
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

    const hashedPassword = hashSync(password, PASSWORD_SALT)
    const normalizedPhone = normalizePhoneNumber(phone)

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
        H??y thi???t l???p m???t kh???u ????? thu???n ti???n cho c??c l???n ????ng nh???p sau.
      </Alert>

      <PasswordInput
        autoFocus
        required
        disabled={isLoading}
        label="M???t kh???u"
        name="password"
        placeholder="??????????????????"
        ref={passwordRef}
      />

      {errorMessage && <Alert color="red">{errorMessage}</Alert>}

      <Group>
        <Button loading={isLoading} type="submit">
          L??u m???t kh???u
        </Button>
        <Button disabled color="dark" type="button" variant="default">
          B??? qua
        </Button>
      </Group>
    </>
  )
}
