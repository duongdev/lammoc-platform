import { createCookieSessionStorage, json, redirect } from '@remix-run/node'
import { flatten } from 'lodash'

import { INVALID_AUTH_CREDENTIALS } from '~/config/messages'
import prisma from '~/libs/prisma.server'

import { getCustomersByAccountId } from './auth.server'

const ACCOUNT_ID = 'accountId'
const CUSTOMER_PHONES = 'customerPhones'
const SESSION_SECRET = process.env.SESSION_SECRET

if (!SESSION_SECRET) {
  throw new Error('SESSION_SECRET must be set')
}

const storage = createCookieSessionStorage({
  cookie: {
    name: 'RJ_session',
    // normally you want this to be `secure: true`
    // but that doesn't work on localhost for Safari
    // https://web.dev/when-to-use-local-https/
    secure: process.env.NODE_ENV === 'production',
    secrets: [SESSION_SECRET],
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
})

/** Creates a new auth session and save to browser */
export const createAuthSession = async ({
  accountId,
  redirectTo: $redirectTo,
  __unsafeDeveloperOverridesPhones,
}: {
  accountId: string
  redirectTo?: string
  __unsafeDeveloperOverridesPhones?: string[]
}) => {
  const session = await storage.getSession()
  session.set(ACCOUNT_ID, accountId)

  const account = await prisma.account.findUnique({ where: { id: accountId } })

  if (!account) {
    return json({ errorMessage: INVALID_AUTH_CREDENTIALS })
  }

  const isDeveloper = account.roles.includes('DEVELOPER')

  // If account is DEVELOPER and has __unsafeDeveloperOverridesPhones
  // Overrides the CUSTOMER_PHONES
  let customerPhones: string[] = []
  if (isDeveloper && __unsafeDeveloperOverridesPhones) {
    customerPhones = __unsafeDeveloperOverridesPhones
  } else {
    // Find all phone numbers related to the customer
    const customers = await getCustomersByAccountId(accountId)
    customerPhones = flatten(customers?.map((customer) => customer.phone))
  }

  session.set(CUSTOMER_PHONES, customerPhones.join())

  // Find the best place to redirect to
  let redirectTo = $redirectTo

  // If the account is DEVELOPER but no customerPhones set,
  // redirect to admin to let them override phones
  if (isDeveloper && customerPhones.length === 0) {
    redirectTo = '/admin'
  }

  // No redirectTo set, defaults to /app
  if (!redirectTo) {
    redirectTo = '/app'
  }

  console.log('session', session.data)
  console.log({ isDeveloper, __unsafeDeveloperOverridesPhones })

  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await storage.commitSession(session),
    },
  })
}

const getSession = (request: Request) =>
  storage.getSession(request.headers.get('Cookie'))

export const getAuthSession = async (request: Request) => {
  const session = await getSession(request)
  const accountId = session.get(ACCOUNT_ID)
  const customerPhones = session.get(CUSTOMER_PHONES) ?? ''

  return {
    accountId: typeof accountId === 'string' ? (accountId as string) : null,
    customerPhones: customerPhones.split(',') as string[],
  }
}

export const getAuthAccount = async (request: Request) => {
  const { accountId } = await getAuthSession(request)

  if (!accountId) {
    return null
  }

  const account = await prisma.account.findUnique({ where: { id: accountId } })

  return account
}
