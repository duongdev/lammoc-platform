import type { FC } from 'react'
import { useMemo } from 'react'

import type { MantineNumberSize } from '@mantine/core'
import {
  Badge,
  Box,
  Breadcrumbs,
  Divider,
  Grid,
  Group,
  Image,
  MediaQuery,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import type { OrderLineItem, Product, ProductVariant } from '@prisma/client'
import type { LoaderArgs, V2_MetaFunction } from '@remix-run/node'
import { Response } from '@remix-run/node'
import { Link } from '@remix-run/react'
import { IconChevronRight, IconHome, IconX } from '@tabler/icons-react'
import { format } from 'date-fns'
import { first, orderBy } from 'lodash'

import prisma from '~/libs/prisma.server'
import { getAuthSession } from '~/services/session.server'
import {
  NOT_FOUND_PRODUCT_NAME,
  ORDER_STATUS,
  PAYMENT_STATUS,
  TENANT_LABEL,
} from '~/utils/constants'
import type { UseDataFunctionReturn } from '~/utils/data'
import { superjson, useSuperLoaderData } from '~/utils/data'
import { fVND } from '~/utils/format'
import { useIsMobile } from '~/utils/hooks'
import { getTitle } from '~/utils/meta'
import type { ArrayElement } from '~/utils/types'

export async function loader({ params, request }: LoaderArgs) {
  const { customerPhones } = await getAuthSession(request)
  const { orderId } = params

  if (!orderId) {
    throw new Response('Không tìm thấy đơn hàng', { status: 404 })
  }

  const order = await prisma.order.findFirst({
    where: {
      OR: [
        {
          id: orderId,
          customer:
            // Can view any order in development
            process.env.NODE_ENV === 'production'
              ? {
                  OR: customerPhones.map((phone) => ({
                    phone: { has: phone },
                  })),
                }
              : undefined,
        },
        { code: orderId },
      ],
    },
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

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: getTitle(`Đơn hàng ${data.json.code}`) }]
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
          <Text>{order.code}</Text>
        </Breadcrumbs>

        <Title>Đơn hàng {order.code}</Title>

        <Group color="dimmed" spacing="xs">
          <Text color="dimmed" size="sm">
            Đặt hàng lúc <b>{format(order.createdAt, 'HH:mm')}</b> ngày{' '}
            <b>{format(order.createdAt, 'dd/MM/yyyy')}</b> tại
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

        <Grid grow>
          <Grid.Col xs={6}>
            <PaymentDetails fulfillment={fulfillment} order={order} />
          </Grid.Col>

          <Grid.Col xs={6}>
            <DeliveryDetails fulfillment={fulfillment} order={order} />
          </Grid.Col>
        </Grid>

        <Divider />

        <Grid grow>
          <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
            <Grid.Col xs={6}>
              {/* <Title order={4}>Theo dõi đơn hàng</Title>
              <OrderTimeline order={order} /> */}
            </Grid.Col>
          </MediaQuery>
          <Grid.Col xs={6}>
            <OrderSummary order={order} />
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
  const isMobile = useIsMobile()
  const image = first([...lineItem.variant.images, ...lineItem.product.images])
  const shouldShowVariant = lineItem.variant.name !== lineItem.product.name
  const imageSize = isMobile ? 48 : 64

  return (
    <Box>
      <Group noWrap spacing={isMobile ? 'xs' : 'md'}>
        <Box
          sx={(theme) => ({
            boxShadow: theme.shadows.md,
            overflow: 'hidden',
            borderRadius: theme.radius.md,
            height: imageSize,
            width: imageSize,
            flexShrink: 0,
          })}
        >
          <Image
            withPlaceholder
            fit="cover"
            height={imageSize}
            src={image}
            width={imageSize}
          />
        </Box>
        <Box sx={{ flexGrow: '1 !important' as any }}>
          <Text lineClamp={shouldShowVariant ? 1 : 2}>
            {lineItem.product.name || NOT_FOUND_PRODUCT_NAME}
          </Text>
          {shouldShowVariant && (
            <Text color="dimmed" lineClamp={2}>
              {lineItem.variant.name}
            </Text>
          )}
        </Box>
        <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
          <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
            <Text>{fVND(lineItem.price)}</Text>
            <Text color="dimmed" size="sm">
              SL: {lineItem.quantity}
            </Text>
          </Box>
        </MediaQuery>
      </Group>
      <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
        <Group position="right" spacing={4} sx={{ opacity: 0.6 }}>
          <Text size="sm">{lineItem.quantity}</Text>
          <IconX size={14} />
          <Text size="sm">{fVND(lineItem.price)}</Text>
        </Group>
      </MediaQuery>
    </Box>
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
            {address.fullName || order.customer?.name || '[Không tên]'}{' '}
            {address.phoneNumber ? ` - ${address.phoneNumber}` : ''}
            <br />
            {address.address1}, {address.ward}, {address.district},{' '}
            {address.city}
          </Text>
        </Box>
        {deliveryMethod}
      </Stack>
    )
  }, [address, deliveryMethod, order.customer?.name])

  return (
    <Stack spacing="sm">
      <Title order={4}>Giao hàng</Title>
      {content}
    </Stack>
  )
}

const OrderSummary: FC<{ order: Order }> = ({ order }) => {
  const subtotal = useMemo(
    () =>
      order.lineItems.reduce(
        (total, item) => total + item.price * (item.quantity ?? 1),
        0,
      ),
    [order.lineItems],
  )

  return (
    <Stack spacing={4}>
      <SI content={['Tổng tiền', fVND(subtotal)]} size="lg" />
      <SI d content={['Giảm giá', fVND(-order.totalDiscount)]} />
      <SI d content={['Phí vận chuyển', fVND(order.deliveryFee?.fee ?? 0)]} />
      <SI
        d
        content={['Thuế', fVND(order.totalTax ?? 0)]}
        strike={!order.createInvoice}
      />
      <Divider my="sm" variant="dashed" />
      <SI b content={['Tổng cộng', fVND(order.total ?? 0)]} size="lg" />
    </Stack>
  )
}

const SI: FC<{
  content: [string, string]
  size?: MantineNumberSize
  d?: boolean
  b?: boolean
  strike?: boolean
}> = ({ content, size, d: dimmed, b: bold, strike }) => {
  return (
    <Group position="apart">
      <Text color={dimmed ? 'dimmed' : undefined} size={size}>
        {content[0]}
      </Text>
      <Text
        color={dimmed ? 'dimmed' : undefined}
        size={size}
        strikethrough={strike}
        weight={bold ? 600 : undefined}
      >
        {content[1]}
      </Text>
    </Group>
  )
}

export default OrderView
