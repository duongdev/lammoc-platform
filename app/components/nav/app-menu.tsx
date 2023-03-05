import type { FC } from 'react'

import { Card, Group, Stack, Text } from '@mantine/core'
import { Link } from '@remix-run/react'
import type { Icon } from '@tabler/icons-react'

export type MenuItemProps = {
  label: string
  icon: Icon
  color?: string
  to: string
}

export type AppMenuProps = {
  items: MenuItemProps[]
}

const AppMenu: FC<AppMenuProps> = ({ items }) => {
  return (
    <Group>
      {items.map((item) => (
        <MenuItem key={item.label} {...item} />
      ))}
    </Group>
  )
}

const MenuItem: FC<MenuItemProps> = ({ icon: Icon, label, to }) => {
  return (
    <Card
      withBorder
      component={Link}
      radius="lg"
      to={to}
      sx={(theme) => {
        const accent = theme.colorScheme === 'light' ? theme.black : theme.white
        return {
          color: 'unset',
          textDecoration: 'none',
          display: 'grid',
          placeItems: 'center',
          transition: 'all 0.2s',
          outline: 'solid 1px transparent !important',
          '&:hover': {
            outlineColor: `${accent} !important`,
            borderColor: accent,
          },
          '&:active': {
            transform: 'scale(0.95)',
          },
        }
      }}
    >
      <Stack align="center" spacing="xs" sx={{ flexDirection: 'row' }}>
        <Icon size={32} />
        <Text>{label}</Text>
      </Stack>
    </Card>
  )
}

export default AppMenu
