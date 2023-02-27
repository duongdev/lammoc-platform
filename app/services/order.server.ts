import type { Tenant } from '@prisma/client'

import prisma from '~/libs/prisma.server'

import { getMaxTake } from './common.server'

export const getCustomerOrders = async (
  customerPhones: string[],
  {
    skip = 0,
    status,
    take = 20,
    tenant,
  }: {
    take?: number
    skip?: number
    status?: string
    tenant?: Tenant
  },
) => {
  const where = {
    customer: { phone: { hasSome: customerPhones } },
    status,
    tenant,
  }

  const [orders, totalCount] = await prisma.$transaction([
    prisma.order.findMany({
      where,
      include: {
        customer: true,
        deliveryFee: true,
        lineItems: {
          include: { variant: { include: { product: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: getMaxTake(take),
      skip,
    }),
    prisma.order.count({ where }),
  ])

  return { orders, totalCount, totalPages: Math.ceil(totalCount / take) }
}
