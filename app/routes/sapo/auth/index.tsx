import { useLoaderData } from '@remix-run/react'

import { Sapo } from '~/services/sapo/sapo.server'

export async function loader() {
  const sapo = new Sapo()
  const cookies = await sapo.getCookies()

  return cookies
}

export default function SapoAuthIndex() {
  const cookies = useLoaderData<typeof loader>()

  return <>Cookies: {JSON.stringify(cookies)}</>
}
