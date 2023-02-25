import type { FC, ReactNode } from 'react'

import { Header } from '@mantine/core'
import type { Account, Customer } from '@prisma/client'

export type CustomerContainerProps = {
  children: ReactNode
}

const CustomerContainer: FC<CustomerContainerProps> = ({ children }) => {
  return <Header height={56}>{children}</Header>
}

export default CustomerContainer
