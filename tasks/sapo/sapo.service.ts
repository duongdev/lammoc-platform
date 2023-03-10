import type {
  DeliveryServiceProvider,
  Order,
  OrderLineItem,
  Prisma,
  Product,
} from '@prisma/client'
import type { Debugger } from 'debug'
import Debug from 'debug'
import type { Got } from 'got-cjs'
import got from 'got-cjs'
import { flatten, toString } from 'lodash'
import puppeteer from 'puppeteer'

import prisma, { createChunkTransactions } from '~/libs/prisma.server'
import { normalizePhoneNumber } from '~/utils/account'

import { PUPPETEER_CONFIG, SAPO_PASS, SAPO_USER } from './sapo.config'
import { SAPO_TENANT } from './sapo.const'
import type {
  SapoAccount,
  SapoCustomer,
  SapoDeliveryServiceProviderItem,
  SapoOrderItem,
  SapoProductCategory,
  SapoProductItem,
  SapoTenant,
} from './sapo.type'
import type { PaginationInput } from './sapo.util'
import { gotExtendOptions, getPaginationOptions } from './sapo.util'

const TRANSACTION_SIZE = +(process.env.TRANSACTION_SIZE ?? 50)

export class Sapo {
  private sapo: Got
  private log: Debugger
  private SESSION_KEY: string

  constructor(
    /* eslint-disable no-unused-vars */
    private readonly tenant: SapoTenant,
    private readonly username: string = SAPO_USER!,
    private readonly password: string = SAPO_PASS!,
    logger?: Debugger,
  ) /* eslint-enable no-unused-vars */ {
    this.log = logger || Debug(`Sapo:${tenant}`)
    this.SESSION_KEY = `SAPO_TOKEN_${this.tenant}`

    this.sapo = got.extend({
      prefixUrl: `https://${this.tenant}.mysapogo.com/admin`,
      ...gotExtendOptions({
        log: this.log,
        getCookies: () => this.getCookies(),
        refreshCookies: () => this.refreshCookies(),
      }),
    })
  }

  async getCookies() {
    let cookies: string
    try {
      const dbCookies = await prisma.appMeta.findUniqueOrThrow({
        where: { id: this.SESSION_KEY },
      })

      cookies = dbCookies.value
    } catch (error) {
      cookies = JSON.stringify(await this.refreshCookies())
    }

    return JSON.parse(cookies)
  }

  /** Re-authenticate and update cookies to database */
  async refreshCookies() {
    this.log('Refreshing cookies')
    const browser = await puppeteer.launch(PUPPETEER_CONFIG)
    const page = await browser.newPage()

    await page.goto(
      `https://accounts.sapo.vn/login?clientId=a2KG8sj3g1&domain=${this.tenant}&relativeContextPath=/admin/orders`,
      { waitUntil: 'domcontentloaded' },
    )

    await page.type('#username', this.username)
    await page.type('#password', this.password)
    await page.click('.btn-login')

    await page.waitForSelector('.sb-avatar', {
      timeout: 3 * 60 * 1000, // 3m - sometimes it takes very long to sign in
    })

    const cookies = await page.cookies()

    await browser.close()

    const cookiesValue = JSON.stringify(cookies)
    await prisma.appMeta.upsert({
      where: { id: this.SESSION_KEY },
      create: { id: this.SESSION_KEY, value: cookiesValue },
      update: { value: cookiesValue },
    })

    this.log('Cookies refreshed')

    return cookies
  }

  async profiles() {
    const profiles = await this.sapo
      .get('profiles.json')
      .json<{ account: SapoAccount }>()
    return profiles
  }

