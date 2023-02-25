import type { FC } from 'react'

import {
  Box,
  Burger,
  Center,
  Container,
  createStyles,
  Group,
  Header,
  Image,
  Menu,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { Link } from '@remix-run/react'
import { IconChevronDown } from '@tabler/icons-react'

export type HeaderProps = {
  links: {
    link: string
    label: string
    links?: { link: string; label: string }[]
  }[]
  logoLink?: string
}

const AppBar: FC<HeaderProps> = ({ links, logoLink = '/' }) => {
  const { classes } = useStyles()
  const [opened, { toggle }] = useDisclosure(false)

  const items = links.map((link) => {
    const menuItems = link.links?.map((item) => (
      <Menu.Item key={item.link}>{item.label}</Menu.Item>
    ))

    if (menuItems) {
      return (
        <Menu exitTransitionDuration={0} key={link.label} trigger="hover">
          <Menu.Target>
            <Link className={classes.link} to={link.link}>
              <Center>
                <span className={classes.linkLabel}>{link.label}</span>
                <IconChevronDown size={12} stroke={1.5} />
              </Center>
            </Link>
          </Menu.Target>
          <Menu.Dropdown>{menuItems}</Menu.Dropdown>
        </Menu>
      )
    }

    return (
      <Link className={classes.link} key={link.label} to={link.link}>
        {link.label}
      </Link>
    )
  })

  console.log(items)

  return (
    <Header height={56}>
      <Container sx={{ height: '100%' }}>
        <Box className={classes.inner}>
          <Link
            title="Store Làm Mộc"
            to={logoLink}
          >
            <Image height={36} src="/img/slm-logo.png" width="auto" />
          </Link>

          <Group className={classes.links} spacing={5}>
            {items}
          </Group>
          <Burger
            className={classes.burger}
            onClick={toggle}
            opened={opened}
            size="sm"
          />
        </Box>
      </Container>
    </Header>
  )
}

const useStyles = createStyles((theme) => ({
  inner: {
    height: 56,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  links: {
    [theme.fn.smallerThan('sm')]: {
      display: 'none',
    },
  },

  burger: {
    [theme.fn.largerThan('sm')]: {
      display: 'none',
    },
  },

  link: {
    display: 'block',
    lineHeight: 1,
    padding: '8px 12px',
    borderRadius: theme.radius.sm,
    textDecoration: 'none',
    color:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    '&:hover': {
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },
  },

  linkLabel: {
    marginRight: 5,
  },
}))

export default AppBar
