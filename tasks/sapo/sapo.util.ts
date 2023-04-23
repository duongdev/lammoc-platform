import type { Debugger } from 'debug'
import type {
  ExtendOptions,
  FilterData,
  OptionsWithPagination,
  SearchParameters,
} from 'got-cjs'
import { toString } from 'lodash'

export const DEFAULT_PER_PAGE = 250

export type PaginationInput = {
  countLimit?: number
  perPage?: number
}

export const getPaginationOptions = <T = unknown, R = unknown>({
  countLimit,
  itemsKey,
  perPage = DEFAULT_PER_PAGE,
  searchParams = {},
  shouldContinue,
}: PaginationInput & {
  itemsKey?: string
  searchParams?: SearchParameters | URLSearchParams
  // eslint-disable-next-line no-unused-vars
  shouldContinue?: (data: FilterData<T>) => boolean
} = {}): OptionsWithPagination<T, R> => ({
  searchParams: {
    limit: perPage,
    ...searchParams,
  },
  pagination: {
    paginate: ({ currentItems, response }) => {
      // If there are no more data, finish.
      if (currentItems.length === 0) {
        return false
      }

      const body = JSON.parse((response as any).body)

      const metadata = body.metadata

      return {
        searchParams: {
          ...searchParams,
          page: +metadata.page + 1,
          limit: perPage,
        },
      }
    },
    transform: (response: any) => {
      const body = JSON.parse((response as any).body)
      const key = itemsKey || Object.keys(body).find((k) => k !== 'metadata')

      return JSON.parse(response.body)[key ?? ''] ?? []
    },
    ...(countLimit ? { countLimit } : {}),
    ...(shouldContinue ? { shouldContinue } : {}),
  },
})

export const gotExtendOptions = ({
  log,
  getCookies,
  refreshCookies,
}: {
  log: Debugger
  getCookies: () => Promise<any>
  refreshCookies: () => Promise<any>
}): ExtendOptions => {
  return {
    hooks: {
      beforeRetry: [
        async ({ code, options, name, message, response }, retryCount) => {
          if (code === 'CERT_HAS_EXPIRED' || response?.statusCode === 401) {
            const cookies =
              retryCount <= 1 ? await getCookies() : await refreshCookies()
            options.context.cookie = cookies
              .map((cookie: any) => `${cookie.name}=${cookie.value}`)
              .join('; ')

            log('[beforeRetry] Error calling Sapo API, retrying...', {
              code,
              name,
              message,
              retryCount,
              status: response?.statusCode,
            })
          } else {
            log(`[beforeRetry] Unhandled error`, {
              code,
              name,
              message,
              retryCount,
              status: response?.statusCode,
            })
          }
        },
      ],
      beforeRequest: [
        async (options) => {
          if (typeof options.context.cookie === 'string') {
            options.headers.Cookie = options.context.cookie
          } else {
            const cookies = await getCookies()
            options.headers.Cookie = cookies
              .map((cookie: any) => `${cookie.name}=${cookie.value}`)
              .join('; ')
          }
        },
      ],
      beforeError: [
        (error) => {
          log('Error calling Sapo API', error.response?.body || error)
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
  }
}

/** 
 * Round number by 500. 
 * 1200 => 1000
 * 1500 => 1500
 * 1800 => 2000
 */
export const roundPrice = (price: number) => Math.round(price / 500) * 500

export const id = toString
