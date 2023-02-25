import { createCookieSessionStorage, redirect } from '@remix-run/node'
import { compareSync } from 'bcrypt'

import prisma from '~/libs/prisma.server'

const SESSION_SECRET = process.env.SESSION_SECRET
const ACCOUNT_ID = 'accountId'

export async function signIn({
  phone,
  password,
}: {
  phone: string
  password: string
}) {
  const account = await prisma.account.findFirst({ where: { phone } })

  if (!account) {
    return null
  }

  const isPasswordCorrect = await compareSync(password, account.password)

  if (!isPasswordCorrect) {
    return null
  }

  return { id: account.id }
}

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

export async function createUserSession(accountId: string, redirectTo: string) {
  const session = await storage.getSession()
  session.set(ACCOUNT_ID, accountId)
  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await storage.commitSession(session),
    },
  })
}

function getAuthSession(request: Request) {
  return storage.getSession(request.headers.get('Cookie'))
}

export async function getAuthAccountId(request: Request) {
  const session = await getAuthSession(request)
  const accountId = session.get(ACCOUNT_ID)
  if (!accountId || typeof accountId !== 'string') return null
  return accountId
}

export async function requireAccountId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname,
) {
  const session = await getAuthSession(request)
  const accountId = session.get(ACCOUNT_ID)

  console.log({ session, accountId })

  if (!accountId || typeof accountId !== 'string') {
    const searchParams = new URLSearchParams([['redirectTo', redirectTo]])
    throw redirect(`/auth/sign-in?${searchParams}`)
  }
  return accountId
}

export async function getAuthAccount(request: Request) {
  const accountId = await getAuthAccountId(request)
  if (typeof accountId !== 'string') {
    return null
  }

  try {
    const account = await prisma.account.findFirst({
      where: { id: accountId },
      include: { customer: true },
    })
    return account
  } catch {
    throw logout(request)
  }
}

export async function getAuthCustomer(request: Request) {
  const account = await getAuthAccount(request)

  return { account, customer: account?.customer }
}

export async function logout(request: Request) {
  const session = await getAuthSession(request)
  return redirect('/auth/sign-in', {
    headers: {
      'Set-Cookie': await storage.destroySession(session),
    },
  })
}
