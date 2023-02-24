import type { Prisma } from '@prisma/client'
import { PrismaClient } from '@prisma/client'
import type { Debugger } from 'debug'
import debug from 'debug'

const prisma = new PrismaClient()

export const transactionChunk = <T = unknown>(
  options: {
    log?: Debugger
    size?: number
  } = {},
) => {
  const { size = 500, log: $log } = options

  const log = $log ?? debug('libs:prisma:transactionChunk')

  let transactions: Prisma.PrismaPromise<T>[] = []

  const clear = () => {
    transactions = []
  }

  const add = async (transaction: Prisma.PrismaPromise<T>) => {
    transactions.push(transaction)

    if (transactions.length >= size) {
      log(`Executing ${transactions.length} transactions`)
      await prisma.$transaction(transactions)
      log(`Executed ${transactions.length} transactions`)
      clear()
    }
  }

  return { add, clear, transactions }
}

export default prisma
