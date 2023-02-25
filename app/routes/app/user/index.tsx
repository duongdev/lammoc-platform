import { useAuth } from '~/contexts/auth-context'

export default function User() {
  const { customer } = useAuth()
  return customer?.name
}
