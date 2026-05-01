/**
 * API 基础配置
 * 后端 API 地址配置，根据环境切换
 */

// 开发环境（本地后端）
const DEV_BASE_URL = 'http://localhost:8080/api'

// 生产环境（需要替换为实际域名）
const PROD_BASE_URL = 'https://api.deariebread.com/api'

// 当前环境
const BASE_URL = DEV_BASE_URL

export default BASE_URL