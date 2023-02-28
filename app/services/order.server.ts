import type { Prisma, Tenant } from '@prisma/client'

import prisma from '~/libs/prisma.server'

import { getMaxTake } from './common.server'

export const getCustomerOrders = async (
  customerPhones: string[],
  {
    skip = 0,
    status,
    take = 20,
    tenant,
    searchText,
  }: {
    take?: number
    skip?: number
    status?: string
    tenant?: Tenant
    searchText?: string
  },
) => {
  const search = searchText?.toLowerCase().replace(/\s/g, '&')

  const where: Prisma.OrderWhereInput = {
    customer: { phone: { hasSome: customerPhones } },
    status,
    tenant,
    ...(search
      ? {
          OR: [
            {
              code: { contains: search },
            },
            {
              lineItems: {
                some: {
                  OR: [
                    { variant: { name: { search } } },
                    { product: { name: { search } } },
                  ],
                },
              },
            },
          ],
        }
      : {}),
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
