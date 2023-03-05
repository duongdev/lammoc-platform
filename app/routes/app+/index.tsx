import { Container } from '@mantine/core'
import { redirect } from '@remix-run/node'
import { useCatch } from '@remix-run/react'

import ErrorHandler from '~/components/error-handler'

export async function loader() {
  return redirect('/app/account')
}
export function CatchBoundary() {
  const caught = useCatch()
  console.log('app/index.tsx')
  return (
    <Container
      sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}
    >
      <ErrorHandler caught={caught} />
    </Container>
  )
}
