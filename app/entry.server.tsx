import { renderToString } from 'react-dom/server'

import { injectStyles, createStylesServer } from '@mantine/remix'
import type { EntryContext } from '@remix-run/node'
import { RemixServer } from '@remix-run/react'

import { emotionCache } from './utils/emotion-cache'

const server = createStylesServer(emotionCache)

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  let markup = renderToString(
    <RemixServer context={remixContext} url={request.url} />,
  )
  responseHeaders.set('Content-Type', 'text/html')

  return new Response(`<!DOCTYPE html>${injectStyles(markup, server)}`, {
    status: responseStatusCode,
    headers: responseHeaders,
  })
}
