import type { FC } from 'react'
import { useMemo } from 'react'

import {
  Badge,
  Box,
  Breadcrumbs,
  Divider,
  Grid,
  Group,
  Image,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import type { OrderLineItem, Product, ProductVariant } from '@prisma/client'
import type { LoaderArgs } from '@remix-run/node'
import { Response } from '@remix-run/node'
import { Link } from '@remix-run/react'
import { IconChevronRight, IconHome } from '@tabler/icons-react'
import { format } from 'date-fns'
import { first, orderBy } from 'lodash'

import prisma from '~/libs/prisma.server'
import { ORDER_STATUS, PAYMENT_STATUS, TENANT_LABEL } from '~/utils/constants'
import type { UseDataFunctionReturn } from '~/utils/data'
import { superjson, useSuperLoaderData } from '~/utils/data'
import { fVND } from '~/utils/format'
import type { ArrayElement } from '~/utils/types'

export async function loader({ params }: LoaderArgs) {
  const { orderId } = params

  if (!orderId) {
    throw new Response('Không tìm thấy đơn hàng', { status: 404 })
  }

  // TODO: Prevent wrong customer access
  const order = await prisma.order.findFirst({
    where: { OR: [{ id: orderId }, { code: orderId }] },
    include: {
      customer: true,
      deliveryFee: true,
      shippingAddress: true,
      lineItems: {
        include: {
          product: true,
          variant: true,
        },
      },
      fulfillments: {
        include: {
          shipment: {
            include: {
              shippingAddress: true,
              deliveryServiceProvider: true,
            },
          },
        },
      },
    },
  })

  if (!order) {
    throw new Response('Không tìm thấy đơn hàng', { status: 404 })
  }

  return superjson(order)
}

export type OrderViewProps = {}

const breadcrumbs = [
  { title: <IconHome size={18} />, to: '/app' },
  { title: 'Đơn hàng', to: '/app/orders' },
].map((item) => (
  <Text
    color="dimmed"
    component={Link}
    key={item.to}
    to={item.to}
    sx={{
      textDecoration: 'none',
      '&:hover': {
        color: 'inherit',
      },
    }}
  >
    {item.title}
  </Text>
))

type Order = UseDataFunctionReturn<typeof loader>
type Fulfillment = ArrayElement<Order['fulfillments']>

const OrderView: FC<OrderViewProps> = () => {
  const order = useSuperLoaderData<typeof loader>()
  const orderStatus = order.status && ORDER_STATUS[order.status]
  const fulfillment = first(
    orderBy(
      order.fulfillments.filter((f) => f.status !== 'cancelled'),
      'updatedAt',
      'desc',
    ),
  )

  return (
    <>
      <Stack>
        <Breadcrumbs separator={<IconChevronRight size={16} />}>
          {breadcrumbs}
          <Text>SON3213</Text>
        </Breadcrumbs>

        <Title>Đơn hàng SON3212</Title>

        <Group color="dimmed" spacing="xs">
          <Text color="dimmed">
            Đặt hàng lúc{' '}
            <span style={{ fontWeight: 500 }}>
              {format(order.createdAt, 'HH:mm')}
            </span>{' '}
            ngày{' '}
            <span style={{ fontWeight: 500 }}>
              {format(order.createdAt, 'dd/MM/yyyy')}
            </span>{' '}
            tại
          </Text>
          <Badge variant="gradient">{TENANT_LABEL[order.tenant]}</Badge>

          {orderStatus && (
            <Badge color={orderStatus.color} variant="dot">
              {orderStatus.label}
            </Badge>
          )}
        </Group>

        <Divider />

        <Stack spacing="xs">
          {order.lineItems.map((lineItem) => (
            <LineItem key={lineItem.id} lineItem={lineItem} />
          ))}
        </Stack>

        <Divider />

        <Grid>
          <Grid.Col xs={6}>
            <PaymentDetails fulfillment={fulfillment} order={order} />
          </Grid.Col>
          <Grid.Col xs={6}>
            <DeliveryDetails fulfillment={fulfillment} order={order} />
          </Grid.Col>
        </Grid>
      </Stack>
    </>
  )
}

const LineItem: FC<{
  lineItem: OrderLineItem & {
    product: Product
    variant: ProductVariant
  }
}> = ({ lineItem }) => {
  const image = first([...lineItem.variant.images, ...lineItem.product.images])
  const shouldShowVariant = lineItem.variant.name !== lineItem.product.name

  return (
    <Group>
      <Box
        sx={(theme) => ({
          boxShadow: theme.shadows.md,
          overflow: 'hidden',
          borderRadius: theme.radius.md,
          height: 64,
          width: 64,
        })}
      >
        <Image withPlaceholder fit="cover" height={64} src={image} width={64} />
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Text lineClamp={shouldShowVariant ? 1 : 2}>
          {lineItem.product.name}
        </Text>
        {shouldShowVariant && (
          <Text color="dimmed" lineClamp={2}>
            {lineItem.variant.name}
          </Text>
        )}
      </Box>
      <Box sx={{ textAlign: 'right' }}>
        <Text>{fVND(lineItem.price)}</Text>
        <Text color="dimmed" size="sm">
          SL: {lineItem.quantity}
        </Text>
      </Box>
    </Group>
  )
}

const PaymentDetails: FC<{ order: Order; fulfillment?: Fulfillment }> = ({
  order,
  fulfillment,
}) => {
  const paymentStatus = order.paymentStatus || fulfillment?.paymentStatus
  return (
    <Stack spacing="sm">
      <Title order={4}>Thanh toán</Title>
      <Text>
        {(paymentStatus && PAYMENT_STATUS[paymentStatus]) ?? 'Chưa xác định'}
      </Text>
    </Stack>
  )
}

const DeliveryDetails: FC<{ order: Order; fulfillment?: Fulfillment }> = ({
  order,
  fulfillment,
}) => {
  const { shippingAddress: address } = order
  const deliveryService = fulfillment?.shipment?.deliveryServiceProvider

  console.log(fulfillment)

  const deliveryMethod = useMemo(() => {
    if (!deliveryService) {
      return null
    }

    return (
      <Box>
        <Text color="dimmed" size="sm">
          Giao hàng
        </Text>
        <Text>{deliveryService.name}</Text>
        {fulfillment.shipment?.trackingUrl && (
          <Text
            underline
            color="cyan"
            component="a"
            href={fulfillment.shipment.trackingUrl}
            rel="noreferrer"
            size="sm"
            target="_blank"
          >
            Theo dõi đơn hàng
          </Text>
        )}
      </Box>
    )
  }, [deliveryService, fulfillment?.shipment?.trackingUrl])

  const content = useMemo(() => {
    if (!address) {
      return <Text>Nhận tại cửa hàng</Text>
    }

    return (
      <Stack spacing="xs">
        <Box>
          <Text color="dimmed" size="sm">
            Địa chỉ
          </Text>
          <Text>
            {address.fullName}{' '}
            {address.phoneNumber ? ` - ${address.phoneNumber}` : ''}
            <br />
            {address.address1}, {address.ward}, {address.district},{' '}
            {address.city}
          </Text>
        </Box>
        {deliveryMethod}
      </Stack>
    )
  }, [address, deliveryMethod])

  return (
    <Stack spacing="sm">
      <Title order={4}>Giao hàng</Title>
      {content}
    </Stack>
  )
}

export default OrderView
