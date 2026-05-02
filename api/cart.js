/**
 * 购物车相关 API
 */

import { get, post, del } from './request.js'

/**
 * 获取购物车列表
 */
export function getCartList() {
  return get('/cart/list')
}

/**
 * 添加商品到购物车
 * @param {Object} data { productId, quantity, specifications }
 */
export function addToCart(data) {
  return post('/cart/add', data)
}

/**
 * 更新购物车商品数量
 * @param {Object} data { id, quantity }
 */
export function updateCartItem(data) {
  return post('/cart/update', data)
}

/**
 * 删除购物车商品
 * @param {number} cartId 购物车 ID
 */
export function removeFromCart(cartId) {
  return post(`/cart/delete/${cartId}`, {})
}

/**
 * 清空购物车
 */
export function clearCart() {
  return del('/cart/clear')
}

/**
 * 批量更新购物车（勾选状态）
 * @param {Array} data [{ cartId, checked }]
 */
export function batchUpdateCart(data) {
  return post('/cart/batch-update', { items: data })
}