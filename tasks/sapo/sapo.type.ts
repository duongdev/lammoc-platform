import type account from './sample-data/account.json'
import type customer from './sample-data/customer.json'
import type orderItem from './sample-data/order_item.json'
import type productItem from './sample-data/product_item.json'

export type SapoTenant = 'store-lam-moc' | 'thichtulam'
export type SapoAccount = typeof account
export type SapoCustomer = typeof customer
export type SapoProductItem = typeof productItem
export type SapoOrderItem = typeof orderItem

export type SapoProductCategory = {
  id: number
  tenant_id: number
  description: string | null
  name: string
  created_on: string
  modified_on: string
  code: string
  status: string
  default: boolean
}
