import { Alert, Button, Group, TextInput } from '@mantine/core'

export default function AuthSignInOnboardOTP() {
  return (
    <>
      <Alert>
        Tài khoản của bạn chưa được thiết lập. Vui lòng xác nhận số điện thoại
        để tiếp tục.
      </Alert>

      <TextInput
        autoFocus
        required
        label="Mã xác thực"
        name="otp"
        placeholder="Nhập mã OTP đã gửi đến SĐT của bạn"
      />

      <Group>
        <Button type="submit">Tiếp tục</Button>
        <Button disabled color="dark" type="button" variant="default">
          Gửi lại
        </Button>
      </Group>
    </>
  )
}
