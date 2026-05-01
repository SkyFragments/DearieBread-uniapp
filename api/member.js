/**
 * 会员相关 API
 */

import { get } from './request.js'

/**
 * 获取会员信息（等级、成长值、积分）
 */
export function getMemberInfo() {
  return get('/member/info')
}

/**
 * 获取成长值记录
 */
export function getGrowthLogs(page = 1, limit = 20) {
  return get('/member/growth', { page, limit })
}

/**
 * 获取积分记录
 */
export function getPointsLogs(page = 1, limit = 20) {
  return get('/member/points', { page, limit })
}

/**
 * 获取积分商城商品列表
 */
export function getPointsMallProducts(page = 1, limit = 20) {
  return get('/points-mall/products', { page, limit })
}

/**
 * 兑换积分商品
 * @param {number} productId 商品 ID
 */
export function redeemPointsProduct(productId) {
  return post('/points-mall/redeem', { productId })
}

/**
 * 获取会员权益
 */
export function getMemberBenefits() {
  return get('/member/benefits')
}