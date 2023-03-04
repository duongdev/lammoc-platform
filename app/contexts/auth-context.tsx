import type { FC, ReactNode } from 'react'
import { createContext, useContext } from 'react'

import type { Account, AccountRole } from '@prisma/client'

export type AuthContextValue = {
  account?: Account
  customerPhones: string[]
  roles: AccountRole[]
}

const AuthContext = createContext<AuthContextValue>(null as any)

export const useAuth = () => {
  const { account, customerPhones = [] } = useContext(AuthContext)

  return {
    account,
    $account: account!,
    roles: account?.roles ?? [],
    customerPhones,
  }
}

export const AuthProvider: FC<
  {
    children?: ReactNode
  } & AuthContextValue
> = ({ children, ...value }) => {
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
