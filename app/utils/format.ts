import { setDefaultOptions } from 'date-fns'
import { vi } from 'date-fns/locale'
import numeral from 'numeral'

setDefaultOptions({ locale: vi })

export const fVND = (amount = 0, noSign = false) =>
  `${numeral(amount).format('0,0')}${noSign ? '' : '₫'}`
