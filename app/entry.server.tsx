import { renderToString } from 'react-dom/server'

import { injectStyles, createStylesServer } from '@mantine/remix'
import type { EntryContext } from '@remix-run/node'
import { RemixServer } from '@remix-run/react'
import { renderHeadToString } from 'remix-island'

import { Head } from './root'
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

  // console.log(markup)

  const head = renderHeadToString({ request, remixContext, Head })

  return new Response(
    `<!DOCTYPE html><html><head>${head}</head><body><div id="root">${injectStyles(
      markup,
      server,
    )}</div></body></html>`,
    {
      status: responseStatusCode,
      headers: responseHeaders,
    },
  )
}
