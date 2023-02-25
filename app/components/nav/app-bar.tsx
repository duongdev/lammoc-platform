import type { FC} from 'react';
import { useEffect } from 'react'

import {
  Burger,
  Container,
  createStyles,
  Group,
  Header,
  Image,
  Paper,
  Transition,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { Link, NavLink, useLocation } from '@remix-run/react'

const HEADER_HEIGHT = 56

export type HeaderProps = {
  links: {
    link: string
    label: string
  }[]
  logoLink?: string
}

const AppBar: FC<HeaderProps> = ({ links, logoLink = '/' }) => {
  const [opened, { toggle, close }] = useDisclosure(false)
  const { classes, cx } = useStyles()
  const location = useLocation()

  const items = links.map((link) => {
    return (
      <NavLink
        key={link.label}
        to={link.link}
        className={({ isActive }) =>
          cx(classes.link, {
            [classes.linkActive]: isActive,
          })
        }
      >
        {link.label}
      </NavLink>
    )
  })

  useEffect(() => {
    close()
  }, [close, location])

  return (
    <Header className={classes.root} height={HEADER_HEIGHT}>
      <Container className={classes.header}>
        <Link title="Store Làm Mộc" to={logoLink}>
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

        <Transition duration={200} mounted={opened} transition="pop-top-right">
          {(styles) => (
            <Paper withBorder className={classes.dropdown} style={styles}>
              {items}
            </Paper>
          )}
        </Transition>
      </Container>
    </Header>
  )
}

const useStyles = createStyles((theme) => ({
  root: {
    position: 'relative',
    zIndex: 1,
  },

  dropdown: {
    position: 'absolute',
    top: HEADER_HEIGHT,
    left: 0,
    right: 0,
    zIndex: 0,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    borderTopWidth: 0,
    overflow: 'hidden',

    [theme.fn.largerThan('sm')]: {
      display: 'none',
    },
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
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

    [theme.fn.smallerThan('sm')]: {
      borderRadius: 0,
      padding: theme.spacing.md,
    },
  },

  linkActive: {
    '&, &:hover': {
      backgroundColor: theme.fn.variant({
        variant: 'light',
        color: theme.primaryColor,
      }).background,
      color: theme.fn.variant({ variant: 'light', color: theme.primaryColor })
        .color,
    },
  },
}))

export default AppBar
