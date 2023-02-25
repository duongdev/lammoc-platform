import type { FC, ReactNode } from 'react'
import { createContext, useContext } from 'react'

import type { Account, AccountRole, Customer } from '@prisma/client'

export type AuthContextValue = {
  account?: Account
  customer?: Customer
  roles: AccountRole[]
}

const AuthContext = createContext<AuthContextValue>(null as any)

export const useAuth = () => {
  const { account, customer } = useContext(AuthContext)

  return {
    account,
    $account: account!,
    roles: account?.roles ?? [],
    customer,
    $customer: customer!,
  }
}

export const AuthProvider: FC<
  {
    children?: ReactNode
  } & AuthContextValue
> = ({ children, ...value }) => {
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
