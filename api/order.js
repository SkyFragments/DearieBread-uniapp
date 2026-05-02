/**
 * 订单相关 API
 */

import { get, post } from './request.js'

/**
 * 创建订单
 * @param {Object} data { storeId, items, deliveryType, pickupTime,remark }
 */
export function createOrder(data) {
  return post('/order/create', data)
}

/**
 * 获取订单列表
 * @param {string} status 订单状态筛选（可选）
 */
export function getOrderList(status) {
  const params = status ? { status } : {}
  return get('/order/list', params)
}

/**
 * 获取订单详情
 * @param {number} orderId 订单 ID
 */
export function getOrderDetail(orderId) {
  return get(`/order/detail/${orderId}`)
}

/**
 * 取消订单
 * @param {number} orderId 订单 ID
 * @param {string} reason 取消原因
 */
export function cancelOrder(orderId, reason) {
  return post(`/order/cancel/${orderId}`, { reason })
}

/**
 * 确认收货
 * @param {number} orderId 订单 ID
 */
export function confirmReceipt(orderId) {
  return post(`/order/confirm/${orderId}`)
}

/**
 * 获取取餐码
 * @param {number} orderId 订单 ID
 */
export function getPickupCode(orderId) {
  return get(`/order/pickup-code/${orderId}`)
}

/**
 * 催单
 * @param {number} orderId 订单 ID
 */
export function remindOrder(orderId) {
  return post(`/order/remind/${orderId}`)
}

/**
 * 发起支付
 * @param {string} orderId 订单 ID
 * @param {string} openId 微信 openId
 */
export function createPayment(orderId, openId) {
  return post('/pay/create', { orderId, openId })
}