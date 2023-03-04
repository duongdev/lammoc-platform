import type { FormEvent } from 'react'
import { useState, useCallback } from 'react'

import { Stack } from '@mantine/core'
import type {  LoaderFunction } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import {
  Form,
  Outlet,
  useLocation,
  useNavigate,
  useSearchParams,
  useSubmit,
} from '@remix-run/react'
import { getAuth, PhoneAuthProvider, signInWithCredential } from 'firebase/auth'

import LockedAuthPhoneInput from '~/components/locked-auth-phone'
import { firebaseClient } from '~/libs/firebase.client'

export function action() {
  return {}
}

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url)
  const phone = url.searchParams.get('phone')
  const verificationId = url.searchParams.get('verificationId')

  if (!(phone && verificationId)) {
    return redirect('..')
  }

  return { phone }
}

export default function AuthSignInOnboard() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const submit = useSubmit()
  const phone = searchParams.get('phone')!
  const verificationId = searchParams.get('verificationId')!
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleVerifyOtp = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()

      const otp = (event.target as any).otp?.value
      if (!otp) {
        return
      }

      setIsLoading(true)

      try {
        const auth = getAuth(firebaseClient)

        const authCredential = PhoneAuthProvider.credential(verificationId, otp)
        const userCredential = await signInWithCredential(auth, authCredential)

        navigate(
          `./password?token=${await userCredential.user.getIdToken()}&phone=${phone}&verificationId=${verificationId}`,
          { replace: true },
        )
      } catch (error) {
        console.error(error)
        setIsLoading(false)
        setErrorMessage('Không thể xác thực mã OTP')
      }

      setIsLoading(false)
    },
    [navigate, phone, verificationId],
  )

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      const otp = (event.target as any).otp?.value

      if (otp) {
        return handleVerifyOtp(event)
      }

      event.preventDefault()
      submit(event.currentTarget, {
        relative: 'path',
        action: `${location.pathname}${location.search}`,
      })
    },
    [handleVerifyOtp, location.pathname, location.search, submit],
  )

  return (
    <Form method="post" onSubmit={handleSubmit}>
      <Stack>
        <LockedAuthPhoneInput editTo=".." phone={phone ?? ''} />
        <Outlet context={{ isLoading, errorMessage }} />
      </Stack>
    </Form>
  )
}
