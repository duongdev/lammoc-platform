import { redirect } from "@remix-run/node"
import type { LoaderFunction } from "react-router"

export const loader: LoaderFunction = () => {
  return redirect('./sign-in')
}