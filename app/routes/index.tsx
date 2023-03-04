import { Container } from "@mantine/core"
import { redirect } from "@remix-run/node"
import { useCatch } from "@remix-run/react"

import ErrorHandler from "~/components/error-handler"

export const loader = () => {
  return redirect('/app')
}


export function CatchBoundary() {
  const caught = useCatch()
  console.log('app/_index')
  return (
    <Container sx={{ display: 'grid', placeItems: 'center' }}>
      <ErrorHandler caught={caught} />
    </Container>
  )
}