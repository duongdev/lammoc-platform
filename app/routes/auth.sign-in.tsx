import type { ActionFunction, V2_MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Form, useActionData } from '@remix-run/react'

import { Alert, Box, Button, Stack, TextInput } from '@mantine/core'

import { AUTH_PHONE_NOT_EXIST } from '~/config/messages'
import { getFormData } from '~/utils/forms'
import { getTitle } from '~/utils/meta'

export const meta: V2_MetaFunction = () => [{ title: getTitle('Đăng nhập') }]

type ActionData = {
  errorMessage?: string
  userExists?: boolean
  phoneExists?: boolean
}

/*
  If user found, ask password
  If user not found but phone exist -> onboard
  Otherwise, display phone not exists
*/
export const action: ActionFunction = async ({ request }) => {
  const { phone } = await getFormData<{ phone: string }>(request)
  console.log({ phone })

  return json(
    { errorMessage: AUTH_PHONE_NOT_EXIST },
    { status: 404 },
  )
}

export default function SignIn() {
  const { errorMessage }: ActionData = useActionData<typeof action>() ?? {}

  return (
    <Form method="post">
      <Stack>
        <TextInput
          autoFocus
          required
          id="phone"
          label="Số điện thoại"
          name="phone"
          placeholder="Nhập SĐT mua hàng"
        />
        {errorMessage && <Alert color="red">{errorMessage}</Alert>}
        <Box>
          <Button type="submit">Tiếp tục</Button>
        </Box>
      </Stack>
    </Form>
  )
}
