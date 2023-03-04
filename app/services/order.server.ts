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
              code: { search },
            },
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

  const [
    orders,
    filteredCount,
    {
      _count: { _all: totalCount },
      _sum: { total: totalExpense },
    },
  ] = await prisma.$transaction([
    prisma.order.findMany({
      where,
      include: {
        customer: true,
        deliveryFee: true,
        lineItems: {
          include: { variant: true, product: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: getMaxTake(take),
      skip,
    }),
    prisma.order.count({ where }),
    prisma.order.aggregate({
      _sum: { total: true },
      _count: { _all: true },
      where: {
        customer: { phone: { hasSome: customerPhones } },
        status: { in: ['draft', 'finalized', 'completed'] },
      },
    }),
  ])

  return {
    orders,
    totalCount,
    totalPages: Math.ceil(filteredCount / take),
    totalExpense: totalExpense ?? 0,
  }
}
