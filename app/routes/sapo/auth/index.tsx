import { useLoaderData } from '@remix-run/react'

import { Sapo } from 'tasks/sapo/sapo.service'

export async function loader() {
  const sapo = new Sapo()
  const cookies = await sapo.getCookies()

  return cookies
}

export default function SapoAuthIndex() {
  const cookies = useLoaderData<typeof loader>()

  return <>Cookies: {JSON.stringify(cookies)}</>
}
