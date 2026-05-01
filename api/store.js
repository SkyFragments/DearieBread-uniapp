/**
 * 门店相关 API
 */

import { get } from './request.js'

/**
 * 获取门店列表
 * @param {number} latitude 用户纬度（可选，用于距离排序）
 * @param {number} longitude 用户经度（可选）
 */
export function getStoreList(latitude, longitude) {
  const params = {}
  if (latitude) params.latitude = latitude
  if (longitude) params.longitude = longitude
  return get('/store/list', params)
}

/**
 * 获取门店详情
 * @param {number} storeId 门店 ID
 */
export function getStoreDetail(storeId) {
  return get(`/store/detail/${storeId}`)
}

/**
 * 获取门店时间槽
 * @param {number} storeId 门店 ID
 * @param {string} date 日期（YYYY-MM-DD）
 */
export function getTimeSlots(storeId, date) {
  return get('/time-slot/list', { storeId, date })
}