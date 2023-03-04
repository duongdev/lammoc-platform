import type { FC } from 'react'
import { useMemo } from 'react'

import {
  Badge,
  Box,
  Card,
  Center,
  Divider,
  Group,
  Image,
  MediaQuery,
  Stack,
  Text,
} from '@mantine/core'
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
import { first, take } from 'lodash'

import { ORDER_LIST_MAX_ITEMS } from '~/config/app-config'
import {
  NOT_FOUND_PRODUCT_NAME,
  ORDER_STATUS,
  TENANT_LABEL,
} from '~/utils/constants'
import { fVND } from '~/utils/format'
import { useIsMobile } from '~/utils/hooks'

export type OrderItemProps = {
  order: Order & {
    customer: Customer | null
    deliveryFee: OrderDeliveryFee | null
    lineItems: (OrderLineItem & {
      variant: ProductVariant
      product: Product
    })[]
  }
}

const OrderItem: FC<OrderItemProps> = ({ order }) => {
  const isMobile = useIsMobile()

  const createdAt = useMemo(() => {
    if (differenceInDays(order.createdAt, Date.now()) <= 7) {
      return format(
        order.createdAt,
        isMobile ? 'dd/MM/yyyy' : 'HH:mm dd/MM/yyyy',
      )
    }
    return formatDistanceToNowStrict(order.createdAt, { addSuffix: true })
  }, [isMobile, order.createdAt])

  const lineItems = useMemo(
    () => take(order.lineItems, ORDER_LIST_MAX_ITEMS),
    [order.lineItems],
  )

  const status = order.status && ORDER_STATUS[order.status]

  const badges = (
    <>
      <Badge variant="gradient">{TENANT_LABEL[order.tenant]}</Badge>
      {status && <Badge color={status.color}>{status.label}</Badge>}
    </>
  )

  return (
    <Card
      withBorder
      component={Link}
      p="lg"
      radius="md"
      shadow="sm"
      to={`./${order.id}`}
      sx={(theme) => ({
        transition: 'all 0.2s',
        outline: 'solid 2px transparent !important',
        cursor: 'pointer',
        '&:hover': {
          outlineColor: `${theme.black} !important`,
          borderColor: theme.black,
        },
        '&:active': {
          transform: 'scale(0.995)',
        },
      })}
    >
      <Stack>
        <Group position="apart">
          <Stack>
            <Group>
              <Text weight="bold">{order.code}</Text>
              <Text color="dimmed" size="sm">
                {createdAt}
              </Text>
            </Group>
            <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
              <Group spacing="xs">{badges}</Group>
            </MediaQuery>
          </Stack>
          <Text>{fVND(order.total)}</Text>
        </Group>
        <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
          <Group spacing="xs">{badges}</Group>
        </MediaQuery>
        <Card.Section>
          <Divider />
        </Card.Section>
        <Stack spacing="xs">
          {lineItems.map((item) => (
            <Group noWrap key={item.id} spacing={isMobile ? 'xs' : 'md'}>
              <Text align="right" color="dimmed" sx={{ minWidth: 32 }}>
                {item.quantity}
              </Text>
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
                    alt={item.product.name || NOT_FOUND_PRODUCT_NAME}
                    fit="cover"
                    height={44}
                    radius="md"
                    width={44}
                    src={first([
                      ...item.variant.images,
                      ...item.product.images,
                    ])}
                  />
                </Box>
              </MediaQuery>
              <Box sx={{ flexGrow: '1 !important' as any }}>
                <Text
                  lineClamp={item.variant.name === item.product.name ? 2 : 1}
                  title={item.product.name}
                >
                  {item.product.name || NOT_FOUND_PRODUCT_NAME}
                </Text>
                {item.variant.name !== item.product.name && (
                  <Text
                    color="dimmed"
                    lineClamp={1}
                    size="sm"
                    title={item.variant.name}
                  >
                    {item.variant.name}
                  </Text>
                )}
              </Box>
              <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
                <Text lineClamp={1} size="sm" sx={{ flexShrink: 0 }}>
                  {fVND(item.price)}
                </Text>
              </MediaQuery>
            </Group>
          ))}
        </Stack>

        {order.lineItems.length > ORDER_LIST_MAX_ITEMS && (
          <Center>
            <Text color="dimmed" size="sm">
              +{order.lineItems.length - ORDER_LIST_MAX_ITEMS} sản phẩm
            </Text>
          </Center>
        )}
      </Stack>
    </Card>
  )
}

export default OrderItem
