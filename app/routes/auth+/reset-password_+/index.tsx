/* eslint-disable react/jsx-no-undef */
import type { ChangeEvent } from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { TextInput, Stack, Button, Group, Alert } from '@mantine/core'
import type { ActionArgs, V2_MetaFunction } from '@remix-run/node'
import {
  Form,
  useNavigate,
  useNavigation,
  useSearchParams,
} from '@remix-run/react'
import type { Auth } from 'firebase/auth'
import {
  signInWithPhoneNumber,
  getAuth,
  RecaptchaVerifier,
} from 'firebase/auth'

import BackToAuth from '~/components/back-to-auth'
import { firebaseClient } from '~/libs/firebase.client'
import prisma from '~/libs/prisma.server'
import { isPhoneNumberValid, normalizePhoneNumber } from '~/utils/account'
import { superjson, useSuperActionData } from '~/utils/data'
import { getFormData } from '~/utils/forms'

export const meta: V2_MetaFunction = () => [
  {
    title: 'Quên mật khẩu?',
  },
]

export async function action({ request }: ActionArgs) {
  let { phone } = await getFormData<{ phone: string }>(request)

  // validate
  if (!isPhoneNumberValid(phone)) {
    return superjson(
      {
        success: false,
        errorMessage: 'Số điện thoại không hợp lệ.',
        phone,
      },
      { status: 400 },
    )
  }

  phone = normalizePhoneNumber(phone)

  const accountByPhone = await prisma.account.findFirst({ where: { phone } })

  // Return success if the account exists and has password set
  if (
    accountByPhone &&
    accountByPhone.password &&
    accountByPhone.phoneVerified
  ) {
    return superjson(
      {
        success: true,
        errorMessage: null,
        phone,
      },
      { status: 200 },
    )
  }

  return superjson(
    {
      success: false,
      errorMessage: 'Số điện thoại này chưa có đơn hàng trong hệ thống.',
      phone,
    },
    { status: 404 },
  )
}

export default function ResetPassword() {
  const navigate = useNavigate()
  const navigation = useNavigation()
  const actionData = useSuperActionData<typeof action>()
  const [searchParams] = useSearchParams()
  const recaptchaVerifierRef = useRef<RecaptchaVerifier>()
  const authRef = useRef<Auth>()

  const [isAuthenticating, setIsAuthenticating] = useState(false)

  const [phone, setPhone] = useState(
    searchParams.get('phone')?.replace(/^\s84/, '0') || '',
  )
  const [errorMessage, setErrorMessage] = useState(
    actionData?.errorMessage ?? null,
  )
  const phoneRef = useRef<HTMLInputElement>(null)

  const isSubmitting = useMemo(
    () => navigation.state !== 'idle' || isAuthenticating,
    [isAuthenticating, navigation.state],
  )

  const handlePhoneChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setPhone(event.target.value)
      setErrorMessage(null)
    },
    [],
  )

  const handleSendSms = useCallback(
    async (phoneNumber: string) => {
      const auth = authRef.current
      const verifier = recaptchaVerifierRef.current
      if (!(auth && verifier)) return

      setIsAuthenticating(true)

      try {
        const result = await signInWithPhoneNumber(
          auth,
          phoneNumber.replace(/^0/, '+84'),
          verifier!,
        )

        if (result) {
          navigate(
            `./set-password?phone=${phoneNumber}&verificationId=${result.verificationId}`,
          )
        }
      } catch (err) {
        console.error(err)
        setErrorMessage('Không thể gửi OTP. Vui lòng thử lại.')
      }

      setIsAuthenticating(false)
    },
    [navigate],
  )

  useEffect(() => {
    setErrorMessage(actionData?.errorMessage ?? null)
    if (actionData?.errorMessage) {
      phoneRef.current?.focus()
    }
  }, [actionData?.errorMessage])

  useEffect(() => {
    if (actionData?.success) {
      handleSendSms(actionData.phone)
    }
  }, [actionData?.success, handleSendSms, actionData?.phone])

  // On mount
  useEffect(() => {
    setTimeout(() => {
      authRef.current = getAuth(firebaseClient)
      authRef.current.useDeviceLanguage()

      recaptchaVerifierRef.current = new RecaptchaVerifier(
        'submit-button',
        {
          size: 'invisible',
          callback: () => {
            // reCAPTCHA solved, allow signInWithPhoneNumber.
          },
        },
        authRef?.current!,
      )
    }, 100)
  }, [])

  return (
    <>
      <Form method="post">
        <Stack>
          <TextInput
            autoFocus
            required
            disabled={isSubmitting}
            id="phone"
            label="Số điện thoại"
            name="phone"
            onChange={handlePhoneChange}
            placeholder="Nhập SĐT mua hàng"
            ref={phoneRef}
            type="tel"
            value={phone}
          />
          {errorMessage && <Alert color="red">{errorMessage}</Alert>}
          <Group align="center" position="apart">
            <BackToAuth />
            <Button id="submit-button" loading={isSubmitting} type="submit">
              Tiếp tục
            </Button>
          </Group>
        </Stack>
      </Form>
    </>
  )
}
