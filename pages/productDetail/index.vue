<template>
  <view class="page">
    <navbar title="商品详情" :showBack="true" @back="handleBack">
      <template #right>
        <view class="navbar-actions">
          <text>📤</text>
          <text>❤️</text>
        </view>
      </template>
    </navbar>

    <scroll-view scroll-y class="content-scroll">
      <!-- 商品图片 -->
      <view class="image-section">
        <image class="product-image" :src="productData.image" mode="aspectFill" />
        <view class="image-dots">
          <view
            v-for="i in 4"
            :key="i"
            class="dot"
            :class="{ active: i === 1 }"
          />
        </view>
      </view>

      <!-- 价格区域 -->
      <view class="card price-card">
        <view class="price-row">
          <text class="current-price">¥{{ productData.price }}</text>
          <text v-if="productData.originalPrice" class="original-price">¥{{ productData.originalPrice }}</text>
        </view>
        <view class="tag-row">
          <text
            v-for="tag in productData.tags"
            :key="tag"
            class="tag"
            :class="tagClass(tag)"
          >{{ tagLabel(tag) }}</text>
        </view>
      </view>

      <!-- 商品名称 -->
      <view class="card">
        <text class="product-name">{{ productData.name }}</text>
        <text class="product-subtitle">每100g / 每个(约80g) 热量: {{ productData.calories || 150 }}kcal</text>
      </view>

      <!-- 营养成分表 -->
      <view class="card">
        <text class="card-title">营养成分</text>
        <view class="nutrition-table">
          <view class="table-header">
            <text class="col">营养成分</text>
            <text class="col">每100g</text>
            <text class="col">每个</text>
          </view>
          <view
            v-for="(item, index) in nutritionData"
            :key="item.label"
            class="table-row"
            :class="{ odd: index % 2 === 0 }"
          >
            <text class="col">{{ item.label }}</text>
            <text class="col">{{ item.per100g }}</text>
            <text class="col">{{ item.perUnit }}</text>
          </view>
        </view>
      </view>

      <!-- 配料表 -->
      <view class="card">
        <text class="card-title">配料表</text>
        <text class="ingredients-text">{{ productData.ingredients || '面粉、黄油、牛奶、鸡蛋、糖、酵母、盐' }}</text>
      </view>

      <!-- 库存与销量 -->
      <view class="card stock-row">
        <text class="stock-text">库存：剩余 {{ productData.stock || 15 }} 个</text>
        <text class="sales-text">月销：{{ productData.sales || 328 }}</text>
      </view>

      <!-- 数量选择 -->
      <view class="card quantity-row">
        <text class="quantity-label">已选：{{ quantity }}个</text>
        <view class="quantity-control">
          <text class="qty-btn" @click="decreaseQty">-</text>
          <text class="qty-value">{{ quantity }}</text>
          <text class="qty-btn" @click="increaseQty">+</text>
        </view>
      </view>

      <!-- 操作按钮 -->
      <view class="action-buttons">
        <view class="btn-add-cart" @click="onAddCart">加入购物车</view>
        <view class="btn-buy-now" @click="onBuyNow">立即购买</view>
      </view>

      <!-- 相似推荐 -->
      <view class="similar-section">
        <text class="card-title">相似推荐</text>
        <scroll-view scroll-x class="similar-scroll">
          <view
            v-for="item in similarProducts"
            :key="item.id"
            class="similar-item"
            @click="goToProductDetail(item.id)"
          >
            <product-card
              :name="item.name"
              :price="item.price"
              :image="item.image"
              :tags="item.tags"
            />
          </view>
        </scroll-view>
      </view>

      <view class="bottom-space"></view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import navbar from '@/components/navbar.vue'
import productCard from '@/components/productCard.vue'
import { getProductDetail } from '@/api/product.js'
import { addToCart } from '@/api/cart.js'

// 获取页面参数
const pageOptions = uni.getPageOptions()
const productId = pageOptions?.id || 1

// 商品数据
const productData = ref({
  id: productId,
  name: '原味手撕包',
  price: 28,
  originalPrice: 35,
  image: '/static/images/product1.png',
  tags: ['low-carb', 'high-protein', 'whole-grain'],
  calories: 150,
  stock: 15,
  sales: 328,
  ingredients: '面粉、黄油、牛奶、鸡蛋、糖、酵母、盐',
})

// 加载状态
const isLoading = ref(false)

// 获取真实 API 数据
onMounted(async () => {
  isLoading.value = true
  try {
    const res = await getProductDetail(productId)
    if (res.code === 0 && res.data) {
      productData.value = res.data
    }
  } catch (e) {
    // 使用默认数据
  } finally {
    isLoading.value = false
  }
})

// 数量
const quantity = ref(1)

// 营养成分数据
const nutritionData = [
  { label: '热量', per100g: '250kcal', perUnit: '200kcal' },
  { label: '蛋白质', per100g: '8g', perUnit: '6.4g' },
  { label: '碳水化合物', per100g: '35g', perUnit: '28g' },
  { label: '脂肪', per100g: '9g', perUnit: '7.2g' },
  { label: '糖分', per100g: '5g', perUnit: '4g' },
  { label: '膳食纤维', per100g: '3g', perUnit: '2.4g' },
]

// 相似商品
const similarProducts = ref([
  { id: 1, name: '手撕包', price: 28, image: '/static/images/product1.png', tags: ['low-carb'] },
  { id: 2, name: '全麦吐司', price: 22, image: '/static/images/product2.png', tags: ['whole-grain'] },
  { id: 3, name: '奶油泡芙', price: 18, image: '/static/images/product3.png', tags: ['sugar-free'] },
])

