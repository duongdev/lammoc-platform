import type { FC } from 'react'

import { Box, Title, Group, Button, Image, Text } from '@mantine/core'
import type { ThrownResponse } from '@remix-run/react'
import { IconHome, IconRefresh } from '@tabler/icons-react'

export type ErrorHandlerProps = {
  caught: ThrownResponse
}

const ErrorHandler: FC<ErrorHandlerProps> = ({ caught }) => {
  return (
    <Box sx={{ textAlign: 'center' }}>
      <Image src="/img/empty_states-12.svg" />
      <Title>Oh no {caught.status}...</Title>
      <Text>
        {caught.status === 404
          ? 'Trang này không tồn tại hoặc đã bị xoá'
          : 'Có lỗi kỳ lạ xảy ra'}
      </Text>
      <Group mt={16} position="center">
        <Button component="a" href="/" leftIcon={<IconHome size={18} />}>
          Về trang chủ
        </Button>
        <Button
          leftIcon={<IconRefresh size={18} />}
          onClick={() => window.location.reload()}
          variant="outline"
        >
          Tải lại trang
        </Button>
      </Group>
    </Box>
  )
}

export default ErrorHandler
