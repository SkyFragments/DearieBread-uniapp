# DearieBread 重构计划：从 Taro 迁移到 UniApp

> **项目**: DearieBread
> **源分支**: DearieBread-taro (Taro/React)
> **目标**: DearieBread-uniapp (UniApp/Vue)
> **计划日期**: 2026-05-02
> **状态**: 接近完成（约95%）
> **最后更新**: 2026-05-02

---

## 一、项目现状分析

### 1.1 功能完成度总览

| 模块 | 完成度 | 说明 |
|------|--------|------|
| 前端 UI/页面 | **100%** | 所有 12 个页面 UI 已搭建 |
| 前端架构 | **95%** | API 层、工具层、公共组件已完成 |
| 后端 API | **92%** | 三层架构完整，19 个 Controller，4,877 行 Service |
| 前后端集成 | **100%** | ✅ 所有页面已对接真实 API |
| 构建能力 | **100%** | ✅ H5 构建成功 |

**综合完成度: ~95%**

> ⚠️ **更新 (2026-05-02 03:30)**: 
> - 添加下拉刷新支持 (onPullDownRefresh) 到所有列表页面
> - 完成 Taro 版本的 API 层建设 (src/api/)
> - 修复 app.json 中 tabbar 图标路径
> - 添加缺失页面到 Taro app.json

### 1.2 前端页面详情

| 页面 | 行数 | 完成度 | 主要问题 |
|------|------|--------|----------|
| 首页 (home) | 160 | 90% | API 已集成，下拉刷新 |
| 商品列表 (productList) | 180 | 90% | API 已集成，下拉刷新 |
| 商品详情 (productDetail) | 165 | 90% | API 已集成，下拉刷新 |
| 购物车 (cart) | 185 | 95% | 状态管理完整，API 已集成 |
| 订单确认 (checkout) | 190 | 95% | API 已集成 |
| 订单追踪 (orderTracking) | 155 | 90% | API 已集成 |
| 会员中心 (member) | 175 | 95% | API 已集成 |
| 我的订单 (myOrders) | 300 | 90% | API 已集成，下拉刷新 |
| 门店列表 (store) | 200 | 90% | API 已集成，下拉刷新 |
| 优惠券中心 (couponCenter) | 210 | 90% | API 已集成，下拉刷新 |
| 收银台 (payment) | 85 | 70% | 微信支付需商户配置 |
| 积分明细 (pointsDetail) | 140 | 90% | API 已集成，下拉刷新 |

### 1.3 后端 API 覆盖

| 端点模块 | Controller | Service | 状态 |
|----------|------------|---------|------|
| 用户/登录 | ✅ | ✅ | 完整 |
| 商品 (列表/详情/热销/低卡) | ✅ | ✅ | 完整 |
| 购物车 | ✅ | ✅ | 完整 |
| 订单 (创建/取消/追踪) | ✅ | ✅ | 完整 |
| 会员 (等级/积分/成长) | ✅ | ✅ | 完整 |
| 优惠券 | ✅ | ✅ | 完整 |
| 门店 | ✅ | ✅ | 完整 |
| 库存锁 (Redis) | ✅ | ✅ | 完整 |
| 微信支付 | ✅ | ✅ | 完整 |
| 定时任务 | ✅ | ✅ | 完整 |

### 1.4 关键问题

1. ~~**CRITICAL**: 前端所有页面使用 hardcoded mock 数据，后端 API 完全未被调用~~ ✅ **已修复 (2026-05-02)**
2. ~~**HIGH**: `npm run build:h5` 构建失败（缺少 `order.png`, `order-active.png` 图标）~~ ✅ **已修复**
3. ~~**HIGH**: 缺少 `src/api/` API 客户端层~~ ✅ **已修复 (Taro 版本)**
4. ~~**HIGH**: 缺少 `src/utils/` 工具函数层~~ ✅ **已修复 (UniApp 版本)**
5. **MEDIUM**: 收银台 (payment) 微信支付需要商户号配置

---

## 二、重构目标

### 2.1 最终目标

将 DearieBread 小程序从 **Taro + React** 技术栈重构为 **UniApp + Vue** 技术栈，继承 Taro 版本的所有 UI 和业务逻辑。

### 2.2 重构范围

```
范围：仅限前端（pages、components、api、utils）
排除：后端 Java 代码（server/）保持不变
```

