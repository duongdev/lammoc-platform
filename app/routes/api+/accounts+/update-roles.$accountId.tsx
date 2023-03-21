import { AccountRole } from '@prisma/client'
import type { ActionArgs } from '@remix-run/node'

import { ADMIN_ROLES } from '~/config/app-config'
import { ACCOUNT_NOT_FOUND, FORBIDDEN } from '~/config/messages'
import prisma from '~/libs/prisma.server'
import { superjson } from '~/utils/data'
import { getAuthAccount } from '~/utils/session.server'

export async function action({ request, params }: ActionArgs) {
  const { accountId } = params

  if (!accountId) {
    return superjson({ message: ACCOUNT_NOT_FOUND }, { status: 404 })
  }

  const formData = await request.formData()
  const roles = formData.get('roles')?.toString().split(',') ?? []

  const currentAccount = await getAuthAccount(request)

  // If current user is not admin, throw FORBIDDEN
  if (!currentAccount?.roles.some((role) => ADMIN_ROLES.includes(role))) {
    return superjson({ message: FORBIDDEN }, { status: 403 })
  }

  let account = await prisma.account.findUnique({ where: { id: accountId } })

  if (!account) {
    return superjson(ACCOUNT_NOT_FOUND, { status: 404 })
  }

  // If the target account is DEVELOPER or trying to set the account DEVELOPER
  // But the current account is not a DEVELOPER
  // Throw FORBIDDEN
  if (
    !currentAccount.roles.includes('DEVELOPER') &&
    (account.roles.includes('DEVELOPER') ||
      roles.includes(AccountRole.DEVELOPER))
  ) {
    return superjson({ message: FORBIDDEN }, { status: 403 })
  }

  account = await prisma.account.update({
    where: { id: accountId },
    data: {
      roles: roles.filter((role: any) =>
        Object.values(AccountRole).includes(role),
      ) as AccountRole[],
    },
  })

  return superjson(account)
}
