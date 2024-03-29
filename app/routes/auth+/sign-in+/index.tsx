import type { ChangeEvent } from 'react'
import { useRef, useMemo, useCallback, useEffect, useState } from 'react'

import { Alert, Box, Button, Stack, TextInput } from '@mantine/core'
import type { ActionArgs, V2_MetaFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import {
  Form,
  useActionData,
  useNavigate,
  useNavigation,
} from '@remix-run/react'
import type { Auth } from 'firebase/auth'
import {
  RecaptchaVerifier,
  getAuth,
  signInWithPhoneNumber,
} from 'firebase/auth'

import { firebaseClient } from '~/libs/firebase.client'
import prisma from '~/libs/prisma.server'
import { isPhoneNumberValid, normalizePhoneNumber } from '~/utils/account'
import { getFormData } from '~/utils/forms'
import { getTitle } from '~/utils/meta'

export const meta: V2_MetaFunction = () => [{ title: getTitle('Đăng nhập') }]

/*
  If user found, ask password
  If user not found but phone exist -> onboard
  Otherwise, display phone not exists
*/
export async function action({ request }: ActionArgs) {
  let { phone } = await getFormData<{ phone: string }>(request)

  // validate
  if (!isPhoneNumberValid(phone)) {
    return json(
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

  // Redirect to login if the user has set password
  if (
    accountByPhone &&
    accountByPhone.password &&
    accountByPhone.phoneVerified
  ) {
    return redirect(`./password?phone=${phone}&accountId=${accountByPhone.id}`)
  }

  const customerByPhone = await prisma.customer.findFirst({
    where: { phone: { has: phone } },
  })

  if (customerByPhone) {
    return json({
      success: true,
      errorMessage: null,
      phone,
    })
  }

  return json(
    {
      success: false,
      errorMessage: 'Số điện thoại này chưa có đơn hàng trong hệ thống.',
      phone,
    },
    { status: 404 },
  )
}

export default function SignIn() {
  const navigate = useNavigate()
  const navigation = useNavigation()
  const actionData = useActionData<typeof action>()
  const recaptchaVerifierRef = useRef<RecaptchaVerifier>()
  const authRef = useRef<Auth>()

  const [isAuthenticating, setIsAuthenticating] = useState(false)

  const [phone, setPhone] = useState('')
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
            `./onboard?phone=${phoneNumber}&verificationId=${result.verificationId}`,
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
      authRef.current.languageCode = 'vi'

      recaptchaVerifierRef.current = new RecaptchaVerifier(
        'sign-in-button',
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

        <Box>
          <Button
            disabled={!!errorMessage}
            id="sign-in-button"
            loading={isSubmitting}
            type="submit"
          >
            Tiếp tục
          </Button>
        </Box>
      </Stack>
    </Form>
  )
}