### 2.3 核心原则

1. **保持 UI 一致** — 所有页面视觉保持和 Taro 版本一致
2. **保持 API 接口不变** — 复用现有后端 API
3. **渐进式重构** — 一个页面一个页面迁移，不追求一步到位
4. **先跑通再优化** — 每迁移一个页面，对接真实 API

---

## 三、技术对比

| 维度 | Taro (当前) | UniApp (目标) |
|------|-------------|---------------|
| 框架 | React 18 | Vue 3 (Composition API) |
| 语法 | JSX + TypeScript | SFC `<template>` + `<script setup>` |
| 状态管理 | React hooks (useState/useReducer) | Vue reactivity (ref/reactive) + Pinia |
| 路由 | 文件系统路由 (`pages/xxx/index.tsx`) | 文件系统路由 (`pages/xxx/index.vue`) |
| 组件写法 | 函数组件 + hooks | SFC + Composition API |
| 条件渲染 | `{ condition && <Component /> }` | `v-if="condition"` |
| 列表渲染 | `{ list.map(item => ...) }` | `v-for="item in list"` |
| 样式 | Tailwind CSS | SCSS / CSS |
| 网络请求 | Taro.request | uni.request |
| 存储 | Taro.getStorageSync | uni.getStorageSync |
| 页面跳转 | Taro.navigateTo / switchTab | uni.navigateTo / switchTab |
| 生命周期 | React hooks (useEffect) | Vue lifecycle (onMounted) |

---

## 四、重构计划

### 阶段 1：基础搭建（预计 2-3 天）

#### 1.1 环境与项目结构

- [ ] 确认 DearieBread-uniapp 仓库初始化完成
- [ ] 配置 UniApp 项目（manifest.json、pages.json）
- [ ] 迁移 `app.json` → `pages.json`（页面路由配置）
- [ ] 迁移 Taro `tailwind.config.js` → UniApp `uni.scss`（全局样式变量）
- [ ] 创建 `static/` 目录结构（images、tabbar 等）

#### 1.2 公共组件迁移

| 组件 | Taro 文件 | UniApp 文件 | 优先级 |
|------|-----------|-------------|--------|
| BottomTabBar | `src/components/common/BottomTabBar.tsx` | `components/bottomTabBar.vue` | P0 |
| Navbar | `src/components/common/Navbar.tsx` | `components/navbar.vue` | P1 |
| ProductCard | `src/components/common/ProductCard.tsx` | `components/productCard.vue` | P1 |

#### 1.3 API 层建立

- [ ] 创建 `api/request.js` — 封装 `uni.request`，统一拦截器（请求/响应）
- [ ] 创建 `api/constants.js` — 后端 API 地址配置
- [ ] 逐个创建 API 模块（与后端 Controller 对应）：
  - `api/user.js` — 登录、用户信息
  - `api/product.js` — 商品列表、详情、热销、低卡
  - `api/cart.js` — 购物车 CRUD
  - `api/order.js` — 订单创建/取消/列表/追踪
  - `api/member.js` — 会员信息、积分、成长值
  - `api/coupon.js` — 优惠券列表、领取
  - `api/store.js` — 门店列表

#### 1.4 工具函数层

- [ ] 创建 `utils/storage.js` — 封装 uni.getStorageSync/setStorage/removeStorage
- [ ] 创建 `utils/auth.js` — 登录态判断、Token 注入
- [ ] 创建 `utils/counter.js` — 格式化工具（金额、日期）

---

### 阶段 2：页面迁移（预计 5-7 天）

> 按优先级排序，从核心购物流程开始

#### P0 核心页面（购物必备）

| 序号 | 页面 | Taro 路由 | UniApp 路由 | 说明 |
|------|------|-----------|-------------|------|
| 1 | 首页 | `pages/home/index` | `pages/home/index` | Banner、快捷入口、热销榜、低卡专区 |
| 2 | 商品列表 | `pages/productList/index` | `pages/productList/index` | 分类筛选、低卡筛选、排序、商品卡片 |
| 3 | 商品详情 | `pages/productDetail/index` | `pages/productDetail/index` | 营养标签、加购/立即购买 |
| 4 | 购物车 | `pages/cart/index` | `pages/cart/index` | 数量调整、优惠券、结算入口 |
| 5 | 订单确认 | `pages/checkout/index` | `pages/checkout/index` | 门店选择、取餐时间、支付 |
| 6 | 订单追踪 | `pages/orderTracking/index` | `pages/orderTracking/index` | 状态进度条、取餐码 |

