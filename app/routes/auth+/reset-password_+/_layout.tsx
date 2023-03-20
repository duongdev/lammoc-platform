import type { FC } from 'react'

import { Box, Text, Title } from '@mantine/core'
import { Outlet } from '@remix-run/react'

export type ResetPasswordLayoutProps = {}

const ResetPasswordLayout: FC<ResetPasswordLayoutProps> = () => {
  return (
    <>
      <Box>
        <Title>Quên mật khẩu?</Title>
        <Text color="dimmed">Xác nhận số điện thoại để đặt lại mật khẩu</Text>
      </Box>
      <Outlet />
    </>
  )
}

export default ResetPasswordLayout
