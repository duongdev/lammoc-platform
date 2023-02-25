import { useAuth } from '~/contexts/auth-context'

export default function User() {
  const { customer } = useAuth()
  return <div style={{height: '300vh'}}>{customer?.name}</div>
}