  /** Sync all customers from Sapo to DB */
  async syncCustomers(options?: PaginationInput) {
    this.log('Sync all customers', options)

    const paginate = this.sapo.paginate<SapoCustomer>(
      'customers/doSearch.json',
      getPaginationOptions({
        ...options,
        searchParams: {
          sort: 'modified_on,desc',
        },
      }),
    )

    const transaction = createChunkTransactions({
      log: this.log,
      size: TRANSACTION_SIZE,
    })

    for await (const customer of paginate) {
      const customerData: Prisma.CustomerCreateInput = {
        id: customer.id.toString(),
        name: customer.name,
        code: customer.code,
        phone: flatten(
          (customer.phone_number ?? '').split(' / ').map((phone) =>
            phone
              .split(' - ')
              .filter((p) => !!p)
              .map((phone) => normalizePhoneNumber(phone)),
          ),
        ),
        tenant: SAPO_TENANT[this.tenant],
        email: customer.email,
        createdAt: new Date(customer.created_on),
        updatedAt: new Date(customer.modified_on),
      }

      await transaction.add(
        prisma.customer.upsert({
          where: {
            id: customer.id.toString(),
          },
          create: customerData,
          update: customerData,
        }),
      )
    }

    await transaction.close()

    this.log(`Synced ${transaction.proceeded()} customers`)
  }

  /** Sync all categories from Sapo to DB */
  async syncProductCategories(options?: PaginationInput) {
    this.log('Sync all categories', options)

    const paginate = this.sapo.paginate<SapoProductCategory>(
      'categories.json',
      getPaginationOptions(options),
    )

    const transaction = createChunkTransactions({
      log: this.log,
      size: TRANSACTION_SIZE,
    })

    for await (const category of paginate) {
      const categoryData: Prisma.ProductCategoryCreateInput = {
        id: toString(category.id),
        code: toString(category.code),
        name: category.name,
        tenant: SAPO_TENANT[this.tenant],
        description: category.description,
        createdAt: new Date(category.created_on),
        updatedAt: new Date(category.modified_on),
      }

      await transaction.add(
        prisma.productCategory.upsert({
          where: { id: categoryData.id },
          create: categoryData,
          update: categoryData,
        }),
      )
    }

    await transaction.close()

    this.log(`Synced ${transaction.proceeded()} categories`)
  }

  async syncProducts(options?: PaginationInput) {
    this.log('Sync all products', options)

    const paginate = this.sapo.paginate<SapoProductItem>(
      'products.json',
      getPaginationOptions(options),
    )

    const transaction = createChunkTransactions<Product>({
      size: TRANSACTION_SIZE,
      log: this.log,
    })

    for await (const product of paginate) {
      const category = {
        id: toString(product.category_id),
        code: product.category_code,
        name: product.category,
        tenant: SAPO_TENANT[this.tenant],
        updatedAt: new Date(),
      }
      const brand = {
        id: toString(product.brand_id),
        name: product.brand,
        tenant: SAPO_TENANT[this.tenant],
        updatedAt: new Date(),
      }
      const productData: Prisma.ProductCreateInput = {
        id: toString(product.id),
        name: product.name,
        tenant: SAPO_TENANT[this.tenant],
        brand: product.brand_id
          ? {
              connectOrCreate: {
                where: { id: toString(product.brand_id) },
                create: brand,
              },
            }
          : undefined,
        category: product.category_id
          ? {
              connectOrCreate: {
                where: { id: toString(product.category_id) },
                create: category,
              },
            }
          : undefined,
        createdAt: new Date(product.created_on),
        updatedAt: new Date(),
        description: product.description,
        tags: product.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter((t) => !!t),
        images:
          product.images.map((img) => img.full_path).filter((i) => !!i) ?? [],
        productVariants: {
          connectOrCreate: product.variants.map((variant) => ({
            where: { id: toString(variant.id) },
            create: {
              id: toString(variant.id),
              name: variant.name,
              tenant: SAPO_TENANT[this.tenant],
              updatedAt: new Date(variant.modified_on),
              barcode: variant.barcode,
              brand: product.brand_id
                ? {
                    connectOrCreate: {
                      where: { id: toString(product.brand_id) },
                      create: brand,
                    },
                  }
                : undefined,
              category: product.category_id
                ? {
                    connectOrCreate: {
                      where: { id: toString(product.category_id) },
                      create: category,
                    },
                  }
                : undefined,
              createdAt: new Date(variant.created_on),
              description: variant.description,
              images: (variant.images ?? []).map((image) => image.full_path),
              sku: variant.sku,
              unit: variant.unit ?? null,
            },
          })),
        },
      }

      await transaction.add(
        prisma.product.upsert({
          where: { id: productData.id },
          create: productData,
          update: productData,
        }),
      )
    }

    await transaction.close()

    this.log(`Synced ${transaction.proceeded()} products`)
  }

