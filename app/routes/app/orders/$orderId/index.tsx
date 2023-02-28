import type { FC } from 'react'

import {
  Badge,
  Box,
  Breadcrumbs,
  Chip,
  Divider,
  Grid,
  Group,
  Image,
  Space,
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
import { first } from 'lodash'

import prisma from '~/libs/prisma.server'
import { ORDER_STATUS, TENANT_LABEL } from '~/utils/constants'
import { superjson, useSuperLoaderData } from '~/utils/data'
import { fVND } from '~/utils/format'

export async function loader({ params }: LoaderArgs) {
  const { orderId } = params

  if (!orderId) {
    throw new Response('Không tìm thấy đơn hàng', { status: 404 })
  }

  const order = await prisma.order.findFirst({
    where: { OR: [{ id: orderId }, { code: orderId }] },
    include: {
      customer: true,
      deliveryFee: true,
      lineItems: {
        include: {
          product: true,
          variant: true,
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

const OrderView: FC<OrderViewProps> = () => {
  const order = useSuperLoaderData<typeof loader>()
  const orderStatus = order.status && ORDER_STATUS[order.status]

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
          <Grid.Col md={6} xs={12}>
            <Title order={4}>Thanh toán</Title>
            <Text>{order.paymentStatus}</Text>
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
        })}
      >
        <Image withPlaceholder fit="cover" src={image} width={64} />
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

export default OrderView
