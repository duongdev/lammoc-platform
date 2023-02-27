import type { FC } from 'react'
import { useMemo } from 'react'

import {
  Badge,
  Box,
  Card,
  Divider,
  Group,
  Image,
  MediaQuery,
  Stack,
  Text,
} from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import type {
  Customer,
  Order,
  OrderDeliveryFee,
  OrderLineItem,
  Product,
  ProductVariant,
} from '@prisma/client'
import { Link } from '@remix-run/react'
import { IconX } from '@tabler/icons-react'
import { differenceInDays, format, formatDistanceToNowStrict } from 'date-fns'
import { first } from 'lodash'

import { fVND } from '~/utils/format'

export type OrderItemProps = {
  order: Order & {
    customer: Customer
    deliveryFee: OrderDeliveryFee | null
    lineItems: (OrderLineItem & {
      variant: ProductVariant & { product: Product }
    })[]
  }
}

const OrderItem: FC<OrderItemProps> = ({ order }) => {
  const isMobile = useMediaQuery('(max-width: 800px)')

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
              <Text weight="bold">{order.code}</Text>
              <Text color="dimmed" size="sm">{createdAt}</Text>
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
        <Stack spacing="xs">
          {order.lineItems.map((item) => (
            <Group noWrap key={item.id} spacing={isMobile ? 'xs' : 'md'}>
              <Text color="dimmed">{item.quantity}</Text>
              <IconX size={16} style={{ flexShrink: 0 }} />
              <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
                <Box
                  sx={(theme) => ({
                    boxShadow: theme.shadows.md,
                    overflow: 'hidden',
                    borderRadius: theme.radius.md,
                    flexShrink: 0,
                  })}
                >
                  <Image
                    withPlaceholder
                    alt={item.variant.product.name}
                    fit="cover"
                    height={44}
                    radius="md"
                    width={44}
                    src={first([
                      ...item.variant.images,
                      ...item.variant.product.images,
                    ])}
                  />
                </Box>
              </MediaQuery>
              <Box sx={{ flexGrow: 1 }}>
                <Text
                  color="dark"
                  lineClamp={1}
                  title={item.variant.product.name}
                >
                  {item.variant.product.name}
                </Text>
                {item.variant.name !== item.variant.product.name && (
                  <Text color="dimmed" lineClamp={1} title={item.variant.name}>
                    {item.variant.name}
                  </Text>
                )}
              </Box>
              <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
                <Text lineClamp={1} sx={{ flexShrink: 0 }}>
                  {fVND(item.price)}
                </Text>
              </MediaQuery>
            </Group>
          ))}
        </Stack>
      </Stack>
    </Card>
  )
}

export default OrderItem
