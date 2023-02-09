import type { ChangeEvent } from 'react'
import { useRef, useMemo, useCallback, useEffect, useState } from 'react'

import { Alert, Box, Button, Stack, TextInput } from '@mantine/core'
import type { ActionArgs, V2_MetaFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Form, useActionData, useTransition } from '@remix-run/react'
import { AppwriteException, Users } from 'node-appwrite'

import { awServer } from '~/libs/appwrite'
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
  const users = new Users(awServer)
  const { phone } = await getFormData<{ phone: string }>(request)

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

  try {
    const existingUser = await users.get(phone)
  } catch (error) {
    if (error instanceof AppwriteException && error.code !== 404) {
      return json(
        {
          errorMessage: error.message,
          phone,
        },
        { status: error.code ?? 500 },
      )
    }
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
