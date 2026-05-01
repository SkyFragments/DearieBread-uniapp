<template>
  <view class="page">
    <navbar title="积分明细" :showBack="true" @back="handleBack" />

    <!-- 积分概览 -->
    <view class="points-overview">
      <view class="points-balance">
        <text class="balance-label">我的积分</text>
        <text class="balance-value">{{ currentPoints }}</text>
      </view>
      <view class="points-rules" @click="onViewRules">
        <text class="rules-text">积分规则 ›</text>
      </view>
    </view>

    <!-- 筛选 Tab -->
    <view class="filter-tabs">
      <view
        v-for="tab in filterTabs"
        :key="tab.value"
        class="filter-tab"
        :class="{ active: activeFilter === tab.value }"
        @click="onFilterChange(tab.value)"
      >
        <text class="tab-text">{{ tab.label }}</text>
      </view>
    </view>

    <!-- 积分记录列表 -->
    <view class="points-list">
      <view
        v-for="record in filteredRecords"
        :key="record.id"
        class="points-item"
      >
        <view class="item-left">
          <text class="item-title">{{ record.title }}</text>
          <text class="item-time">{{ record.time }}</text>
        </view>
        <view class="item-right">
          <text class="item-value" :class="{ income: record.type === 'income' }">
            {{ record.type === 'income' ? '+' : '-' }}{{ record.points }}
          </text>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view v-if="filteredRecords.length === 0" class="empty-state">
      <text class="empty-icon">📊</text>
      <text class="empty-text">暂无积分记录</text>
    </view>

    <!-- 底部留白 -->
    <view class="bottom-space"></view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import navbar from '@/components/navbar.vue'

// 当前积分
const currentPoints = ref(1280)

// 筛选 Tab
const filterTabs = [
  { label: '全部', value: 'all' },
  { label: '收入', value: 'income' },
  { label: '支出', value: 'expense' },
]

const activeFilter = ref('all')

// 积分记录（mock）
const records = ref([
  { id: 1, title: '消费获积分', time: '2026-05-02 10:15', points: 68, type: 'income' },
  { id: 2, title: '签到奖励', time: '2026-05-02 09:00', points: 5, type: 'income' },
  { id: 3, title: '兑换优惠券', time: '2026-05-01 15:30', points: 100, type: 'expense' },
  { id: 4, title: '消费获积分', time: '2026-04-28 09:20', points: 120, type: 'income' },
  { id: 5, title: '兑换礼品', time: '2026-04-25 18:00', points: 200, type: 'expense' },
  { id: 6, title: '邀请好友奖励', time: '2026-04-20 14:00', points: 50, type: 'income' },
  { id: 7, title: '消费获积分', time: '2026-04-18 11:30', points: 88, type: 'income' },
  { id: 8, title: '生日双倍积分', time: '2026-04-15 00:00', points: 200, type: 'income' },
])

// 筛选记录
const filteredRecords = computed(() => {
  if (activeFilter.value === 'all') {
    return records.value
  }
  return records.value.filter((r) => r.type === activeFilter.value)
})

function handleBack() {
  uni.navigateBack()
}

function onFilterChange(filter) {
  activeFilter.value = filter
}

function onViewRules() {
  uni.showModal({
    title: '积分规则',
    content: `1. 消费1元 = 1积分\n2. 签到每天 +5积分\n3. 邀请好友 +50积分\n4. 100积分抵1元\n5. 生日当月双倍积分`,
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
  padding-bottom: calc(60px + env(safe-area-inset-bottom));
}

// 积分概览
.points-overview {
  background: linear-gradient(135deg, $color-primary 0%, $color-accent 100%);
  margin: $spacing-md $spacing-page;
  padding: $spacing-lg;
  border-radius: $border-radius-card;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.points-balance {
  display: flex;
  flex-direction: column;
}

.balance-label {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: $spacing-sm;
}

.balance-value {
  font-size: 36px;
  font-weight: bold;
  color: $color-white;
}

.points-rules {
  padding: $spacing-sm $spacing-md;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: $border-radius-pill;
}

.rules-text {
  font-size: 12px;
  color: $color-white;
}

// 筛选 Tab
.filter-tabs {
  display: flex;
  background-color: $color-white;
  margin-bottom: $spacing-md;
}

.filter-tab {
  flex: 1;
  text-align: center;
  padding: $spacing-md 0;
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

// 积分记录列表
.points-list {
  background-color: $color-white;
  margin: 0 $spacing-page;
  border-radius: $border-radius-card;
}

.points-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $spacing-md;
  border-bottom: 1px solid $color-gray-100;

  &:last-child {
    border-bottom: none;
  }
}

.item-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.item-title {
  font-size: 14px;
  color: $color-text-primary;
}

.item-time {
  font-size: 12px;
  color: $color-gray-500;
}

.item-value {
  font-size: 16px;
  font-weight: bold;
  color: $color-error;

  &.income {
    color: $color-success;
  }
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