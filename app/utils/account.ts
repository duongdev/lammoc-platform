export const normalizePhoneNumber = (phone: string) => {
  return `+${phone.replace(/\D/g, '').replace(/^0/, '84')}`
}

export const getUserIdFromPhone = (phone: string) => {
  return normalizePhoneNumber(phone).replace(/\D/g, '').replace(/^0/, '')
}

export const getAuthEmailFromPhone = (phone: string) => {
  return `p_${getUserIdFromPhone(phone).replace(/\D/g, '')}@khachhang.lammoc.vn`
}
