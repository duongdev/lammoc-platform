import { redirect } from "@remix-run/node"

export async function loader() {
  return redirect('/app/orders')
}

export default function AppIndex() {
  return 'app index'
}
