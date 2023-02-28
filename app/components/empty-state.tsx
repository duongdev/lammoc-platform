import type { FC } from 'react'

import { Center, Text } from '@mantine/core'

export type EmptyStateProps = { message?: string }

const EmptyState: FC<EmptyStateProps> = ({ message }) => {
  return <Center>{message && <Text color="dimmed">{message}</Text>}</Center>
}

export default EmptyState
