import prisma from '~/libs/prisma.server'

import { getMaxTake } from './common.server'

export const getCustomerOrders = async (
  customerPhones: string[],
  {
    skip = 0,
    status,
    take = 20,
  }: {
    take?: number
    skip?: number
    status?: string
  },
) => {
  const where = { customer: { phone: { hasSome: customerPhones } }, status }

  const [orders, totalCount] = await prisma.$transaction([
    prisma.order.findMany({
      where,
      include: {
        customer: true,
        deliveryFee: true,
      },
      orderBy: { createdAt: 'desc' },
      take: getMaxTake(take),
      skip,
    }),
    prisma.order.count({ where }),
  ])

  return { orders, totalCount, totalPages: Math.ceil(totalCount / take) }
}
