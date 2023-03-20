import { Container, Image, Group, Stack } from '@mantine/core'
import { Outlet } from '@remix-run/react'
import { IconX } from '@tabler/icons-react'

export default function AuthLayout() {
  return (
    <Container py={60} size="xs">
      <Stack>
        <Group spacing="xs">
          <a
            href="https://storelammoc.vn"
            rel="noreferrer"
            target="_blank"
            title="Store Làm Mộc"
          >
            <Image height={40} src="/img/slm-logo.png" width="auto" />
          </a>
          <IconX
            size={16}
            style={{
              color: '#0000005d !important',
            }}
          />
          <a
            href="https://thichtulam.com"
            rel="noreferrer"
            target="_blank"
            title="Thích Tự Làm"
          >
            <Image height={32} src="/img/ttl-logo.png" width="auto" />
          </a>
        </Group>
        <Outlet />
      </Stack>
    </Container>
  )
}
