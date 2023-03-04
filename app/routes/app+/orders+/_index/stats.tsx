import type { FC } from 'react'

import { Box, Group, MediaQuery, Paper, Text } from '@mantine/core'
import type { Icon } from '@tabler/icons-react'
import { IconCash, IconShoppingCart } from '@tabler/icons-react'
import numeral from 'numeral'

import { fVND } from '~/utils/format'

export type OrderStatsProps = {
  expenses: number
  orders: number
}

const OrderStats: FC<OrderStatsProps> = ({ expenses, orders }) => {
  return (
    <Group
      sx={{
        '@media (max-width: 640px)': {
          width: '100%',
          flexWrap: 'nowrap',
        },
      }}
    >
      <StatItem
        icon={IconShoppingCart}
        label="đơn hàng"
        value={numeral(orders).format('0,0')}
      />
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
      p="xs"
      radius="md"
      sx={{ borderWidth: 2, flexGrow: 1, flexShrink: 0 }}
    >
      <Group>
        <MediaQuery smallerThan="xs" styles={{ display: 'none' }}>
          <IconComponent />
        </MediaQuery>
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
