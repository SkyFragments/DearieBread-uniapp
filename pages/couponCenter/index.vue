<template>
  <view class="page">
    <navbar title="优惠券中心" :showBack="true" @back="handleBack" />

    <!-- 优惠券 Tab -->
    <view class="coupon-tabs">
      <view
        v-for="tab in couponTabs"
        :key="tab.value"
        class="coupon-tab"
        :class="{ active: activeTab === tab.value }"
        @click="onTabChange(tab.value)"
      >
        <text class="tab-text">{{ tab.label }}</text>
      </view>
    </view>

    <!-- 优惠券列表 -->
    <view class="coupon-list">
      <view
        v-for="coupon in filteredCoupons"
        :key="coupon.id"
        class="coupon-card"
        :class="{ disabled: coupon.status !== 'available', expired: coupon.status === 'expired' }"
      >
        <view class="coupon-left">
          <view class="coupon-value">
            <text class="value-amount">¥{{ coupon.discount }}</text>
            <text class="value-desc">{{ coupon.condition }}</text>
          </view>
        </view>

        <view class="coupon-right">
          <view class="coupon-info">
            <text class="coupon-name">{{ coupon.name }}</text>
            <text class="coupon-desc">{{ coupon.desc }}</text>
            <text class="coupon-time">
              {{ coupon.startTime }} - {{ coupon.endTime }}
            </text>
          </view>
          <view class="coupon-action">
            <view
              v-if="coupon.status === 'available'"
              class="receive-btn"
              @click="onReceiveCoupon(coupon)"
            >
              立即领取
            </view>
            <view
              v-else-if="coupon.status === 'received'"
              class="use-btn"
              @click="onUseCoupon"
            >
              去使用
            </view>
            <text v-else-if="coupon.status === 'expired'" class="expired-text">
              已过期
            </text>
            <text v-else-if="coupon.status === 'used'" class="used-text">
              已使用
            </text>
          </view>
        </view>

        <view v-if="coupon.status === 'expired'" class="coupon-mask">
          <text class="mask-text">已过期</text>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view v-if="filteredCoupons.length === 0" class="empty-state">
      <text class="empty-icon">🎟️</text>
      <text class="empty-text">暂无优惠券</text>
    </view>

    <!-- 底部留白 -->
    <view class="bottom-space"></view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import navbar from '@/components/navbar.vue'
import { getCouponList } from '@/api/coupon.js'

// 优惠券 Tab
const couponTabs = [
  { label: '可领取', value: 'available' },
  { label: '已领取', value: 'received' },
  { label: '已使用', value: 'used' },
  { label: '已过期', value: 'expired' },
]

const activeTab = ref('available')

// 优惠券数据（mock）
const coupons = ref([
  {
    id: 1,
    name: '新人专享券',
    desc: '限首次下单使用',
    discount: 10,
    condition: '满50可用',
    startTime: '2026-05-01',
    endTime: '2026-05-31',
    status: 'available',
  },
  {
    id: 2,
    name: '满100减20',
    desc: '全品类通用',
    discount: 20,
    condition: '满100可用',
    startTime: '2026-05-01',
    endTime: '2026-06-30',
    status: 'available',
  },
  {
    id: 3,
    name: '生日专属券',
    desc: '生日当月可用',
    discount: 15,
    condition: '无门槛',
    startTime: '2026-05-01',
    endTime: '2026-05-31',
    status: 'received',
  },
  {
    id: 4,
    name: '会员专享券',
    desc: '银卡及以上会员可用',
    discount: 8,
    condition: '满30可用',
    startTime: '2026-04-01',
    endTime: '2026-04-30',
    status: 'expired',
  },
  {
    id: 5,
    name: '限时特惠券',
    desc: '指定商品可用',
    discount: 5,
    condition: '满20可用',
    startTime: '2026-03-15',
    endTime: '2026-04-15',
    status: 'used',
  },
])

// 筛选优惠券
const filteredCoupons = computed(() => {
  return coupons.value.filter((c) => c.status === activeTab.value)
})

function onTabChange(tab) {
  activeTab.value = tab
}

function handleBack() {
  uni.navigateBack()
}

function onReceiveCoupon(coupon) {
  coupon.status = 'received'
  uni.showToast({ title: '领取成功', icon: 'success' })
}

function onUseCoupon() {
  uni.switchTab({ url: '/pages/home/index' })
}
</script>

<style lang="scss" scoped>
@import '@/uni.scss';

.page {
  min-height: 100vh;
  background-color: $color-background;
  padding-bottom: calc(60px + env(safe-area-inset-bottom));
}

// 优惠券 Tab
.coupon-tabs {
  display: flex;
  background-color: $color-white;
  padding: $spacing-md $spacing-page;
  margin-bottom: $spacing-md;
}

.coupon-tab {
  flex: 1;
  text-align: center;
  padding: $spacing-sm 0;
  border-bottom: 2px solid transparent;

  &.active {
    border-bottom-color: $color-primary;
  }
}

.tab-text {
  font-size: 14px;
  color: $color-text-primary;

  .active & {
    color: $color-primary;
    font-weight: bold;
  }
}

// 优惠券卡片
.coupon-list {
  padding: 0 $spacing-page;
}

.coupon-card {
  display: flex;
  background-color: $color-white;
  border-radius: $border-radius-card;
  overflow: hidden;
  margin-bottom: $spacing-md;
  position: relative;

  &.disabled {
    opacity: 0.6;
  }

  &.expired {
    background-color: $color-gray-100;
  }
}

.coupon-left {
  width: 100px;
  background: linear-gradient(135deg, $color-primary 0%, $color-accent 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $spacing-lg $spacing-md;
}

.coupon-value {
  text-align: center;
  color: $color-white;
}

.value-amount {
  font-size: 28px;
  font-weight: bold;
  display: block;
}

.value-desc {
  font-size: 12px;
  opacity: 0.9;
}

.coupon-right {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $spacing-md;
}

.coupon-info {
  flex: 1;
}

.coupon-name {
  font-size: 14px;
  font-weight: bold;
  color: $color-text-primary;
  display: block;
  margin-bottom: 4px;
}

.coupon-desc {
  font-size: 12px;
  color: $color-gray-500;
  display: block;
  margin-bottom: 4px;
}

.coupon-time {
  font-size: 10px;
  color: $color-gray-400;
}

.coupon-action {
  flex-shrink: 0;
  margin-left: $spacing-md;
}

.receive-btn,
.use-btn {
  background-color: $color-primary;
  color: $color-white;
  padding: 6px 16px;
  border-radius: $border-radius-button;
  font-size: 12px;
}

.expired-text,
.used-text {
  font-size: 12px;
  color: $color-gray-400;
}

.coupon-mask {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 80px;
  background-color: rgba($color-gray-500, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.mask-text {
  font-size: 14px;
  color: $color-white;
  background-color: $color-gray-500;
  padding: 4px 12px;
  transform: rotate(15deg);
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