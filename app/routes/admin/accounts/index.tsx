import type { FC } from 'react'

import { useAuth } from '~/contexts/auth-context'

export type AccountsProps = {}

const Accounts: FC<AccountsProps> = () => {
  const { account } = useAuth()

  return <>accounts</>
}

export default Accounts
