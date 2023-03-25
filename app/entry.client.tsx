import { startTransition } from 'react'
import { hydrateRoot } from 'react-dom/client'

import { ClientProvider } from '@mantine/remix'
import { RemixBrowser } from '@remix-run/react'

const hydrate = () => {
  startTransition(() => {
    hydrateRoot(
      document.getElementById('root')!,
      <ClientProvider>
        <RemixBrowser />
      </ClientProvider>,
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
