import type {
  FilterData,
  OptionsWithPagination,
  SearchParameters,
} from 'got-cjs'

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
