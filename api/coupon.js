/**
 * 优惠券相关 API
 */

import { get, post } from './request.js'

/**
 * 获取优惠券列表
 * @param {string} status 状态：available / used / expired
 */
export function getCouponList(status = 'available') {
  return get('/coupon/list', { status })
}

/**
 * 领取优惠券
 * @param {number} couponId 优惠券 ID
 */
export function receiveCoupon(couponId) {
  return post('/coupon/receive', { couponId })
}

/**
 * 获取优惠券领取记录
 */
export function getCouponRecords() {
  return get('/coupon/records')
}

/**
 * 获取优惠券领取状态（是否已领取）
 * @param {number} couponId 优惠券 ID
 */
export function checkCouponReceived(couponId) {
  return get('/coupon/check', { couponId })
}