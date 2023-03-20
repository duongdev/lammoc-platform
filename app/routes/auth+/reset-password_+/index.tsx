/* eslint-disable react/jsx-no-undef */
import { Box, Title, Text, TextInput, Stack, Button } from '@mantine/core'
import { Form } from '@remix-run/react'

export default function ResetPassword() {
  return (
    <>
      <Box>
        <Title>Quên mật khẩu</Title>
        <Text color="dimmed">Xác nhận số điện thoại để đặt lại mật khẩu</Text>
      </Box>
      <Form>
        <Stack>
          <TextInput
            autoFocus
            required
            // disabled={isSubmitting}
            id="phone"
            label="Số điện thoại"
            name="phone"
            // onChange={handlePhoneChange}
            placeholder="Nhập SĐT mua hàng"
            // ref={phoneRef}
            type="tel"
            // value={phone}
          />
          <Box>
            <Button>Tiếp tục</Button>
          </Box>
        </Stack>
      </Form>
    </>
  )
}
