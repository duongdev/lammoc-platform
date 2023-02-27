import { compare } from 'bcrypt'

import prisma from '~/libs/prisma.server'
import { normalizePhoneNumber } from '~/utils/account'

export const getCustomersByPhone = async (phone: string) => {
  const normalizedPhone = normalizePhoneNumber(phone)

  const customers = await prisma.customer.findMany({
    where: { phone: { has: normalizedPhone } },
  })

  return customers
}

export const getCustomersByAccountId = async (accountId: string) => {
  const account = await prisma.account.findUnique({ where: { id: accountId } })

  if (!account?.phone) {
    return []
  }

  return prisma.customer.findMany({ where: { phone: { has: account.phone } } })
}

export async function signIn({
  phone,
  password,
}: {
  phone: string
  password: string
}) {
  const account = await prisma.account.findUnique({ where: { phone } })

  if (!account) {
    return null
  }

  const isPasswordCorrect = await compare(password, account.password)

  if (!isPasswordCorrect) {
    return null
  }

  return { id: account.id }
}
