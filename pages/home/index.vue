<template>
  <view class="page">
    <navbar title="Dearie Bread" rightContent="会员入口" />

    <!-- 搜索框 -->
    <view class="search-bar">
      <view class="search-input">
        <text class="search-icon">🔍</text>
        <text class="search-placeholder">搜索面包、甜点...</text>
      </view>
    </view>

    <!-- 快捷入口 -->
    <view class="quick-entries">
      <view
        v-for="entry in quickEntries"
        :key="entry.id"
        class="entry-item"
        @click="onEntryClick(entry)"
      >
        <view class="entry-icon">
          <text>{{ entry.icon }}</text>
        </view>
        <text class="entry-name">{{ entry.name }}</text>
      </view>
    </view>

    <!-- 分类图标 -->
    <view class="category-section">
      <view class="category-list">
        <view
          v-for="cat in categoryIcons"
          :key="cat.id"
          class="category-item"
          @click="onCategoryClick(cat)"
        >
          <view class="category-icon">
            <text>{{ cat.icon }}</text>
          </view>
          <text class="category-name">{{ cat.name }}</text>
        </view>
      </view>
    </view>

    <!-- Banner 轮播 -->
    <view class="banner-section">
      <swiper class="banner-swiper" :autoplay="true" :interval="3000" :circular="true" indicator-dots>
        <swiper-item v-for="banner in banners" :key="banner.id">
          <view class="banner-item">
            <image class="banner-image" :src="banner.image" mode="aspectFill" />
          </view>
        </swiper-item>
      </swiper>
    </view>

    <!-- 热销榜单 -->
    <view class="section">
      <view class="section-header">
        <text class="section-icon">🥇</text>
        <text class="section-title">热销榜单</text>
      </view>
      <view class="product-grid">
        <view
          v-for="product in hotProducts"
          :key="product.id"
          class="product-item"
          @click="goToProductDetail(product.id)"
        >
          <image class="product-image" :src="product.image" mode="aspectFill" />
          <view class="product-info">
            <text class="product-name">{{ product.name }}</text>
            <view class="product-price-row">
              <text class="product-price">¥{{ product.price }}</text>
              <text v-if="product.originalPrice" class="product-original-price">¥{{ product.originalPrice }}</text>
            </view>
            <view class="product-tags">
              <text v-for="tag in product.tags" :key="tag" class="product-tag">{{ tag }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 低卡专区 -->
    <view class="section">
      <view class="section-header">
        <text class="section-icon">🥗</text>
        <text class="section-title">低卡专区</text>
        <text class="section-more" @click="goToProductList('low-calorie')">查看全部 →</text>
      </view>
      <view class="product-grid">
        <view
          v-for="product in lowCalProducts"
          :key="product.id"
          class="product-item"
          @click="goToProductDetail(product.id)"
        >
          <image class="product-image" :src="product.image" mode="aspectFill" />
          <view class="product-info">
            <text class="product-name">{{ product.name }}</text>
            <text class="product-price">¥{{ product.price }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部留白 -->
    <view class="bottom-space"></view>
  </view>
</template>

<script setup>
import { ref, onMounted, onPullDownRefresh } from 'vue'
import navbar from '@/components/navbar.vue'
import { getHotProducts, getLowCalorieProducts } from '@/api/product.js'

// 快捷入口数据
const quickEntries = [
  { id: 1, name: '今日预订', icon: '📅', path: '/pages/checkout/index' },
  { id: 2, name: '会员中心', icon: '👤', path: '/pages/member/index' },
  { id: 3, name: '门店', icon: '🏪', path: '/pages/store/index' },
  { id: 4, name: '我的订单', icon: '📋', path: '/pages/myOrders/index' },
]

// 分类数据
const categoryIcons = [
  { id: 1, name: '吐司', icon: '🍞', path: '/pages/productList/index?category=toast' },
  { id: 2, name: '甜点', icon: '🧁', path: '/pages/productList/index?category=dessert' },
  { id: 3, name: '饮品', icon: '🥤', path: '/pages/productList/index?category=drink' },
  { id: 4, name: '礼盒', icon: '🎁', path: '/pages/productList/index?category=gift' },
]

// Banner 数据（待替换为真实图片）
const banners = ref([
  { id: 1, image: '/static/images/banner1.png', title: '新品上市' },
  { id: 2, image: '/static/images/banner2.png', title: '会员专享' },
  { id: 3, image: '/static/images/banner3.png', title: '满减优惠' },
])

// 热销商品
const hotProducts = ref([])

// 低卡商品
const lowCalProducts = ref([])

// 加载状态
const isLoading = ref(false)

// 获取真实 API 数据
async function loadHomeData() {
  isLoading.value = true
  try {
    const [hotRes, lowCalRes] = await Promise.all([
      getHotProducts(),
      getLowCalorieProducts(),
    ])
    if (hotRes.code === 0) {
      hotProducts.value = hotRes.data || []
    }
    if (lowCalRes.code === 0) {
      lowCalProducts.value = lowCalRes.data || []
    }
  } catch (e) {
    hotProducts.value = [
      { id: 1, name: '手撕包', price: 28, originalPrice: 35, image: '/static/images/product1.png', tags: ['low-carb'] },
      { id: 2, name: '全麦吐司', price: 22, image: '/static/images/product2.png', tags: ['whole-grain', 'high-protein'] },
      { id: 3, name: '奶油泡芙', price: 18, image: '/static/images/product3.png', tags: ['sugar-free'] },
      { id: 4, name: '坚果面包', price: 25, image: '/static/images/product4.png', tags: ['high-protein'] },
    ]
    lowCalProducts.value = [
      { id: 5, name: '无糖曲奇', price: 32, image: '/static/images/product5.png', tags: ['sugar-free', 'low-carb'] },
      { id: 6, name: '燕麦面包', price: 26, image: '/static/images/product6.png', tags: ['whole-grain', 'low-carb'] },
      { id: 7, name: '黑麦吐司', price: 24, image: '/static/images/product7.png', tags: ['whole-grain', 'high-protein'] },
      { id: 8, name: '蛋白棒', price: 35, image: '/static/images/product8.png', tags: ['high-protein', 'low-carb'] },
    ]
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadHomeData()
})

// 下拉刷新
onPullDownRefresh(() => {
  loadHomeData().finally(() => {
    uni.stopPullDownRefresh()
  })
})

function onEntryClick(entry) {
  if (entry.path) {
    uni.switchTab({ url: entry.path })
  }
}

function onCategoryClick(cat) {
  if (cat.path) {
    uni.navigateTo({ url: cat.path })
  }
}

function goToProductDetail(id) {
  uni.navigateTo({ url: `/pages/productDetail/index?id=${id}` })
}

function goToProductList(filter) {
  const url = filter ? `/pages/productList/index?filter=${filter}` : '/pages/productList/index'
  uni.navigateTo({ url })
}
</script>

<style lang="scss" scoped>
@import '@/uni.scss';

.page {
  min-height: 100vh;
  background-color: $color-background;
  padding-bottom: calc(50px + env(safe-area-inset-bottom));
}

.search-bar {
  padding: $spacing-md $spacing-page;
}

.search-input {
  display: flex;
  align-items: center;
  background-color: $color-gray-200;
  border-radius: $border-radius-button;
  padding: 8px 12px;
}

.search-icon {
  margin-right: 8px;
  font-size: 14px;
}

.search-placeholder {
  color: $color-gray-500;
  font-size: 14px;
}

// 快捷入口
.quick-entries {
  display: flex;
  justify-content: space-around;
  padding: $spacing-md $spacing-page;
}

.entry-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.entry-icon {
  width: 56px;
  height: 56px;
  background-color: $color-highlight;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.entry-name {
  font-size: 12px;
  color: $color-text-primary;
}

// 分类区域
.category-section {
  padding: 0 $spacing-page;
}

.category-list {
  display: flex;
  justify-content: space-around;
  background-color: $color-white;
  border-radius: $border-radius-card;
  padding: $spacing-lg 0;
}

.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.category-icon {
  width: 48px;
  height: 48px;
  background-color: $color-secondary;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.category-name {
  font-size: 12px;
  color: $color-text-primary;
}

// Banner 区域
.banner-section {
  padding: $spacing-md $spacing-page;
}

.banner-swiper {
  height: 160px;
  border-radius: $border-radius-card;
  overflow: hidden;
}

.banner-item {
  width: 100%;
  height: 100%;
}

.banner-image {
  width: 100%;
  height: 160px;
}

// 商品区块
.section {
  padding: $spacing-lg $spacing-page;
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: $spacing-md;
}

.section-icon {
  font-size: 16px;
  margin-right: 8px;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  color: $color-text-primary;
}

.section-more {
  margin-left: auto;
  font-size: 14px;
  color: $color-primary;
}

// 商品网格
.product-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: $spacing-md;
}

.product-item {
  background-color: $color-white;
  border-radius: $border-radius-card;
  overflow: hidden;
}

.product-image {
  width: 100%;
  height: 120px;
}

.product-info {
  padding: $spacing-sm;
}

.product-name {
  font-size: 14px;
  color: $color-text-primary;
  display: block;
  margin-bottom: 4px;
}

.product-price-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.product-price {
  font-size: 16px;
  font-weight: bold;
  color: $color-primary;
}

.product-original-price {
  font-size: 12px;
  color: $color-gray-500;
  text-decoration: line-through;
}

.product-tags {
  display: flex;
  gap: 4px;
  margin-top: 4px;
}

.product-tag {
  font-size: 10px;
  padding: 2px 6px;
  background-color: $color-secondary;
  border-radius: $border-radius-tag;
  color: $color-text-primary;
}

.bottom-space {
  height: 20px;
}
</style>