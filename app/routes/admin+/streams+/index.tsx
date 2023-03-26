import type { FC } from 'react'

import { Button, Group, Stack } from '@mantine/core'
import { Link } from '@remix-run/react'
import { IconPlus } from '@tabler/icons-react'

import EmptyState from '~/components/empty-state'
import PageTitle from '~/components/page-title'

export type LivestreamIndexProps = {}

const LivestreamIndex: FC<LivestreamIndexProps> = () => {
  return (
    <Stack spacing="lg">
      <Group position="apart">
        <PageTitle>Livestream</PageTitle>
        <Button
          component={Link}
          leftIcon={<IconPlus size="1rem" />}
          to="./create"
        >
          Tạo stream
        </Button>
      </Group>
      <EmptyState message="Chưa có livestream nào" />
    </Stack>
  )
}

export default LivestreamIndex
