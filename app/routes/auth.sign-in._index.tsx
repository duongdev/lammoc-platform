import type { ChangeEvent } from 'react'
import { useRef } from 'react'
import { useMemo } from 'react'
import { useCallback, useEffect, useState } from 'react'

import { Alert, Box, Button, Stack, TextInput } from '@mantine/core'
import type { ActionArgs, V2_MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { Form, useActionData, useTransition } from '@remix-run/react'

import { wait } from '~/utils/common'
import { getFormData } from '~/utils/forms'
import { getTitle } from '~/utils/meta'

export const meta: V2_MetaFunction = () => [{ title: getTitle('Đăng nhập') }]

/*
  If user found, ask password
  If user not found but phone exist -> onboard
  Otherwise, display phone not exists
*/
export async function action({ request }: ActionArgs) {
  const { phone } = await getFormData<{ phone: string }>(request)

  // dev
  if (process.env.NODE_ENV === 'development') {
    await wait(3000)

    if (phone.endsWith('0')) {
      return redirect(`./password?phone=${phone}`)
    }
    if (phone.endsWith('1')) {
      return redirect(`./onboard?phone=${phone}`)
    }
  }

  // validate
  if (!phone.match(/^0\d{9}$/)) {
    return json(
      {
        errorMessage: 'Số điện thoại không hợp lệ.',
        phone,
      },
      { status: 404 },
    )
  }

  return json(
    {
      errorMessage: 'Số điện thoại này chưa có đơn hàng trong hệ thống.',
      phone,
    },
    { status: 404 },
  )
}

export default function SignIn() {
  const { state } = useTransition()
  const actionData = useActionData<typeof action>()

  const [phone, setPhone] = useState('')
  const [errorMessage, setErrorMessage] = useState(
    actionData?.errorMessage ?? null,
  )
  const phoneRef = useRef<HTMLInputElement>(null)

  const isSubmitting = useMemo(() => state === 'submitting', [state])

  const handlePhoneChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setPhone(event.target.value)
      setErrorMessage(null)
    },
    [],
  )

  useEffect(() => {
    setErrorMessage(actionData?.errorMessage ?? null)
    if (actionData?.errorMessage) {
      phoneRef.current?.focus()
    }
  }, [actionData?.errorMessage])

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
          value={phone}
        />

        {errorMessage && <Alert color="red">{errorMessage}</Alert>}

        <Box>
          <Button
            disabled={!!errorMessage}
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
