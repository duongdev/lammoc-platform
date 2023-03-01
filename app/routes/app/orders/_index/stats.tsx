import type { FC } from 'react'

import { Box, Group, Paper, Text } from '@mantine/core'
import type { Icon } from '@tabler/icons-react'
import { IconCash, IconShoppingCart } from '@tabler/icons-react'

import { fVND } from '~/utils/format'

const CARD_WIDTH = 200

export type OrderStatsProps = {
  expenses: number
  orders: number
}

const OrderStats: FC<OrderStatsProps> = ({ expenses, orders }) => {
  console.log({ expenses, orders })

  return (
    <Group>
      <StatItem icon={IconShoppingCart} label="đơn hàng" value={orders} />
      <StatItem icon={IconCash} label="chi tiêu" value={fVND(expenses)} />
    </Group>
  )
}

const StatItem: FC<{ label: string; value: string | number; icon: Icon }> = ({
  label,
  value,
  icon: IconComponent,
}) => {
  return (
    <Paper
      withBorder
      miw={CARD_WIDTH}
      p="xs"
      radius="md"
      sx={{ borderWidth: 2 }}
    >
      <Group>
        <IconComponent />
        <Box>
          <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
            {label}
          </Text>
          <Text size="xl" weight={700}>
            {value}
          </Text>
        </Box>
      </Group>
    </Paper>
  )
}

export default OrderStats
