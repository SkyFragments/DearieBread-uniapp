<template>
  <view class="page">
    <navbar title="会员中心" :showBack="false" />

    <!-- 用户信息卡片 -->
    <view class="user-card">
      <view class="user-info">
        <image class="avatar" :src="userInfo.avatar || '/static/images/avatar-default.png'" mode="aspectFill" />
        <view class="user-detail">
          <text class="username">{{ userInfo.nickname || 'Dearie 会员' }}</text>
          <text class="member-level">{{ userInfo.level || '银卡会员' }}</text>
        </view>
      </view>
      <view class="member-benefits">
        <view class="benefit-item">
          <text class="benefit-value">{{ userInfo.points || 0 }}</text>
          <text class="benefit-label">积分</text>
        </view>
        <view class="benefit-divider"></view>
        <view class="benefit-item">
          <text class="benefit-value">{{ userInfo.coupons || 0 }}</text>
          <text class="benefit-label">优惠券</text>
        </view>
        <view class="benefit-divider"></view>
        <view class="benefit-item">
          <text class="benefit-value">{{ userInfo.balance || 0 }}</text>
          <text class="benefit-label">余额</text>
        </view>
      </view>
    </view>

    <!-- 会员成长值 -->
    <view class="growth-card">
      <view class="growth-header">
        <text class="growth-title">我的成长值</text>
        <text class="growth-more" @click="onViewGrowthDetail">成长说明 ›</text>
      </view>
      <view class="growth-bar">
        <view class="growth-progress" :style="{ width: growthPercent + '%' }"></view>
      </view>
      <view class="growth-info">
        <text class="growth-current">{{ userInfo.growth || 680 }} / {{ nextLevelGrowth }}</text>
        <text class="growth-level">距离{{ nextLevelName }}还差{{ needGrowth }}成长值</text>
      </view>
    </view>

    <!-- 会员权益 -->
    <view class="section privileges-section">
      <text class="section-title">会员权益</text>
      <view class="privileges-grid">
        <view
          v-for="privilege in privileges"
          :key="privilege.id"
          class="privilege-item"
        >
          <text class="privilege-icon">{{ privilege.icon }}</text>
          <text class="privilege-name">{{ privilege.name }}</text>
        </view>
      </view>
    </view>

    <!-- 功能入口 -->
    <view class="section menu-section">
      <view
        v-for="menu in menuItems"
        :key="menu.id"
        class="menu-item"
        @click="onMenuClick(menu)"
      >
        <view class="menu-left">
          <text class="menu-icon">{{ menu.icon }}</text>
          <text class="menu-name">{{ menu.name }}</text>
        </view>
        <view class="menu-right">
          <text v-if="menu.badge" class="menu-badge">{{ menu.badge }}</text>
          <text class="menu-arrow">›</text>
        </view>
      </view>
    </view>

    <!-- 底部留白 -->
    <view class="bottom-space"></view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import navbar from '@/components/navbar.vue'
import { getMemberInfo } from '@/api/member.js'

// 用户信息
const userInfo = ref({
  id: 1,
  nickname: 'Dearie 会员',
  avatar: '/static/images/avatar-default.png',
  level: '银卡会员',
  points: 0,
  coupons: 0,
  balance: 0,
  growth: 0,
})

// 加载状态
const isLoading = ref(false)

// 获取真实会员数据
onMounted(async () => {
  isLoading.value = true
  try {
    const res = await getMemberInfo()
    if (res.code === 0 && res.data) {
      userInfo.value = res.data
    }
  } catch (e) {
    // 使用默认数据
  } finally {
    isLoading.value = false
  }
})

// 会员等级配置
const levelConfig = {
  '注册会员': { growth: 0, next: '铜卡会员', nextGrowth: 500 },
  '铜卡会员': { growth: 500, next: '银卡会员', nextGrowth: 2000 },
  '银卡会员': { growth: 2000, next: '金卡会员', nextGrowth: 5000 },
  '金卡会员': { growth: 5000, next: '白金会员', nextGrowth: 10000 },
  '白金会员': { growth: 10000, next: null, nextGrowth: 0 },
}

const nextLevelName = computed(() => levelConfig[userInfo.value.level]?.next || '最高等级')
const nextLevelGrowth = computed(() => levelConfig[userInfo.value.level]?.nextGrowth || 0)
const needGrowth = computed(() => Math.max(0, nextLevelGrowth.value - userInfo.value.growth))
const growthPercent = computed(() => {
  const current = userInfo.value.growth
  const next = nextLevelGrowth.value
  if (next === 0) return 100
  return Math.min(100, (current / next) * 100)
})

// 会员权益
const privileges = ref([
  { id: 1, icon: '🎁', name: '新人礼包' },
  { id: 2, icon: '🎟️', name: '专属优惠券' },
  { id: 3, icon: '⭐', name: '积分加速' },
  { id: 4, icon: '🏷️', name: '生日特权' },
  { id: 5, icon: '🚀', name: '优先制作' },
  { id: 6, icon: '🎂', name: '生日蛋糕券' },
])

