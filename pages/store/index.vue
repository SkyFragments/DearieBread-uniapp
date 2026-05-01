<template>
  <view class="page">
    <navbar title="门店列表" :showBack="true" @back="handleBack" />

    <!-- 搜索框 -->
    <view class="search-bar">
      <view class="search-input">
        <text class="search-icon">🔍</text>
        <input
          class="search-field"
          placeholder="搜索门店"
          v-model="searchValue"
          @input="onSearchInput"
        />
      </view>
    </view>

    <!-- 门店列表 -->
    <view class="store-list">
      <view
        v-for="store in filteredStores"
        :key="store.id"
        class="store-card"
        @click="onStoreClick(store)"
      >
        <view class="store-header">
          <view class="store-basic">
            <text class="store-name">{{ store.name }}</text>
            <view class="store-tags">
              <text
                v-for="tag in store.tags"
                :key="tag"
                class="store-tag"
              >{{ tag }}</text>
            </view>
          </view>
          <view class="store-distance">
            <text class="distance-value">{{ store.distance }}</text>
            <text class="distance-unit">m</text>
          </view>
        </view>

        <view class="store-detail">
          <text class="detail-icon">📍</text>
          <text class="detail-text">{{ store.address }}</text>
        </view>

        <view class="store-detail">
          <text class="detail-icon">🕐</text>
          <text class="detail-text">营业时间：{{ store.hours }}</text>
        </view>

        <view class="store-detail">
          <text class="detail-icon">📞</text>
          <text class="detail-text">{{ store.phone }}</text>
        </view>

        <view class="store-actions">
          <view class="action-item" @click.stop="onCallStore(store)">
            <text class="action-icon">📞</text>
            <text class="action-text">拨打电话</text>
          </view>
          <view class="action-item" @click.stop="onNavigateStore(store)">
            <text class="action-icon">🗺️</text>
            <text class="action-text">导航到店</text>
          </view>
          <view class="action-item" @click.stop="onCheckIn(store)">
            <text class="action-icon">✓</text>
            <text class="action-text">签到</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view v-if="filteredStores.length === 0" class="empty-state">
      <text class="empty-icon">🏪</text>
      <text class="empty-text">暂无门店</text>
    </view>

    <!-- 底部留白 -->
    <view class="bottom-space"></view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import navbar from '@/components/navbar.vue'
import { getStoreList } from '@/api/store.js'

// 搜索词
const searchValue = ref('')

// 门店数据（mock）
const stores = ref([
  {
    id: 1,
    name: 'Dearie Bread 旗舰店',
    address: '朝阳区建国路88号SOHO现代城1层',
    distance: 500,
    hours: '08:00-22:00',
    phone: '400-888-9999',
    tags: ['认证旗舰店', '人气TOP'],
  },
  {
    id: 2,
    name: 'Dearie Bread 三里屯店',
    address: '朝阳区三里屯路19号三里屯太古里南区S2-34',
    distance: 1200,
    hours: '10:00-22:00',
    phone: '400-888-9998',
    tags: ['潮流打卡'],
  },
  {
    id: 3,
    name: 'Dearie Bread 国贸店',
    address: '朝阳区建国门外大街1号国贸商城B1层B1012',
    distance: 2000,
    hours: '09:00-21:00',
    phone: '400-888-9997',
    tags: ['商务优选'],
  },
  {
    id: 4,
    name: 'Dearie Bread 望京店',
    address: '朝阳区望京街望京SOHO T2层L2-2012',
    distance: 3500,
    hours: '08:00-20:00',
    phone: '400-888-9996',
    tags: ['写字楼优选'],
  },
])

// 筛选门店
const filteredStores = computed(() => {
  if (!searchValue.value) {
    return stores.value
  }
  const keyword = searchValue.value.toLowerCase()
  return stores.value.filter(
    (s) =>
      s.name.toLowerCase().includes(keyword) ||
      s.address.toLowerCase().includes(keyword)
  )
})

function onSearchInput(e) {
  searchValue.value = e.detail.value || ''
}

function handleBack() {
  uni.navigateBack()
}

function onStoreClick(store) {
  // 选中门店并返回
  uni.setStorageSync('selectedStore', store)
  uni.navigateBack()
}

function onCallStore(store) {
  uni.makePhoneCall({
    phoneNumber: store.phone,
  })
}

function onNavigateStore(store) {
  // 模拟导航
  uni.showToast({ title: `正在导航至：${store.name}`, icon: 'none' })
}

function onCheckIn(store) {
  uni.showToast({ title: '签到成功 +5积分', icon: 'success' })
}
</script>

<style lang="scss" scoped>
@import '@/uni.scss';

.page {
  min-height: 100vh;
  background-color: $color-background;
  padding-bottom: calc(60px + env(safe-area-inset-bottom));
}

// 搜索框
.search-bar {
  padding: $spacing-md $spacing-page;
  background-color: $color-white;
  margin-bottom: $spacing-md;
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

// 门店列表
.store-list {
  padding: 0 $spacing-page;
}

.store-card {
  background-color: $color-white;
  border-radius: $border-radius-card;
  padding: $spacing-md;
  margin-bottom: $spacing-md;
}

.store-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: $spacing-md;
}

.store-basic {
  flex: 1;
}

.store-name {
  font-size: 16px;
  font-weight: bold;
  color: $color-text-primary;
  display: block;
  margin-bottom: $spacing-sm;
}

.store-tags {
  display: flex;
  gap: $spacing-sm;
  flex-wrap: wrap;
}

.store-tag {
  font-size: 10px;
  padding: 2px 8px;
  background-color: rgba($color-primary, 0.1);
  color: $color-primary;
  border-radius: $border-radius-tag;
}

.store-distance {
  display: flex;
  align-items: baseline;
  gap: 2px;
}

.distance-value {
  font-size: 18px;
  font-weight: bold;
  color: $color-primary;
}

.distance-unit {
  font-size: 12px;
  color: $color-gray-500;
}

// 门店详情
.store-detail {
  display: flex;
  align-items: flex-start;
  gap: $spacing-sm;
  margin-bottom: $spacing-sm;
}

.detail-icon {
  font-size: 14px;
  flex-shrink: 0;
}

.detail-text {
  font-size: 12px;
  color: $color-gray-600;
  line-height: 1.4;
}

// 操作按钮
.store-actions {
  display: flex;
  justify-content: space-around;
  padding-top: $spacing-md;
  border-top: 1px solid $color-gray-100;
  margin-top: $spacing-sm;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.action-icon {
  font-size: 20px;
}

.action-text {
  font-size: 12px;
  color: $color-gray-600;
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
  color: $color-gray-500;
}

.bottom-space {
  height: 20px;
}
</style>