#### P1 辅助页面（完善体验）

| 序号 | 页面 | Taro 路由 | UniApp 路由 | 说明 |
|------|------|-----------|-------------|------|
| 7 | 会员中心 | `pages/member/index` | `pages/member/index` | 会员等级、积分、营养档案 |
| 8 | 我的订单 | `pages/myOrders/index` | `pages/myOrders/index` | Tab 切换（全部/待付/待取） |
| 9 | 门店列表 | `pages/store/index` | `pages/store/index` | 门店信息、距离、营业时间 |
| 10 | 优惠券中心 | `pages/couponCenter/index` | `pages/couponCenter/index` | 可领/已用/已失效 |

#### P2 扩展页面（优先级低）

| 序号 | 页面 | Taro 路由 | UniApp 路由 | 说明 |
|------|------|-----------|-------------|------|
| 11 | 收银台 | `pages/payment/index` | `pages/payment/index` | 微信支付 |
| 12 | 积分明细 | `pages/pointsDetail/index` | `pages/pointsDetail/index` | 积分记录 |

---

### 阶段 3：集成与优化（预计 2-3 天）

- [ ] 前后端 API 对接 — 每个页面逐个对接真实 API
- [ ] 构建优化 — 修复 H5 构建问题
- [ ] 平台适配 — 确保小程序和 H5 均可正常运行
- [ ] 遗留问题修复 — mock 数据清除、placeholder 代码清理

---

## 五、页面迁移规范

### 5.1 目录结构（UniApp）

```
DearieBread-uniapp/
├── pages/                  # 页面
│   ├── home/index.vue
│   ├── productList/index.vue
│   ├── productDetail/index.vue
│   ├── cart/index.vue
│   ├── checkout/index.vue
│   ├── orderTracking/index.vue
│   ├── member/index.vue
│   ├── myOrders/index.vue
│   ├── store/index.vue
│   ├── couponCenter/index.vue
│   ├── payment/index.vue
│   └── pointsDetail/index.vue
├── components/             # 公共组件
│   ├── bottomTabBar.vue
│   ├── navbar.vue
│   ├── productCard.vue
│   ├── loading.vue
│   ├── empty.vue
│   └── toast.vue
├── api/                    # API 客户端层
│   ├── request.js          # uni.request 封装
│   ├── constants.js         # API 地址配置
│   ├── user.js
│   ├── product.js
│   ├── cart.js
│   ├── order.js
│   ├── member.js
│   ├── coupon.js
│   └── store.js
├── utils/                  # 工具函数
│   ├── storage.js
│   ├── auth.js
│   └── format.js
├── static/                 # 静态资源
│   ├── images/
│   └── tabbar/             # tabbar 图标（.png 格式）
├── App.vue
├── main.js
├── manifest.json
├── pages.json
└── uni.scss                # 全局样式变量
```

### 5.2 样式迁移对照

| Taro (CSS/Tailwind) | UniApp (SCSS) |
|---------------------|---------------|
| `className="flex items-center"` | `class="flex items-center"` |
| `className="text-primary"` | 需在 `uni.scss` 定义 `.text-primary` |
| 内联 style `{ width: '100px' }` | `:style="{ width: '100px' }"` |
| `style={{ backgroundColor: '#FFF' }}` | `:style="{ backgroundColor: '#FFF' }"` |

### 5.3 生命周期对照

| Taro (React) | UniApp (Vue) |
|--------------|---------------|
| `useEffect(() => { ... }, [])` | `onMounted(() => { ... })` |
| `useEffect(() => { ... }, [dep])` | `watch(() => dep, () => { ... })` |
| `useState(value)` | `const value = ref(initial)` |
| `useReducer(reducer, init)` | `const state = reactive({})` |
| `useCallback(fn, deps)` | `const fn = () => { ... }` (Vue3 不需要手动缓存) |

### 5.4 API 调用对照

```js
// Taro
import Taro from '@tarojs/taro'
const res = await Taro.request({ url, data, method: 'GET' })

// UniApp
const res = await uni.request({ url, data, method: 'GET' })
```

