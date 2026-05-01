/**
 * 商品相关 API
 */

import { get } from './request.js'

/**
 * 获取商品列表
 * @param {Object} params { categoryId, keyword, lowCalorie, sort, page, limit }
 */
export function getProductList(params = {}) {
  return get('/product/list', params)
}

/**
 * 获取商品详情
 * @param {number} id 商品 ID
 */
export function getProductDetail(id) {
  return get(`/product/detail/${id}`)
}

/**
 * 获取热销商品
 */
export function getHotProducts() {
  return get('/product/hot')
}

/**
 * 获取低卡商品
 * @param {Object} params { page, limit }
 */
export function getLowCalorieProducts(params = {}) {
  return get('/product/low-calorie', params)
}

/**
 * 获取商品分类
 */
export function getCategories() {
  return get('/category/list')
}

/**
 * 获取套餐列表
 */
export function getPackages() {
  return get('/product/packages')
}