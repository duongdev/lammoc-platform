import { Box, Container, Group, Image, Stack, Text, Title } from '@mantine/core'
import { Link, Outlet } from '@remix-run/react'
import type { V2_MetaFunction } from '@remix-run/react/dist/routeModules'

import { getTitle } from '~/utils/meta'

export const meta: V2_MetaFunction = () => [{ title: getTitle('Đăng nhập') }]

export default function AuthLayout() {
  return (
    <Container py={60} size="xs">
      <Stack>
        <Group align="baseline" spacing="lg">
          <Link
            target="_blank"
            title="Store Làm Mộc"
            to="https://storelammoc.vn"
          >
            <Image height={40} src="/img/slm-logo.png" width="auto" />
          </Link>
          <Link
            target="_blank"
            title="Thích Tự Làm"
            to="https://thichtulam.com"
          >
            <Image height={40} src="/img/ttl-logo.png" width="auto" />
          </Link>
        </Group>
        <Box>
          <Title>Đăng nhập</Title>
          <Text color="dimmed">
            Kết nối tài khoản Store Làm Mộc và Thích Tự Làm
          </Text>
        </Box>
        <Outlet />
      </Stack>
    </Container>
  )
}
