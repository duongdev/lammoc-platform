import type { Prisma } from '@prisma/client'
import { PrismaClient } from '@prisma/client'
import type { Debugger } from 'debug'
import debug from 'debug'

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

let prisma: PrismaClient

declare global {
  var __db: PrismaClient | undefined
}

// this is needed because in development we don't want to restart
// the server with every change, but we want to make sure we don't
// create a new connection to the DB with every change either.
if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient()
} else {
  if (!global.__db) {
    global.__db = new PrismaClient()
  }
  prisma = global.__db
}

export default prisma
