import type { Prisma } from '@prisma/client'
import { PrismaClient } from '@prisma/client'
import type { Debugger } from 'debug'
import debug from 'debug'

const prisma = new PrismaClient()

export const createChunkTransactions = <T = unknown>(
  options: {
    log?: Debugger
    size?: number
  } = {},
) => {
  const { size = 500, log: $log } = options

  const log = $log ?? debug('libs:prisma:transactionChunk')
  let proceeded = 0

  let pending: Prisma.PrismaPromise<T>[] = []

  const clear = () => {
    pending = []
  }

  const proceed = async () => {
    log(`Executing ${pending.length} transactions`)

    await prisma.$transaction(pending)
    proceeded += pending.length

    log(`Executed ${proceeded} transactions`)

    clear()
  }

  const add = async (transaction: Prisma.PrismaPromise<T>) => {
    pending.push(transaction)

    if (pending.length >= size) {
      await proceed()
    }
  }

  return {
    add,
    clear,
    close: proceed,
    proceeded: () => proceeded,
    pending: () => pending,
  }
}

export default prisma
