import type { FC, ReactNode } from 'react'

import { Badge, Group, Title } from '@mantine/core'

export type PageTitleProps = {
  children?: ReactNode
  count?: number | string | null
}

const PageTitle: FC<PageTitleProps> = ({ children, count }) => {
  return (
    <Group>
      <Title order={2}>{children}</Title>
      {count && (
        <Badge size="lg" variant="filled">
          {count}
        </Badge>
      )}
    </Group>
  )
}

export default PageTitle
