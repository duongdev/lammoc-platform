export const wait = async (ms = 1000) =>
  new Promise((resolve) => setTimeout(resolve, ms))

export const getSearchParams = (request: Request) => {
  const url = new URL(request.url)
  return url.searchParams
}

export const removeVietnameseTones = (text: string): string => {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
}

export const normalizeSearchText = (text: string): string =>
  removeVietnameseTones(text.replace(/\s+/g, ' ').trim()).replace(/\s/, '&')
