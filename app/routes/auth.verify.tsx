import { useEffect } from 'react'

import { Box, Loader } from '@mantine/core'
import type { LoaderArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { useLoaderData, useNavigate } from 'react-router'

import { awAccount } from '~/libs/appwrite'
import { JWT_SECRET, verify } from '~/libs/jwt.server'

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url)
  const token = url.searchParams.get('token')

  if (!token) {
    return redirect('/auth')
  }

  const decoded = verify(token, JWT_SECRET)

  return decoded
}

export default function VerifyToken() {
  const {
    email,
    password,
  }: {
    email: string
    password: string
  } = useLoaderData() as any
  const navigate = useNavigate()

  useEffect(() => {
    console.log({ email, password })
    awAccount.createEmailSession(email, password).then(() => {
      navigate('/app', { replace: true })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Box sx={{ textAlign: 'center' }}>
      <Loader />
    </Box>
  )
}
