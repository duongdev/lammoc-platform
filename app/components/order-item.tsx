import type { FC } from 'react'
import { useMemo } from 'react'

import { Badge, Card, Divider, Group, Stack, Text } from '@mantine/core'
import type { Order } from '@prisma/client'
import { Link } from '@remix-run/react'
import { differenceInDays, format, formatDistanceToNowStrict } from 'date-fns'

import { fVND } from '~/utils/format'

export type OrderItemProps = {
  order: Order
}

const OrderItem: FC<OrderItemProps> = ({ order }) => {
  const createdAt = useMemo(() => {
    if (differenceInDays(order.createdAt, Date.now()) <= 7) {
      return format(order.createdAt, 'HH:mm dd/MM/yyyy')
    }
    return formatDistanceToNowStrict(order.createdAt, { addSuffix: true })
  }, [order.createdAt])

  return (
    <Card
      withBorder
      component={Link}
      p="lg"
      radius="md"
      shadow="sm"
      to={`./${order.id}`}
      sx={(theme) => ({
        transition: 'outline-color 0.2s',
        outline: 'solid 2px transparent !important',
        cursor: 'pointer',
        '&:hover': {
          outlineColor: `${theme.colors.orange[5]} !important`,
        },
      })}
    >
      <Stack>
        <Group position="apart">
          <Stack>
            <Group>
              <Text>{order.code}</Text>
              <Text color="dimmed">{createdAt}</Text>
            </Group>
            <Group spacing="xs">
              <Badge>{order.tenant}</Badge>
              <Badge>{order.status}</Badge>
            </Group>
          </Stack>
          <Text>{fVND(order.total)}</Text>
        </Group>
        <Card.Section>
          <Divider />
        </Card.Section>
        <Text>Content</Text>
      </Stack>
    </Card>
  )
}

export default OrderItem
