import { useEffect, useState } from 'react'

import type { Models } from 'appwrite'
import constate from 'constate'

import { awAccount } from '~/libs/appwrite'

const useAuthHook = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [account, setAccount] =
    useState<Models.Account<Models.Preferences> | null>(null)

  useEffect(() => {
    setIsLoading(true)
    awAccount
      .get()
      .then((account) => {
        setAccount(account)
        setIsLoading(false)
      })
      .catch(() => (window.location.href = '/auth'))

    awAccount.getSession('current').then(console.log)
  }, [])

  return { account: account!, isLoading }
}

const [AuthProvider, useAuth] = constate(useAuthHook)

export { AuthProvider, useAuth }
