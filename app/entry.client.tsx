import { RemixBrowser } from '@remix-run/react'
import { startTransition } from 'react'
import { hydrate as $hydrate } from 'react-dom'

import { ClientProvider } from '@mantine/remix'

const hydrate = () => {
  startTransition(() => {
    $hydrate(
      <ClientProvider>
        <RemixBrowser />
      </ClientProvider>,
      document,
    )
  })
}

if (window.requestIdleCallback) {
  window.requestIdleCallback(hydrate)
} else {
  // Safari doesn't support requestIdleCallback
  // https://caniuse.com/requestidlecallback
  window.setTimeout(hydrate, 1)
}
