import { Link, Outlet } from '@remix-run/react'

import { Box, Container, Group, Image, Stack, Text, Title } from '@mantine/core'

export default function AuthLayout() {
  return (
    <Container size="xs" py={60}>
      <Stack>
        <Group align="baseline" spacing="lg">
          <Link
            to="https://storelammoc.vn"
            target="_blank"
            title="Store Làm Mộc"
          >
            <Image src="/img/slm-logo.png" height={40} width="auto" />
          </Link>
          <Link
            to="https://thichtulam.com"
            target="_blank"
            title="Thích Tự Làm"
          >
            <Image src="/img/ttl-logo.png" height={40} width="auto" />
          </Link>
        </Group>
        <Box>
          <Title>Đăng nhập tài khoản</Title>
          <Text color="dimmed">
            Kết nối tài khoản từ Store Làm Mộc và Thích Tự Làm
          </Text>
        </Box>
        <Outlet />
      </Stack>
    </Container>
  )
}