  async syncDeliveryServiceProviders(options?: PaginationInput) {
    this.log('syncDeliveryServiceProviders', options)

    const paginate = this.sapo.paginate<SapoDeliveryServiceProviderItem>(
      'delivery_service_providers.json',
      getPaginationOptions(options),
    )

    const transaction = createChunkTransactions<DeliveryServiceProvider>({
      size: TRANSACTION_SIZE,
      log: this.log,
    })

    for await (const provider of paginate) {
      const serviceData: Prisma.DeliveryServiceProviderCreateInput = {
        id: toString(provider.id),
        code: provider.code,
        name: provider.name,
        status: provider.status,
        tenant: SAPO_TENANT[this.tenant],
        type: provider.type,
        createdAt: provider.created_on && new Date(provider.created_on),
        debt: provider.debt,
        email: provider.email,
        freightPayer: provider.freight_payer,
        fulfillmentProcessingCount: provider.fulfillment_processing_count,
        groupName: provider.group_name,
        note: provider.note,
        phoneNumber: provider.phone_number,
        shipmentCount: provider.shipment_count,
        totalFreightAmount: provider.total_freight_amount,
        updatedAt: provider.modified_on && new Date(provider.modified_on),
      }

      await transaction.add(
        prisma.deliveryServiceProvider.upsert({
          where: { id: serviceData.id },
          create: serviceData,
          update: serviceData,
        }),
      )
    }

    await transaction.close()

    this.log(`Synced ${transaction.proceeded()} delivery service providers`)
  }

