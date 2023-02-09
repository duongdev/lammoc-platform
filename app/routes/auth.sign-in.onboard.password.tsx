import { Alert, Button, Group, PasswordInput } from '@mantine/core'

export default function AuthSignInOnboardPassword() {
  return (
    <>
      <Alert>
        Hãy thiết lập mật khẩu để thuận tiện cho các lần đăng nhập sau.
      </Alert>

      <PasswordInput autoFocus label="Mật khẩu" name="password" />
      <PasswordInput label="Xác nhận mật khẩu" name="verifyPassword" />

      <Group>
        <Button type="submit">Lưu mật khẩu</Button>
        <Button disabled color="dark" type="button" variant="default">
          Bỏ qua
        </Button>
      </Group>
    </>
  )
}
