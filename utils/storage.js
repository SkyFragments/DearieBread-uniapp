/**
 * 存储工具封装
 * 统一封装 uni.getStorageSync / setStorage / removeStorage
 */

const TOKEN_KEY = 'token'
const USER_INFO_KEY = 'userInfo'
const CART_KEY = 'cart'
const SEARCH_HISTORY_KEY = 'searchHistory'

/**
 * 获取 Token
 */
export function getToken() {
  return uni.getStorageSync(TOKEN_KEY) || ''
}

/**
 * 设置 Token
 */
export function setToken(token) {
  uni.setStorageSync(TOKEN_KEY, token)
}

/**
 * 移除 Token
 */
export function removeToken() {
  uni.removeStorageSync(TOKEN_KEY)
}

/**
 * 获取用户信息
 */
export function getUserInfo() {
  const info = uni.getStorageSync(USER_INFO_KEY)
  return info ? JSON.parse(info) : null
}

/**
 * 设置用户信息
 */
export function setUserInfo(info) {
  uni.setStorageSync(USER_INFO_KEY, JSON.stringify(info))
}

/**
 * 移除用户信息
 */
export function removeUserInfo() {
  uni.removeStorageSync(USER_INFO_KEY)
}

/**
 * 获取购物车数据（本地缓存）
 */
export function getLocalCart() {
  const cart = uni.getStorageSync(CART_KEY)
  return cart ? JSON.parse(cart) : []
}

/**
 * 设置购物车数据（本地缓存）
 */
export function setLocalCart(cart) {
  uni.setStorageSync(CART_KEY, JSON.stringify(cart))
}

/**
 * 清空购物车（本地缓存）
 */
export function clearLocalCart() {
  uni.removeStorageSync(CART_KEY)
}

/**
 * 获取搜索历史
 */
export function getSearchHistory() {
  const history = uni.getStorageSync(SEARCH_HISTORY_KEY)
  return history ? JSON.parse(history) : []
}

/**
 * 添加搜索历史
 */
export function addSearchHistory(keyword) {
  const history = getSearchHistory()
  // 去重后添加最新搜索词
  const filtered = history.filter((item) => item !== keyword)
  const newHistory = [keyword, ...filtered].slice(0, 20) // 最多保留20条
  uni.setStorageSync(SEARCH_HISTORY_KEY, JSON.stringify(newHistory))
}

/**
 * 清空搜索历史
 */
export function clearSearchHistory() {
  uni.removeStorageSync(SEARCH_HISTORY_KEY)
}

/**
 * 清除所有本地存储
 */
export function clearAllStorage() {
  uni.clearStorageSync()
}

export default {
  getToken,
  setToken,
  removeToken,
  getUserInfo,
  setUserInfo,
  removeUserInfo,
  getLocalCart,
  setLocalCart,
  clearLocalCart,
  getSearchHistory,
  addSearchHistory,
  clearSearchHistory,
  clearAllStorage,
}