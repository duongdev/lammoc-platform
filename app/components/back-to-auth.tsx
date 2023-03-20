import type { FC } from 'react'

import { Group, Text } from '@mantine/core'
import { Link } from '@remix-run/react'
import { IconArrowNarrowLeft } from '@tabler/icons-react'

export type BackToAuthProps = {}

const BackToAuth: FC<BackToAuthProps> = () => {
  return (
    <Text component={Link} size="sm" to="/auth">
      <Group spacing="xs">
        <IconArrowNarrowLeft size="1.2rem" />
        <Text>Quay về đăng nhập</Text>
      </Group>
    </Text>
  )
}

export default BackToAuth