// 标签映射
const tagLabels = {
  'low-carb': '低卡',
  'sugar-free': '无糖',
  'whole-grain': '全麦',
  'high-protein': '高蛋白',
  'gluten-free': '无麸质',
}

const tagColors = {
  'low-carb': 'primary',
  'sugar-free': 'warning',
  'whole-grain': 'accent',
  'high-protein': 'success',
  'gluten-free': 'purple',
}

function tagLabel(tag) {
  return tagLabels[tag] || tag
}

function tagClass(tag) {
  return `tag-${tagColors[tag] || 'primary'}`
}

function decreaseQty() {
  if (quantity.value > 1) {
    quantity.value--
  }
}

function increaseQty() {
  quantity.value++
}

function handleBack() {
  uni.navigateBack()
}

function goToProductDetail(id) {
  uni.redirectTo({ url: `/pages/productDetail/index?id=${id}` })
}

async function onAddCart() {
  try {
    await addToCart({ productId: productId, quantity: quantity.value })
    uni.showToast({ title: '已加入购物车', icon: 'success' })
  } catch (e) {
    // mock 模式
    uni.showToast({ title: '已加入购物车', icon: 'success' })
  }
}

function onBuyNow() {
  // TODO: 直接跳转结算页
  uni.showToast({ title: '立即购买功能开发中', icon: 'none' })
}
</script>

<style lang="scss" scoped>
@import '@/uni.scss';

.page {
  min-height: 100vh;
  background-color: $color-background;
  display: flex;
  flex-direction: column;
}

.navbar-actions {
  display: flex;
  gap: 12px;
}

.content-scroll {
  flex: 1;
  height: calc(100vh - 44px - env(safe-area-inset-bottom));
}

.card {
  background-color: $color-white;
  margin: $spacing-md $spacing-page;
  padding: $spacing-md;
  border-radius: $border-radius-card;
}

.card-title {
  font-size: 14px;
  font-weight: bold;
  color: $color-text-primary;
  display: block;
  margin-bottom: $spacing-sm;
}

// 图片区域
.image-section {
  background-color: $color-white;
}

.product-image {
  width: 100%;
  height: 320px;
}

.image-dots {
  display: flex;
  justify-content: center;
  gap: 8px;
  padding: $spacing-sm 0;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: $color-gray-300;

  &.active {
    background-color: $color-primary;
  }
}

// 价格卡片
.price-card {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
}

.price-row {
  display: flex;
  align-items: baseline;
  gap: $spacing-sm;
}

.current-price {
  font-size: 24px;
  font-weight: bold;
  color: $color-primary;
}

.original-price {
  font-size: 14px;
  color: $color-gray-500;
  text-decoration: line-through;
}

.tag-row {
  display: flex;
  gap: $spacing-sm;
  flex-wrap: wrap;
}

.tag {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: $border-radius-tag;
  color: $color-white;
}

.tag-primary { background-color: $color-primary; }
.tag-warning { background-color: $color-warning; }
.tag-accent { background-color: $color-accent; }
.tag-success { background-color: $color-success; }
.tag-purple { background-color: $color-purple; }

// 商品名称
.product-name {
  font-size: 16px;
  font-weight: bold;
  color: $color-text-primary;
  display: block;
  margin-bottom: 4px;
}

.product-subtitle {
  font-size: 12px;
  color: $color-gray-500;
}

// 营养成分表
.nutrition-table {
  border: 1px solid $color-gray-300;
  border-radius: $border-radius-input;
  overflow: hidden;
}

.table-header,
.table-row {
  display: flex;
}

.table-header {
  background-color: $color-gray-200;
}

.table-row.odd {
  background-color: $color-white;
}

.col {
  flex: 1;
  text-align: center;
  font-size: 12px;
  color: $color-text-primary;
  padding: 8px 0;
}

// 配料表
.ingredients-text {
  font-size: 12px;
  color: $color-gray-600;
  line-height: 1.6;
}

// 库存与销量
.stock-row {
  display: flex;
  justify-content: space-between;
}

.stock-text,
.sales-text {
  font-size: 12px;
  color: $color-gray-500;
}

// 数量选择
.quantity-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.quantity-label {
  font-size: 14px;
  color: $color-text-primary;
}

.quantity-control {
  display: flex;
  align-items: center;
  gap: $spacing-md;
}

.qty-btn {
  width: 32px;
  height: 32px;
  background-color: $color-secondary;
  text-align: center;
  line-height: 32px;
  border-radius: $border-radius-button;
  font-size: 16px;
}

.qty-value {
  font-size: 16px;
  font-weight: 500;
  width: 32px;
  text-align: center;
}

// 操作按钮
.action-buttons {
  display: flex;
  gap: $spacing-md;
  padding: $spacing-md $spacing-page;
  background-color: $color-white;
  margin-top: $spacing-md;
}

.btn-add-cart,
.btn-buy-now {
  flex: 1;
  text-align: center;
  padding: 12px 0;
  border-radius: $border-radius-button;
  font-size: 14px;
  font-weight: 500;
}

.btn-add-cart {
  background-color: $color-white;
  border: 2px solid $color-primary;
  color: $color-primary;
}

.btn-buy-now {
  background-color: $color-primary;
  color: $color-white;
}

// 相似推荐
.similar-section {
  padding: $spacing-md $spacing-page;
}

.similar-scroll {
  display: flex;
  gap: $spacing-md;
  margin-top: $spacing-sm;
  white-space: nowrap;
}

.similar-item {
  width: 160px;
  flex-shrink: 0;
}

.bottom-space {
  height: 40px;
}
</style>