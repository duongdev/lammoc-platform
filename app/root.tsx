import { createEmotionCache, MantineProvider } from '@mantine/core'
import { StylesPlaceholder } from '@mantine/remix'
import type { LinksFunction, V2_MetaFunction } from '@remix-run/node'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react'


import { theme } from './theme'

export const meta: V2_MetaFunction = () => [
  {
    charset: 'utf-8',
    title: 'Thích Làm Mộc',
    viewport: 'width=device-width,initial-scale=1',
  },
]

export const links: LinksFunction = () => {
  return [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.png' },
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    {
      rel: 'preconnect',
      href: 'https://fonts.gstatic.com',
      crossOrigin: 'anonymous',
    },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,200;0,300;0,400;0,500;0,600;1,200;1,300;1,400;1,500;1,600&display=swap',
    },
  ]
}


export default function App() {
  createEmotionCache({ key: 'mantine' })
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS theme={theme}>
      <html lang="en">
        <head>
          <StylesPlaceholder />
          <Meta />
          <Links />
        </head>
        <body>
          <Outlet />
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </body>
      </html>
    </MantineProvider>
  )
}
