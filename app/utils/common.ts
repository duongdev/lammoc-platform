export const wait = async (ms = 1000) =>
  new Promise((resolve) => setTimeout(resolve, ms))

export const getSearchParams = (request: Request) => {
  const url = new URL(request.url)
  return url.searchParams
}