import { createCookieSessionStorage, redirect } from '@remix-run/node'
import { compareSync } from 'bcrypt'

import prisma from '~/libs/prisma.server'

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

  const isPasswordCorrect = await compareSync(password, account.password)

  if (!isPasswordCorrect) {
    return null
  }

  return { id: account.id }
}

const sessionSecret = process.env.SESSION_SECRET
if (!sessionSecret) {
  throw new Error('SESSION_SECRET must be set')
}

const storage = createCookieSessionStorage({
  cookie: {
    name: 'RJ_session',
    // normally you want this to be `secure: true`
    // but that doesn't work on localhost for Safari
    // https://web.dev/when-to-use-local-https/
    secure: process.env.NODE_ENV === 'production',
    secrets: [sessionSecret],
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
})

export async function createUserSession(accountId: string, redirectTo: string) {
  const session = await storage.getSession()
  session.set('accountId', accountId)
  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await storage.commitSession(session),
    },
  })
}
