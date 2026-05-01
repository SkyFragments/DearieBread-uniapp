/**
 * API 请求封装
 * 基于 uni.request 统一封装请求拦截器
 */

import BASE_URL from './constants.js'

// 请求锁，防止重复请求
const pendingRequests = new Map()

/**
 * 生成请求唯一标识
 */
function generateRequestKey(config) {
  return `${config.method || 'GET'}-${config.url}-${JSON.stringify(config.data || {})}`
}

/**
 * 从 pending 中移除请求
 */
function removePendingKey(config) {
  const key = generateRequestKey(config)
  if (pendingRequests.has(key)) {
    pendingRequests.delete(key)
  }
}

/**
 * 核心请求方法
 * @param {Object} options uni.request 配置
 * @returns {Promise}
 */
function request(options) {
  const {
    url,
    data,
    method = 'GET',
    header = {},
    timeout = 30000,
    ...rest
  } = options

  // 拼接完整 URL
  const fullUrl = url.startsWith('http') ? url : BASE_URL + url

  // 请求唯一标识
  const requestKey = generateRequestKey({ method, url, data })

  // 记录请求
  removePendingKey({ method, url, data })
  pendingRequests.set(requestKey, true)

  // 设置通用 Header
  const authHeader = {}
  const token = uni.getStorageSync('token')
  if (token) {
    authHeader['Authorization'] = `Bearer ${token}`
  }
  authHeader['Content-Type'] = 'application/json'

  return new Promise((resolve, reject) => {
    uni.request({
      url: fullUrl,
      data,
      method,
      header: { ...authHeader, ...header },
      timeout,
      ...rest,
      success: (res) => {
        removePendingKey({ method, url, data })

        const { statusCode, data: responseData } = res

        // HTTP 状态码非 2xx 视为错误
        if (statusCode < 200 || statusCode >= 300) {
          // 处理 401 未授权
          if (statusCode === 401) {
            uni.removeStorageSync('token')
            uni.showToast({ title: '请先登录', icon: 'none' })
            uni.navigateTo({ url: '/pages/login/index' })
          }
          reject(res)
          return
        }

        // 业务错误（后端返回 code !== 0 或 !success）
        if (responseData && responseData.code !== undefined && responseData.code !== 0) {
          uni.showToast({ title: responseData.msg || '请求失败', icon: 'none' })
          reject(responseData)
          return
        }

        resolve(responseData)
      },
      fail: (err) => {
        removePendingKey({ method, url, data })
        uni.showToast({ title: '网络请求失败', icon: 'none' })
        reject(err)
      },
    })
  })
}

/**
 * GET 请求
 */
export function get(url, data, options = {}) {
  return request({ url, data, method: 'GET', ...options })
}

/**
 * POST 请求
 */
export function post(url, data, options = {}) {
  return request({ url, data, method: 'POST', ...options })
}

/**
 * PUT 请求
 */
export function put(url, data, options = {}) {
  return request({ url, data, method: 'PUT', ...options })
}

/**
 * DELETE 请求
 */
export function del(url, data, options = {}) {
  return request({ url, data, method: 'DELETE', ...options })
}

export default request