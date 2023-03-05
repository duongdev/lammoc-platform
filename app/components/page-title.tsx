import type { FC, ReactNode } from 'react'

import { Title } from '@mantine/core'

export type PageTitleProps = { children?: ReactNode }

const PageTitle: FC<PageTitleProps> = ({ children }) => {
  return <Title order={2}>{children}</Title>
}

export default PageTitle
