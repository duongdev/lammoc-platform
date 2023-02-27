import type { Order, OrderLineItem, Prisma, Product } from '@prisma/client'
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
  SapoOrderItem,
  SapoProductCategory,
  SapoProductItem,
  SapoTenant,
} from './sapo.type'
import type { PaginationInput } from './sapo.util'
import { getPaginationOptions } from './sapo.util'

const TRANSACTION_SIZE = +(process.env.TRANSACTION_SIZE ?? 50)

export class Sapo {
  private sapo: Got
  private log: Debugger

  constructor(
    /* eslint-disable no-unused-vars */
    private readonly tenant: SapoTenant,
    private readonly username: string = SAPO_USER!,
    private readonly password: string = SAPO_PASS!,
  ) /* eslint-enable no-unused-vars */ {
    this.log = Debug(`Sapo:${tenant}`)

    this.sapo = got.extend({
      prefixUrl: `https://${this.tenant}.mysapogo.com/admin`,
      hooks: {
        beforeRetry: [
          async ({ code, options, name, message, response }, retryCount) => {
            if (code === 'CERT_HAS_EXPIRED' || response?.statusCode === 401) {
              const cookies =
                retryCount <= 1
                  ? await this.getCookies()
                  : await this.refreshCookies()
              const headers = {
                Cookie: cookies
                  .map((cookie: any) => `${cookie.name}=${cookie.value}`)
                  .join('; '),
              }
              options.context.headers = headers
              return
            }

            this.log(`[beforeRetry] Unhandled error`, {
              code,
              name,
              message,
              retryCount,
              status: response?.statusCode,
            })
          },
        ],
        beforeRequest: [
          (options) => {
            options.headers = (options.context.headers as any) ?? {}
          },
        ],
        beforeError: [
          (error) => {
            this.log('Error calling Sapo API', error)
            return error
          },
        ],
      },
      retry: {
        limit: 3,
        errorCodes: [
          'ETIMEDOUT',
          'ECONNRESET',
          'EADDRINUSE',
          'ECONNREFUSED',
          'EPIPE',
          'ENOTFOUND',
          'ENETUNREACH',
          'EAI_AGAIN',
          'CERT_HAS_EXPIRED',
        ],
        statusCodes: [401],
      },
    })
  }

  async getCookies() {
    let cookies: string
    try {
      const dbCookies = await prisma.appMeta.findUniqueOrThrow({
        where: { id: `SAPO_TOKEN_${this.tenant}` },
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
      where: { id: `SAPO_TOKEN_${this.tenant}` },
      create: { id: `SAPO_TOKEN_${this.tenant}`, value: cookiesValue },
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

  async syncOrders(options?: PaginationInput) {
    this.log('Sync all orders', options)

    const paginate = this.sapo.paginate<SapoOrderItem>(
      'orders.json',
      getPaginationOptions(options),
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
        customer: {
          connectOrCreate: {
            where: { id: toString(order.customer_id) },
            create: {
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
        },
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
      }

      // const lineItems = order.order_line_items.map((lineItem) => {
      //   const data = {
      //     id: toString(lineItem.id),
      //     price: lineItem.price,
      //     tenant: SAPO_TENANT[this.tenant],
      //     createdAt: new Date(lineItem.created_on),
      //     updatedAt: new Date(lineItem.modified_on),
      //     discountAmount: lineItem.discount_amount,
      //     discountReason: lineItem.discount_reason,
      //     discountValue: lineItem.discount_value,
      //     distributedDiscountAmount: lineItem.distributed_discount_amount,
      //     lineAmount: lineItem.line_amount,
      //     note: lineItem.note,
      //     quantity: lineItem.quantity,
      //     // productId: toString(lineItem.product_id),
      //     // productVariantId: toString(lineItem.variant_id),
      //     product: { connect: { id: toString(lineItem.product_id) } },
      //     variant: { connect: { id: toString(lineItem.variant_id) } },

      //     taxAmount: lineItem.tax_amount,
      //     taxRate: lineItem.tax_rate,
      //   }

      //   return prisma.orderLineItem.upsert({
      //     where: { id: toString(lineItem.id) },
      //     create: data,
      //     update: data,
      //   })
      // })

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
