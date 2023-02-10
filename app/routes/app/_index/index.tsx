import { Box, Loader } from '@mantine/core'

import { useAuth } from '~/hooks/useAuth'

export default function AppIndex() {
  const { account, isLoading } = useAuth()

  if (isLoading || !account) {
    return (
      <Box sx={{ height: '100vh', display: 'grid', placeItems: 'center' }}>
        <Loader />
      </Box>
    )
  }

  return account?.name
}
