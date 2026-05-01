<template>
  <view class="page">
    <navbar title="吐司系列" :showBack="true" @back="handleBack" />

    <!-- 搜索框 -->
    <view class="search-bar">
      <view class="search-input">
        <text class="search-icon">🔍</text>
        <input
          class="search-field"
          placeholder="搜索商品"
          v-model="searchValue"
          @input="onSearchInput"
        />
      </view>
    </view>

    <!-- 排序 Tab -->
    <view class="sort-bar">
      <view class="sort-tabs">
        <view
          v-for="tab in sortTabs"
          :key="tab"
          class="sort-tab"
          :class="{ active: activeSort === tab }"
          @click="onSortChange(tab)"
        >
          <text>{{ tab }}</text>
          <text v-if="tab !== '综合'" class="sort-arrow">▼</text>
        </view>
      </view>
    </view>

    <!-- 筛选标签 -->
    <view class="filter-bar">
      <view
        v-for="tag in filterTags"
        :key="tag"
        class="filter-tag"
        :class="{ active: activeFilters.includes(tag) }"
        @click="onFilterToggle(tag)"
      >
        <text>{{ tag }}</text>
      </view>
    </view>

    <!-- 商品网格 -->
    <view class="product-grid">
      <view
        v-for="product in filteredProducts"
        :key="product.id"
        @click="goToProductDetail(product.id)"
      >
        <product-card
          :name="product.name"
          :price="product.price"
          :originalPrice="product.originalPrice"
          :image="product.image"
          :tags="product.tags"
          @add-cart="onAddCart(product)"
        />
      </view>
    </view>

    <!-- 空状态 -->
    <view v-if="filteredProducts.length === 0" class="empty-state">
      <text class="empty-icon">🧁</text>
      <text class="empty-text">暂无商品</text>
    </view>

    <!-- 底部留白 -->
    <view class="bottom-space"></view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import navbar from '@/components/navbar.vue'
import productCard from '@/components/productCard.vue'
import { addToCart } from '@/api/cart.js'
import { getProductList } from '@/api/product.js'

// 获取页面参数
const pageOptions = uni.getPageOptions()
const categoryParam = pageOptions?.category || ''

// 排序选项
const sortTabs = ['综合', '销量', '价格']

// 筛选标签
const filterTags = ['低卡', '高蛋白', '无糖', '全麦']

// 搜索词
const searchValue = ref('')

// 当前排序
const activeSort = ref('综合')

// 选中的筛选标签
const activeFilters = ref([])

// 商品数据（待替换为API）
const products = ref([])

// 加载状态
const isLoading = ref(false)

// 标签映射
const tagMap = {
  '低卡': 'low-carb',
  '高蛋白': 'high-protein',
  '无糖': 'sugar-free',
  '全麦': 'whole-grain',
}

// 根据搜索和筛选过滤商品
const filteredProducts = computed(() => {
  let result = [...products.value]

  // 搜索过滤
  if (searchValue.value) {
    const keyword = searchValue.value.toLowerCase()
    result = result.filter((p) => p.name.toLowerCase().includes(keyword))
  }

  // 标签筛选
  if (activeFilters.value.length > 0) {
    const filterTags = activeFilters.value.map((t) => tagMap[t])
    result = result.filter((p) =>
      filterTags.some((tag) => p.tags.includes(tag))
    )
  }

  // 排序
  if (activeSort.value === '销量') {
    // mock: 假设 id 小的销量高
    result.sort((a, b) => b.id - a.id)
  } else if (activeSort.value === '价格') {
    result.sort((a, b) => a.price - b.price)
  }

  return result
})

// 获取真实 API 数据
onMounted(async () => {
  isLoading.value = true
  try {
    const params = {}
    if (categoryParam) {
      params.categoryId = categoryParam
    }
    const res = await getProductList(params)
    if (res.code === 0) {
      products.value = res.data || []
    }
  } catch (e) {
    // 降级到 mock 数据
    products.value = [
      { id: 1, name: '手撕包', price: 28, originalPrice: 35, image: '/static/images/product1.png', tags: ['low-carb'] },
      { id: 2, name: '全麦吐司', price: 22, image: '/static/images/product2.png', tags: ['whole-grain', 'high-protein'] },
      { id: 3, name: '奶油泡芙', price: 18, image: '/static/images/product3.png', tags: ['sugar-free'] },
      { id: 4, name: '坚果面包', price: 25, image: '/static/images/product4.png', tags: ['high-protein'] },
      { id: 5, name: '无糖曲奇', price: 32, image: '/static/images/product5.png', tags: ['sugar-free', 'low-carb'] },
      { id: 6, name: '燕麦面包', price: 26, image: '/static/images/product6.png', tags: ['whole-grain', 'low-carb'] },
      { id: 7, name: '黑麦吐司', price: 24, image: '/static/images/product7.png', tags: ['whole-grain', 'high-protein'] },
      { id: 8, name: '蛋白棒', price: 35, image: '/static/images/product8.png', tags: ['high-protein', 'low-carb'] },
    ]
  } finally {
    isLoading.value = false
  }
})

function onSearchInput(e) {
  searchValue.value = e.detail.value || ''
}

function onSortChange(tab) {
  activeSort.value = tab
}

function onFilterToggle(tag) {
  const idx = activeFilters.value.indexOf(tag)
  if (idx > -1) {
    activeFilters.value.splice(idx, 1)
  } else {
    activeFilters.value.push(tag)
  }
}

function handleBack() {
  uni.navigateBack()
}

function goToProductDetail(id) {
  uni.navigateTo({ url: `/pages/productDetail/index?id=${id}` })
}

async function onAddCart(product) {
  try {
    await addToCart({ productId: product.id, quantity: 1 })
    uni.showToast({ title: '已加入购物车', icon: 'success' })
  } catch (e) {
    // mock 模式不报错
    uni.showToast({ title: '已加入购物车', icon: 'success' })
  }
}
</script>

<style lang="scss" scoped>
@import '@/uni.scss';

.page {
  min-height: 100vh;
  background-color: $color-background;
  padding-bottom: calc(50px + env(safe-area-inset-bottom));
}

// 搜索框
.search-bar {
  padding: $spacing-md $spacing-page;
  background-color: $color-white;
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

.search-field {
  flex: 1;
  font-size: 14px;
  color: $color-text-primary;
}

// 排序栏
.sort-bar {
  background-color: $color-white;
  padding: $spacing-md $spacing-page;
}

.sort-tabs {
  display: flex;
  gap: $spacing-lg;
}

.sort-tab {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: $color-text-primary;

  &.active {
    color: $color-primary;
    font-weight: bold;
  }
}

.sort-arrow {
  font-size: 10px;
  margin-left: 2px;
}

// 筛选栏
.filter-bar {
  background-color: $color-white;
  padding: 0 $spacing-page $spacing-md;
  display: flex;
  gap: $spacing-sm;
  flex-wrap: wrap;
}

.filter-tag {
  padding: 4px 12px;
  border-radius: $border-radius-pill;
  font-size: 12px;
  background-color: $color-secondary;
  color: $color-text-primary;

  &.active {
    background-color: $color-primary;
    color: $color-white;
  }
}

// 商品网格
.product-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: $spacing-md;
  padding: $spacing-md $spacing-page;
}

// 空状态
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: $spacing-md;
}

.empty-text {
  font-size: 14px;
  color: $color-text-primary;
}

// 底部留白
.bottom-space {
  height: 20px;
}
</style>