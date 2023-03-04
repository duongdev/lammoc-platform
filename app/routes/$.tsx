import type { FC } from 'react'

import { Container } from '@mantine/core'

import ErrorHandler from '~/components/error-handler'

export type NotFoundProps = {}

const NotFound: FC<NotFoundProps> = () => {
  return (
    <Container
      sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}
    >
      <ErrorHandler
        caught={{ status: 404, data: {}, statusText: 'Not found' }}
      />
    </Container>
  )
}

export default NotFound
