import type { FC } from 'react'
import { useCallback } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import {
  Alert,
  Button,
  Group,
  PasswordInput,
  Stack,
  TextInput,
} from '@mantine/core'
import type { ActionArgs } from '@remix-run/node'
import { useFetcher, useSearchParams } from '@remix-run/react'
import { IconShieldCheckFilled } from '@tabler/icons-react'
import { hashSync } from 'bcrypt'
import { getAuth, PhoneAuthProvider, signInWithCredential } from 'firebase/auth'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import BackToAuth from '~/components/back-to-auth'
import LockedAuthPhoneInput from '~/components/locked-auth-phone'
import { MIN_PASSWORD_LENGTH, PASSWORD_SALT } from '~/config/app-config'
import {
  CUSTOMER_NOT_FOUND,
  INVALID_OTP,
  INVALID_PASSWORD_LENGTH,
  INVALID_PHONE_NUMBER,
  UNABLE_TO_SET_PASSWORD,
} from '~/config/messages'
import { firebaseClient } from '~/libs/firebase.client'
import { firebaseAdmin } from '~/libs/firebase.server'
import prisma from '~/libs/prisma.server'
import { createAuthSession } from '~/services/session.server'
import { normalizePhoneNumber } from '~/utils/account'
import { superjson } from '~/utils/data'
import { getFormData } from '~/utils/forms'

export type ResetPasswordOTPProps = {}

type FormValues = {
  phone: string
  otp: string
  password: string
}

type ActionFormData = {
  phone: string
  userToken: string
  password: string
}

export async function action({ request }: ActionArgs) {
  const formData = await getFormData<ActionFormData>(request)
  const { password, phone, userToken } = formData

  if (!(password && phone && userToken)) {
    return superjson(
      {
        success: false,
        errorMessage: UNABLE_TO_SET_PASSWORD,
      },
      { status: 400 },
    )
  }

  try {
    const decoded = await firebaseAdmin.auth().verifyIdToken(userToken)

    if (!decoded.phone_number) {
      return superjson(
        { success: false, errorMessage: UNABLE_TO_SET_PASSWORD },
        { status: 500 },
      )
    }

    const normalizedPhone = normalizePhoneNumber(phone)

    // Phone number not match
    if (normalizedPhone !== normalizePhoneNumber(decoded.phone_number)) {
      return superjson(
        { success: false, errorMessage: UNABLE_TO_SET_PASSWORD },
        { status: 400 },
      )
    }

    const hashedPassword = hashSync(password, PASSWORD_SALT)

    const customer = await prisma.customer.findFirst({
      where: { phone: { has: normalizedPhone } },
    })

    if (!customer) {
      return superjson(
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
  } catch (error) {
    console.error(error)
    return superjson(
      { success: false, errorMessage: UNABLE_TO_SET_PASSWORD },
      { status: 500 },
    )
  }
}

const ResetPassword: FC<ResetPasswordOTPProps> = () => {
  const fetcher = useFetcher<typeof action>()
  const [searchParams] = useSearchParams()
  const phone = searchParams.get('phone')

  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    setError,
  } = useForm<FormValues>({
    resolver: zodResolver(
      z.object({
        phone: z.string().min(10, INVALID_PHONE_NUMBER),
        otp: z.string().length(6, INVALID_OTP),
        password: z.string().min(MIN_PASSWORD_LENGTH, INVALID_PASSWORD_LENGTH),
      }),
    ),
    defaultValues: {
      phone: phone!,
      otp: '',
      password: '',
    },
  })

  const actionError = fetcher.data?.json?.errorMessage

  const handleVerifyOtp = useCallback(
    async (otp: string) => {
      const verificationId = searchParams.get('verificationId')
      if (!(otp && verificationId)) {
        return null
      }

      try {
        const auth = getAuth(firebaseClient)

        const authCredential = PhoneAuthProvider.credential(verificationId, otp)
        const userCredential = await signInWithCredential(auth, authCredential)

        const userToken = await userCredential.user.getIdToken()

        return userToken
      } catch (error) {
        console.error(error)
        return null
      }
    },
    [searchParams],
  )

  const handleUpdatePassword = useCallback(
    async (values: FormValues) => {
      const { otp, password } = values

      const userToken = await handleVerifyOtp(otp)

      // Couldn't obtain user token from OTP
      if (!userToken) {
        setError(
          'otp',
          { message: INVALID_OTP, type: 'value' },
          { shouldFocus: true },
        )
        return
      }

      // Perform update password and sign in
      return fetcher.submit(
        { userToken, phone: phone!, password } as ActionFormData,
        { method: 'put' },
      )
    },
    [fetcher, handleVerifyOtp, phone, setError],
  )

  return (
    <form onSubmit={handleSubmit(handleUpdatePassword)}>
      <Stack>
        <LockedAuthPhoneInput editTo=".." phone={phone!} />
        <TextInput
          autoFocus
          required
          disabled={isSubmitting}
          label="Mã xác thực"
          placeholder="Nhập mã OTP đã gửi đến SĐT của bạn"
          {...register('otp')}
          error={errors.otp?.message}
        />
        <PasswordInput
          required
          disabled={isSubmitting}
          label="Mật khẩu"
          placeholder="Thiết lập mật khẩu mới"
          {...register('password')}
          error={errors.password?.message}
        />
        {actionError && !isSubmitting && (
          <Alert color="red">{actionError}</Alert>
        )}
        <Group align="center" position="apart">
          <BackToAuth />
          <Button
            leftIcon={<IconShieldCheckFilled />}
            loading={isSubmitting}
            type="submit"
          >
            Cập nhật mật khẩu
          </Button>
        </Group>
      </Stack>
    </form>
  )
}

export default ResetPassword
