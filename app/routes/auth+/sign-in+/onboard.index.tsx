import { Alert, Button, Group, TextInput } from '@mantine/core'
import { useOutletContext } from '@remix-run/react'

export default function AuthSignInOnboardOTP() {
  const { errorMessage, isLoading = false } = useOutletContext<{
    errorMessage?: string
    isLoading?: boolean
  }>()

  return (
    <>
      <Alert>
        Tài khoản của bạn chưa được thiết lập. Vui lòng xác nhận số điện thoại
        để tiếp tục.
      </Alert>

      <TextInput
        autoFocus
        required
        disabled={isLoading}
        label="Mã xác thực"
        name="otp"
        placeholder="Nhập mã OTP đã gửi đến SĐT của bạn"
      />

      {errorMessage && <Alert color="red">{errorMessage}</Alert>}

      <Group>
        <Button loading={isLoading} type="submit">
          Tiếp tục
        </Button>
        <Button disabled color="dark" type="button" variant="default">
          Gửi lại
        </Button>
      </Group>
    </>
  )
}
