/**
 * 格式化工具函数
 */

/**
 * 格式化金额（保留2位小数）
 * @param {number} amount 金额
 * @returns {string}
 */
export function formatPrice(amount) {
  return Number(amount || 0).toFixed(2)
}

/**
 * 格式化日期
 * @param {string|Date} date 日期
 * @param {string} format 格式，默认 'YYYY-MM-DD'
 */
export function formatDate(date, format = 'YYYY-MM-DD') {
  if (!date) return ''
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')

  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

/**
 * 格式化相对时间（刚刚、几分钟前、几天前）
 * @param {string|Date} date 日期
 */
export function formatRelativeTime(date) {
  if (!date) return ''
  const now = Date.now()
  const timestamp = new Date(date).getTime()
  const diff = now - timestamp

  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour

  if (diff < minute) return '刚刚'
  if (diff < hour) return `${Math.floor(diff / minute)}分钟前`
  if (diff < day) return `${Math.floor(diff / hour)}小时前`
  if (diff < 7 * day) return `${Math.floor(diff / day)}天前`
  return formatDate(date, 'MM-DD HH:mm')
}

/**
 * 格式化手机号（中间四位为 *）
 */
export function formatPhone(phone) {
  if (!phone) return ''
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

/**
 * 格式化取餐码（4位数字）
 * @param {string|number} code 取餐码
 */
export function formatPickupCode(code) {
  return String(code).padStart(4, '0')
}

/**
 * 转换TabBar页面路径
 * 用于 switchTab 跳转
 */
export function getTabBarPath(path) {
  // 移除前导 /
  const cleanPath = path.replace(/^\//, '')
  return `/${cleanPath}`
}

export default {
  formatPrice,
  formatDate,
  formatRelativeTime,
  formatPhone,
  formatPickupCode,
  getTabBarPath,
}