```js
// Taro 页面跳转
Taro.navigateTo({ url: '/pages/productDetail/index?id=123' })
Taro.switchTab({ url: '/pages/cart/index' })
Taro.getStorageSync('token')

// UniApp 页面跳转
uni.navigateTo({ url: '/pages/productDetail/index?id=123' })
uni.switchTab({ url: '/pages/cart/index' })
uni.getStorageSync('token')
```

---

## 六、风险与应对

| 风险 | 级别 | 应对措施 |
|------|------|----------|
| Taro mock 数据结构与后端 API 返回不一致 | HIGH | 阶段一先建立 API 层，阶段二逐个对接验证 |
| Tailwind CSS 迁移为 SCSS 工作量大 | MEDIUM | 优先迁移核心样式变量，组件样式逐步迁移 |
| Vue 与 React 响应式思维差异导致 bug | MEDIUM | 每个页面迁移后进行功能验证 |
| UniApp 编译时图标问题（.png 格式要求） | LOW | 统一将图片转为 .png 并使用 `static/` 目录 |
| 网络请求拦截器逻辑不一致 | LOW | API 层统一封装，参考 Taro interceptor 逻辑 |

---

## 七、里程碑

| 里程碑 | 内容 | 目标时间 |
|--------|------|----------|
| M1 | 阶段1完成（API层、工具层、公共组件） | 第 1 周 |
| M2 | 首页、商品列表、商品详情 三个页面完成并对接 API | 第 2 周 |
| M3 | 购物车、订单确认、订单追踪完成并对接 API | 第 2-3 周 |
| M4 | 会员中心、我的订单、门店、优惠券 完成 | 第 3-4 周 |
| M5 | 收银台、积分明细 + 遗留问题修复 + 优化 | 第 4-5 周 |

---

## 八、验收标准

### 8.1 功能验收

- [ ] 所有 12 个页面均已迁移并 UI 对齐
- [ ] 所有页面均调用真实后端 API（无 mock 数据）
- [ ] 购物流程完整跑通：浏览 → 加购 → 下单 → 支付 → 追踪
- [ ] 会员中心数据正确展示（等级/积分/成长值）
- [ ] 小程序端和 H5 端均能正常运行

### 8.2 技术验收

- [ ] `npm run build:h5` 构建成功
- [ ] `uni-app` 开发模式正常热更新
- [ ] 代码无明显内存泄漏
- [ ] 页面切换流畅，无白屏

### 8.3 交付物

- [ ] DearieBread-uniapp 仓库代码完整提交
- [ ] 本文档更新为最终版（状态改为"已完成"）
- [ ] 简要的重构总结文档

---

## 九、附录

### A. 后端 API 端点参考

详见 `server/API.md`，核心端点：

| 端点 | 方法 | 说明 |
|------|------|------|
| `/api/user/login` | POST | 微信登录 |
| `/api/user/info` | GET | 用户信息 |
| `/api/product/list` | GET | 商品列表 |
| `/api/product/detail/{id}` | GET | 商品详情 |
| `/api/product/hot` | GET | 热销商品 |
| `/api/product/low-calorie` | GET | 低卡商品 |
| `/api/cart/list` | GET | 购物车列表 |
| `/api/cart/add` | POST | 添加购物车 |
| `/api/cart/update` | PUT | 更新购物车 |
| `/api/cart/remove` | DELETE | 删除购物车 |
| `/api/order/create` | POST | 创建订单 |
| `/api/order/list` | GET | 订单列表 |
| `/api/order/detail/{id}` | GET | 订单详情 |
| `/api/order/cancel/{id}` | POST | 取消订单 |
| `/api/member/info` | GET | 会员信息 |
| `/api/member/points` | GET | 积分明细 |
| `/api/member/growth` | GET | 成长值明细 |
| `/api/coupon/list` | GET | 优惠券列表 |
| `/api/coupon/receive` | POST | 领取优惠券 |
| `/api/store/list` | GET | 门店列表 |
| `/api/store/detail/{id}` | GET | 门店详情 |

### B. 联系方式

- **后端维护**: 参考 `server/ARCHITECTURE.md`
- **前端问题**: 参考 `UI-SPEC.md`

---

> **下次行动**: 阶段1（基础搭建）建议从创建 `api/request.js` 和 `pages.json` 页面路由配置开始，这两项工作可以并行推进。