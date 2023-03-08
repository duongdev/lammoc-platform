import { Container, MantineProvider } from '@mantine/core'
import { StylesPlaceholder } from '@mantine/remix'
import type { LinksFunction, V2_MetaFunction } from '@remix-run/node'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
} from '@remix-run/react'
import { setDefaultOptions } from 'date-fns'
import vi from 'date-fns/locale/vi'

import ErrorHandler from './components/error-handler'
import NProgress from './components/nprogress'
import { theme } from './theme'
import { emotionCache } from './utils/emotion-cache'
import { getTitle } from './utils/meta'

setDefaultOptions({ locale: vi })

export const meta: V2_MetaFunction = () => [
  {
    name: 'viewport',
    content: 'width=device-width,initial-scale=1',
  },
]

export const links: LinksFunction = () => {
  return [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.png' }]
}

export default function App() {
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      emotionCache={emotionCache}
      theme={theme}
    >
      <html lang="en">
        <head>
          <StylesPlaceholder />
          <meta charSet="utf-8" />
          <meta
            content="initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no, width=device-width, height=device-height, target-densitydpi=device-dpi"
            name="viewport"
          />

          <Meta />
          <Links />
          <link href="https://fonts.googleapis.com" rel="preconnect" />
          <link
            crossOrigin=""
            href="https://fonts.gstatic.com"
            rel="preconnect"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,200;0,300;0,400;0,500;0,600;1,200;1,300;1,400;1,500;1,600&display=swap"
            rel="stylesheet"
          />
        </head>
        <body>
          <Outlet />
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
          <NProgress />
        </body>
      </html>
    </MantineProvider>
  )
}

export function CatchBoundary() {
  const caught = useCatch()
  console.log('root.tsx')
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      emotionCache={emotionCache}
      theme={theme}
    >
      <html>
        <head>
          <StylesPlaceholder />
          <meta charSet="utf-8" />
          <meta content="width=device-width,initial-scale=1" name="viewport" />
          <Meta />
          <Links />
          <link href="https://fonts.googleapis.com" rel="preconnect" />
          <link
            crossOrigin=""
            href="https://fonts.gstatic.com"
            rel="preconnect"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,200;0,300;0,400;0,500;0,600;1,200;1,300;1,400;1,500;1,600&display=swap"
            rel="stylesheet"
          />
          <title>{getTitle(`${caught.status} ${caught.statusText}`)}</title>
        </head>
        <body>
          <Container
            sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}
          >
            <ErrorHandler caught={caught} />
          </Container>
          <Scripts />
          <ScrollRestoration />
          <LiveReload />
        </body>
      </html>
    </MantineProvider>
  )
}
