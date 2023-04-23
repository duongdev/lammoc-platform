import type { ArrayElement } from '~/utils/types'

import type account from './sample-data/account.json'
import type customer from './sample-data/customer.json'
import type delivery_service_provider_id from './sample-data/delivery_service_provider_item.json'
import type loyalty_member_item from './sample-data/loyalty_member_item.json'
import type loyalty_point_event_item from './sample-data/loyalty_point_event_item.json'
import type loyalty_tier_item from './sample-data/loyalty_tier_item.json'
import type order_item from './sample-data/order_item.json'
import type product_item from './sample-data/product_item.json'

export type SapoTenant = 'store-lam-moc' | 'thichtulam'
export type SapoAccount = typeof account
export type SapoCustomer = typeof customer
export type SapoProductItem = typeof product_item
export type SapoVariantItem = ArrayElement<typeof product_item.variants>
export type SapoOrderItem = typeof order_item
export type SapoDeliveryServiceProviderItem =
  typeof delivery_service_provider_id
export type SapoLoyaltyPointEventItem = typeof loyalty_point_event_item
export type SapoLoyaltyMemberItem = typeof loyalty_member_item
export type SapoLoyaltyTierItem = typeof loyalty_tier_item

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
