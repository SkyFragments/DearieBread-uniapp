/**
 * 认证工具函数
 */

import { getToken, removeToken, removeUserInfo } from './storage.js'

/**
 * 检查是否已登录
 */
export function isLoggedIn() {
  return !!getToken()
}

/**
 * 验证登录状态，未登录则跳转登录页
 * @returns {boolean} 是否已登录
 */
export function requireLogin() {
  if (!isLoggedIn()) {
    uni.showToast({ title: '请先登录', icon: 'none' })
    setTimeout(() => {
      uni.navigateTo({ url: '/pages/login/index' })
    }, 1500)
    return false
  }
  return true
}

/**
 * 跳转登录页
 */
export function goToLogin() {
  uni.navigateTo({ url: '/pages/login/index' })
}

/**
 * 退出登录
 */
export function logout() {
  removeToken()
  removeUserInfo()
  uni.showToast({ title: '已退出登录', icon: 'success' })
  setTimeout(() => {
    uni.switchTab({ url: '/pages/home/index' })
  }, 1500)
}

export default {
  isLoggedIn,
  requireLogin,
  goToLogin,
  logout,
}