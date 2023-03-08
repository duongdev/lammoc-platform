import numeral from 'numeral'

export const fVND = (amount: number | null = 0, noSign = false) =>
  `${numeral(amount).format('0,0')}${noSign ? '' : '₫'}`

export const fOrderCode = (code: string) => `#${code.replace(/^SON/, '')}`

export const fPhone = (phone: string) => {
  return phone.replace(/^\+84/, '0')
}
