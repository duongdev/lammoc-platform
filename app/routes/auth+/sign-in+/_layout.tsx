import { Box, Container, Group, Image, Stack, Text, Title } from '@mantine/core'
import { Outlet } from '@remix-run/react'
import type { V2_MetaFunction } from '@remix-run/react/dist/routeModules'
import { IconX } from '@tabler/icons-react'

import { getTitle } from '~/utils/meta'

export const meta: V2_MetaFunction = () => [{ title: getTitle('Đăng nhập') }]

export default function AuthLayout() {
  return (
    <>
      <Box>
        <Title>Đăng nhập</Title>
        <Text color="dimmed">
          Kết nối tài khoản Store Làm Mộc và Thích Tự Làm
        </Text>
      </Box>
      <Outlet />
    </>
  )
}