  async syncOrders({
    onlyModified,
    ...options
  }: PaginationInput & { onlyModified?: boolean } = {}) {
    this.log('Sync all orders', options)

    const lastSync = (
      await prisma.order.findFirst({
        orderBy: { syncedAt: 'desc' },
      })
    )?.syncedAt

    this.log(`Last sync:`, lastSync)

    await this.syncDeliveryServiceProviders()

    const paginate = this.sapo.paginate<SapoOrderItem>(
      'orders.json',
      getPaginationOptions({
        searchParams: {
          sort_by: 'modified_on desc',
        },
        shouldContinue:
          onlyModified && lastSync
            ? (data) => new Date(data.item.modified_on) > lastSync
            : undefined,
        ...options,
      }),
    )

    const transaction = createChunkTransactions<Order | OrderLineItem>({
      size: TRANSACTION_SIZE,
      log: this.log,
    })

    for await (const order of paginate) {
      const orderData: Prisma.OrderCreateInput = {
        id: toString(order.id),
        tenant: SAPO_TENANT[this.tenant],
        code: order.code,
        customer: order.customer_data
          ? {
              connectOrCreate: {
                where: { id: toString(order.customer_id) },
                create: {
                  id: toString(order.customer_id),
                  tenant: SAPO_TENANT[this.tenant],
                  code: order.customer_data.code,
                  name: order.customer_data.name,
                  updatedAt: new Date(order.customer_data.modified_on),
                  createdAt: new Date(order.customer_data.created_on),
                  email: order.customer_data.email ?? undefined,
                  phone: order.customer_data.phone_number
                    ? flatten(
                        (order.customer_data.phone_number ?? '')
                          .split(' / ')
                          .map((phone) =>
                            phone
                              .split(' - ')
                              .filter((p) => !!p)
                              .map((phone) => normalizePhoneNumber(phone)),
                          ),
                      )
                    : undefined,
                },
              },
            }
          : undefined,
        shippingAddress: order.shipping_address
          ? {
              connectOrCreate: {
                where: { id: toString(order.shipping_address.id) },
                create: {
                  id: toString(order.shipping_address.id),
                  tenant: SAPO_TENANT[this.tenant],
                  address1: order.shipping_address.address1,
                  address2: order.shipping_address.address2,
                  city: order.shipping_address.city,
                  country: order.shipping_address.country,
                  district: order.shipping_address.district,
                  email: order.shipping_address.email,
                  label: order.shipping_address.label,
                  ward: order.shipping_address.ward,
                  firstName: order.shipping_address.first_name,
                  lastName: order.shipping_address.last_name,
                  fullAddress: order.shipping_address.full_address,
                  fullName: order.shipping_address.full_name,
                  phoneNumber: order.shipping_address.phone_number,
                  zipCode: order.shipping_address.zip_code,
                },
              },
            }
          : undefined,
        total: order.total ?? 0,
        totalDiscount: order.total_discount ?? 0,
        canceledAt: order.cancelled_on && new Date(order.cancelled_on),
        channel: order.channel,
        createdAt: new Date(order.created_on),
        deliveryFee: order.delivery_fee
          ? {
              connectOrCreate: {
                where: {
                  id: toString(order.delivery_fee.shipping_cost_id ?? order.id),
                },
                create: {
                  tenant: SAPO_TENANT[this.tenant],
                  fee: order.delivery_fee.fee,
                  shippingCostId: toString(order.delivery_fee.shipping_cost_id),
                  shippingCostName: order.delivery_fee.shipping_cost_name,
                },
              },
            }
          : undefined,
        discountReason: order.discount_reason,
        einvoiceStatus: order.einvoice_status,
        fulfillmentStatus: order.fulfillment_status,
        issuedAt: order.issued_on && new Date(order.issued_on),
        note: order.note,
        packedStatus: order.packed_status,
        paymentStatus: order.payment_status,
        receivedStatus: order.received_status,
        returnStatus: order.return_status,
        status: order.status,
        tags: order.tags,
        totalTax: order.total_tax,
        updatedAt: new Date(order.modified_on),
        lineItems: {
          connectOrCreate: order.order_line_items.map((lineItem) => ({
            where: { id: toString(lineItem.id) },
            create: {
              id: toString(lineItem.id),
              price: lineItem.price,
              tenant: SAPO_TENANT[this.tenant],
              createdAt: new Date(lineItem.created_on),
              updatedAt: new Date(lineItem.modified_on),
              discountAmount: lineItem.discount_amount,
              discountReason: lineItem.discount_reason,
              discountValue: lineItem.discount_value,
              distributedDiscountAmount: lineItem.distributed_discount_amount,
              lineAmount: lineItem.line_amount,
              note: lineItem.note,
              quantity: lineItem.quantity,
              // productId: toString(lineItem.product_id),
              // productVariantId: toString(lineItem.variant_id),
              taxAmount: lineItem.tax_amount,
              taxRate: lineItem.tax_rate,
              product: {
                connectOrCreate: {
                  where: { id: toString(lineItem.product_id) },
                  create: {
                    id: toString(lineItem.product_id),
                    name: lineItem.product_name ?? '',
                    tenant: SAPO_TENANT[this.tenant],
                  },
                },
              },
              variant: {
                connectOrCreate: {
                  where: { id: toString(lineItem.variant_id) },
                  create: {
                    id: toString(lineItem.variant_id),
                    name: lineItem.variant_name ?? '',
                    tenant: SAPO_TENANT[this.tenant],
                    product: {
                      connectOrCreate: {
                        where: { id: toString(lineItem.product_id) },
                        create: {
                          id: toString(lineItem.product_id),
                          name: lineItem.product_name ?? '',
                          tenant: SAPO_TENANT[this.tenant],
                        },
                      },
                    },
                  },
                },
              },
            },
          })),
        },
        completedOn: order.completed_on && new Date(order.completed_on),
        createInvoice: !!order.create_invoice,
        finalizedOn: order.finalized_on && new Date(order.finalized_on),
        finishedOn: order.finished_on && new Date(order.finished_on),
        fulfillments: {
          connectOrCreate: (order.fulfillments ?? []).map((f) => ({
            where: { id: toString(f.id) },
            create: {
              id: toString(f.id),
              accountId: toString(f.account_id ?? ''),
              code: f.code,
              deliveryType: f.delivery_type,
              paymentStatus: f.payment_status,
              tenant: SAPO_TENANT[this.tenant],
              total: f.total,
              totalDiscount: f.total_discount,
              totalTax: f.total_tax,
              cancelDate: f.cancel_date ? new Date(f.cancel_date) : undefined,
              createdAt: new Date(f.created_on),
              discountAmount: f.discount_amount,
              discountRate: f.discount_rate,
              discountValue: f.discount_value,
              notes: f.notes,
              packedOn: f.packed_on && new Date(f.packed_on),
              partnerId: toString(f.partner_id),
              receivedOn: f.received_on && new Date(f.received_on),
              shippedOn: f.shipped_on && new Date(f.shipped_on),
              shippingAddress: f.shipping_address,
              status: f.status,
              stockLocationId: toString(f.stock_location_id),
              updatedAt: f.modified_on && new Date(f.modified_on),
              shipment: !f.shipment
                ? undefined
                : {
                    connectOrCreate: {
                      where: { id: toString(f.shipment.id) },
                      create: {
                        id: toString(f.shipment.id),
                        tenant: SAPO_TENANT[this.tenant],
                        // deliveryServiceProviderId: toString(
                        //   f.shipment.delivery_service_provider_id,
                        // ),
                        deliveryServiceProvider: {
                          connect: {
                            id: toString(
                              f.shipment.delivery_service_provider_id,
                            ),
                          },
                        },
                        serviceName: f.shipment.service_name,
                        codAmount: f.shipment.cod_amount,
                        collationStatus: f.shipment.collation_status,
                        createdAt: new Date(f.shipment.created_on),
                        deliveryFee: f.shipment.delivery_fee,
                        detail: f.shipment.detail,
                        estimatedDeliveryTime:
                          f.shipment.estimated_delivery_time,
                        freightAmount: f.shipment.freight_amount,
                        freightPayer: f.shipment.freight_payer,
                        height: f.shipment.height ?? 0,
                        length: f.shipment.length ?? 0,
                        note: f.shipment.note,
                        partnerOrderId: toString(f.shipment.partner_order_id),
                        pushingNote: f.shipment.pushing_note,
                        pushingStatus: f.shipment.pushing_status,
                        referenceStatus: f.shipment.reference_status,
                        referenceStatusExplanation:
                          f.shipment.reference_status_explanation,
                        shippingAddress: !f.shipment.shipping_address
                          ? undefined
                          : {
                              connectOrCreate: {
                                where: {
                                  id: toString(f.shipment.shipping_address.id),
                                },
                                create: {
                                  id: toString(f.shipment.shipping_address.id),
                                  tenant: SAPO_TENANT[this.tenant],
                                  address1:
                                    f.shipment.shipping_address.address1,
                                  address2:
                                    f.shipment.shipping_address.address2,
                                  city: f.shipment.shipping_address.city,
                                  country: f.shipment.shipping_address.country,
                                  district:
                                    f.shipment.shipping_address.district,
                                  email: f.shipment.shipping_address.email,
                                  label: f.shipment.shipping_address.label,
                                  ward: f.shipment.shipping_address.ward,
                                  firstName:
                                    f.shipment.shipping_address.first_name,
                                  lastName:
                                    f.shipment.shipping_address.last_name,
                                  fullAddress:
                                    f.shipment.shipping_address.full_address,
                                  fullName:
                                    f.shipment.shipping_address.full_name,
                                  phoneNumber:
                                    f.shipment.shipping_address.phone_number,
                                  zipCode: f.shipment.shipping_address.zip_code,
                                },
                              },
                            },
                        sortingCode: f.shipment.sorting_code,
                        trackingCode: f.shipment.tracking_code,
                        trackingUrl: f.shipment.tracking_url,
                        updatedAt:
                          f.shipment.modified_on &&
                          new Date(f.shipment.modified_on),
                        weight: f.shipment.weight ?? 0,
                        width: f.shipment.width ?? 0,
                      },
                    },
                  },
            },
          })),
        },
      }

      await transaction.add(
        prisma.order.upsert({
          where: { id: orderData.id },
          create: orderData,
          update: orderData,
        }),
        // ...lineItems,
      )
    }

    await transaction.close()

    this.log(`Synced ${transaction.proceeded()} orders`)
  }
}
