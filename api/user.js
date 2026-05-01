/**
 * 用户相关 API
 */

import { get, post } from './request.js'

/**
 * 微信登录
 * @param {string} code 微信授权码
 */
export function wxLogin(code) {
  return post('/user/login', { code })
}

/**
 * 获取用户信息
 */
export function getUserInfo() {
  return get('/user/info')
}

/**
 * 更新用户信息
 * @param {Object} data { nickname, avatar, phone }
 */
export function updateUserInfo(data) {
  return post('/user/update', data)
}

/**
 * 获取健康档案
 */
export function getHealthProfile() {
  return get('/user/health-profile')
}

/**
 * 更新健康档案
 * @param {Object} data { height, weight, goal, dietRestrictions }
 */
export function updateHealthProfile(data) {
  return post('/user/health-profile', data)
}

/**
 * 获取成长值记录
 * @param {number} page 页码
 * @param {number} limit 每页条数
 */
export function getGrowthLogs(page = 1, limit = 20) {
  return get('/member/growth', { page, limit })
}

/**
 * 获取积分记录
 * @param {number} page 页码
 * @param {number} limit 每页条数
 */
export function getPointsLogs(page = 1, limit = 20) {
  return get('/member/points', { page, limit })
}