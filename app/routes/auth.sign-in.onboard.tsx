import type { FormEvent } from 'react'
import { useState, FormEventHandler, useCallback } from 'react'

import { Stack } from '@mantine/core'
import type { ActionArgs, LoaderFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Form, Outlet, useNavigate, useSearchParams } from '@remix-run/react'
import { getAuth, PhoneAuthProvider, signInWithCredential } from 'firebase/auth'

import LockedAuthPhoneInput from '~/components/locked-auth-phone'
import { firebaseClient, setupFirebase } from '~/libs/firebase'
import { getFormData } from '~/utils/forms'

export async function action({ request }: ActionArgs) {
  const url = new URL(request.url)
  const phone = url.searchParams.get('phone')
  const verificationId = url.searchParams.get('verificationId')
  const { otp } = await getFormData<{ otp?: string }>(request)

  console.log({ phone, verificationId })

  if (!(phone && verificationId && otp)) {
    return json(
      {
        success: false,
        errorMessage: 'Không thể xác thực tài khoản',
      },
      { status: 400 },
    )
  }

  const firebaseClient = setupFirebase()
  getAuth(firebaseClient)

  const auth = PhoneAuthProvider.credential(verificationId, otp)
  console.log(auth.toJSON())

  return json({})
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
  const [searchParams] = useSearchParams()
  const phone = searchParams.get('phone')!
  const verificationId = searchParams.get('verificationId')!
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()

      const otp = (event.target as any).otp.value
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

  return (
    <Form method="post" onSubmit={handleSubmit}>
      <Stack>
        <LockedAuthPhoneInput editTo=".." phone={phone ?? ''} />
        <Outlet context={{ isLoading, errorMessage }} />
      </Stack>
    </Form>
  )
}
