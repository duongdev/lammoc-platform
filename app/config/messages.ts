import { MIN_PASSWORD_LENGTH } from './app-config'

export const AUTH_PHONE_NOT_EXIST = 'Số điện thoại chưa tồn tại trong hệ thống'
export const UNABLE_TO_SET_PASSWORD =
  'Không thể cập nhật mật khẩu. Vui lòng thử lại.'
export const INVALID_PASSWORD_LENGTH = `Mật khẩu phải có ít nhất ${MIN_PASSWORD_LENGTH} ký tự.`
export const INVALID_OTP = 'Mã OTP không đúng.'
export const INVALID_PHONE_NUMBER = 'Số điện thoại không hợp lệ'
export const INVALID_AUTH_CREDENTIALS = 'Thông tin đăng nhập không đúng.'
export const RATE_LIMIT_EXCEEDED =
  'Quá nhiều yêu cầu trong thời gian ngắn. Vui lòng thử lại sau.'
export const CUSTOMER_NOT_FOUND = 'Không thể tìm thấy thông tin khách hàng'
