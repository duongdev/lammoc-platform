import type account from './sample-data/account.json'
import type customer from './sample-data/customer.json'
import type delivery_service_provider_id from './sample-data/delivery_service_provider_item.json'
import type order_item from './sample-data/order_item.json'
import type product_item from './sample-data/product_item.json'

export type SapoTenant = 'store-lam-moc' | 'thichtulam'
export type SapoAccount = typeof account
export type SapoCustomer = typeof customer
export type SapoProductItem = typeof product_item
export type SapoOrderItem = typeof order_item
export type SapoDeliveryServiceProviderItem =
  typeof delivery_service_provider_id

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