// 功能菜单
const menuItems = ref([
  { id: 1, icon: '📋', name: '我的订单', path: '/pages/myOrders/index', badge: '' },
  { id: 2, icon: '🎟️', name: '优惠券', path: '/pages/couponCenter/index', badge: '3' },
  { id: 3, icon: '📍', name: '门店信息', path: '/pages/store/index', badge: '' },
  { id: 4, icon: '💰', name: '积分明细', path: '/pages/pointsDetail/index', badge: '' },
  { id: 5, icon: '🏦', name: '我的积分', path: '/pages/pointsDetail/index', badge: '' },
  { id: 6, icon: '👥', name: '邀请好友', path: '', badge: '' },
  { id: 7, icon: '⚙️', name: '设置', path: '', badge: '' },
])

function onMenuClick(menu) {
  if (menu.path) {
    uni.navigateTo({ url: menu.path })
  } else {
    uni.showToast({ title: '功能开发中', icon: 'none' })
  }
}

function onViewGrowthDetail() {
  uni.showModal({
    title: '成长值说明',
    content: '成长值是衡量会员等级的指标，通过消费、互动等方式获得。成长值越高，会员等级越高，享受的权益越丰富。',
    showCancel: false,
    confirmColor: '#D4A574',
  })
}
</script>

<style lang="scss" scoped>
@import '@/uni.scss';

.page {
  min-height: 100vh;
  background-color: $color-background;
  padding-bottom: calc(80px + env(safe-area-inset-bottom));
}

// 用户卡片
.user-card {
  background: linear-gradient(135deg, $color-primary 0%, $color-accent 100%);
  margin: $spacing-md $spacing-page;
  padding: $spacing-lg;
  border-radius: $border-radius-card;
  color: $color-white;
}

.user-info {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  margin-bottom: $spacing-lg;
}

.avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.user-detail {
  flex: 1;
}

.username {
  font-size: 18px;
  font-weight: bold;
  display: block;
  margin-bottom: 4px;
}

.member-level {
  font-size: 14px;
  opacity: 0.9;
}

.member-benefits {
  display: flex;
  justify-content: space-around;
  background-color: rgba(255, 255, 255, 0.15);
  border-radius: $border-radius-card;
  padding: $spacing-md 0;
}

.benefit-item {
  text-align: center;
}

.benefit-value {
  font-size: 20px;
  font-weight: bold;
  display: block;
  margin-bottom: 2px;
}

.benefit-label {
  font-size: 12px;
  opacity: 0.9;
}

.benefit-divider {
  width: 1px;
  height: 30px;
  background-color: rgba(255, 255, 255, 0.3);
}

// 成长值卡片
.growth-card {
  background-color: $color-white;
  margin: 0 $spacing-page $spacing-md;
  padding: $spacing-md;
  border-radius: $border-radius-card;
}

.growth-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-md;
}

.growth-title {
  font-size: 14px;
  font-weight: bold;
  color: $color-text-primary;
}

.growth-more {
  font-size: 12px;
  color: $color-gray-500;
}

.growth-bar {
  height: 8px;
  background-color: $color-gray-200;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: $spacing-sm;
}

.growth-progress {
  height: 100%;
  background: linear-gradient(90deg, $color-primary 0%, $color-accent 100%);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.growth-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.growth-current {
  font-size: 12px;
  color: $color-gray-600;
}

.growth-level {
  font-size: 12px;
  color: $color-primary;
}

// 会员权益
.section {
  background-color: $color-white;
  margin: 0 $spacing-page $spacing-md;
  padding: $spacing-md;
  border-radius: $border-radius-card;
}

.section-title {
  font-size: 14px;
  font-weight: bold;
  color: $color-text-primary;
  display: block;
  margin-bottom: $spacing-md;
}

.privileges-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: $spacing-md;
}

.privilege-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-sm;
}

.privilege-icon {
  font-size: 28px;
}

.privilege-name {
  font-size: 12px;
  color: $color-text-primary;
}

// 功能菜单
.menu-section {
  display: flex;
  flex-direction: column;
}

.menu-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $spacing-md 0;
  border-bottom: 1px solid $color-gray-100;

  &:last-child {
    border-bottom: none;
  }
}

.menu-left {
  display: flex;
  align-items: center;
  gap: $spacing-md;
}

.menu-icon {
  font-size: 20px;
}

.menu-name {
  font-size: 14px;
  color: $color-text-primary;
}

.menu-right {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
}

.menu-badge {
  font-size: 12px;
  color: $color-error;
  background-color: rgba($color-error, 0.1);
  padding: 2px 8px;
  border-radius: $border-radius-tag;
}

.menu-arrow {
  font-size: 16px;
  color: $color-gray-400;
}

.bottom-space {
  height: 20px;
}
</style>