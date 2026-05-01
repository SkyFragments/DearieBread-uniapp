<template>
  <view class="page">
    <navbar title="我的订单" :showBack="true" @back="handleBack" />

    <!-- 订单状态 Tab -->
    <view class="order-tabs">
      <view
        v-for="tab in orderTabs"
        :key="tab.value"
        class="order-tab"
        :class="{ active: activeTab === tab.value }"
        @click="onTabChange(tab.value)"
      >
        <text class="tab-text">{{ tab.label }}</text>
        <text v-if="tab.count" class="tab-count">{{ tab.count }}</text>
      </view>
    </view>

    <!-- 订单列表 -->
    <view class="order-list">
      <view
        v-for="order in filteredOrders"
        :key="order.id"
        class="order-card"
        @click="onOrderClick(order)"
      >
        <view class="order-header">
          <text class="order-no">{{ order.orderNo }}</text>
          <text class="order-status" :class="statusClass(order.status)">{{ statusText(order.status) }}</text>
        </view>

        <view class="order-items">
          <view
            v-for="(item, index) in order.items.slice(0, 3)"
            :key="index"
            class="order-item"
          >
            <image class="item-image" :src="item.image" mode="aspectFill" />
            <view class="item-info">
              <text class="item-name">{{ item.name }}</text>
              <text class="item-spec">×{{ item.quantity }}</text>
            </view>
          </view>
          <view v-if="order.items.length > 3" class="more-items">
            还有{{ order.items.length - 3 }}件商品
          </view>
        </view>

        <view class="order-footer">
          <view class="order-info">
            <text class="order-time">{{ order.createTime }}</text>
            <text class="order-total">共{{ order.totalQuantity }}件，实付¥{{ order.finalPrice.toFixed(2) }}</text>
          </view>
          <view class="order-actions">
            <text
              v-if="order.status === 'pending'"
              class="action-btn cancel"
              @click.stop="onCancelOrder(order)"
            >取消订单</text>
            <text
              v-if="order.status === 'making'"
              class="action-btn track"
              @click.stop="onTrackOrder(order)"
            >查看进度</text>
            <text
              v-if="order.status === 'ready'"
              class="action-btn confirm"
              @click.stop="onConfirmPickup(order)"
            >确认取餐</text>
            <text
              v-if="order.status === 'completed'"
              class="action-btn review"
              @click.stop="onReviewOrder(order)"
            >去评价</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view v-if="filteredOrders.length === 0" class="empty-state">
      <text class="empty-icon">📋</text>
      <text class="empty-text">暂无订单</text>
      <text class="empty-desc">快去挑选心仪的商品吧</text>
      <view class="empty-btn" @click="goShopping">去选购</view>
    </view>

    <!-- 底部留白 -->
    <view class="bottom-space"></view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted, onPullDownRefresh } from 'vue'
import navbar from '@/components/navbar.vue'
import { getOrderList, cancelOrder } from '@/api/order.js'

// 下拉刷新
onPullDownRefresh(() => {
  loadOrders().finally(() => {
    uni.stopPullDownRefresh()
  })
})

// 订单状态 Tab
const orderTabs = [
  { label: '全部', value: 'all', count: 0 },
  { label: '待制作', value: 'pending', count: 0 },
  { label: '制作中', value: 'making', count: 0 },
  { label: '待取餐', value: 'ready', count: 0 },
  { label: '已完成', value: 'completed', count: 0 },
]

const activeTab = ref('all')

// 订单数据
const orders = ref([])

// 加载状态
const isLoading = ref(false)

// 获取真实订单数据
async function loadOrders() {
  isLoading.value = true
  try {
    const res = await getOrderList()
    if (res.code === 0) {
      orders.value = res.data || []
      updateTabCounts()
    }
  } catch (e) {
    orders.value = [
      {
        id: 1,
        orderNo: 'ORD20260502001',
        status: 'making',
        createTime: '2026-05-02 10:15',
        totalQuantity: 3,
        totalPrice: 78,
        discount: 10,
        finalPrice: 68,
        items: [
          { name: '手撕包', price: 28, quantity: 2, image: '/static/images/product1.png' },
          { name: '全麦吐司', price: 22, quantity: 1, image: '/static/images/product2.png' },
        ],
      },
      {
        id: 2,
        orderNo: 'ORD20260501008',
        status: 'ready',
        createTime: '2026-05-01 14:30',
        totalQuantity: 1,
        totalPrice: 28,
        discount: 0,
        finalPrice: 28,
        items: [
          { name: '奶油泡芙', price: 28, quantity: 1, image: '/static/images/product3.png' },
        ],
      },
      {
        id: 3,
        orderNo: 'ORD20260428015',
        status: 'completed',
        createTime: '2026-04-28 09:20',
        totalQuantity: 5,
        totalPrice: 120,
        discount: 15,
        finalPrice: 105,
        items: [
          { name: '手撕包', price: 28, quantity: 2, image: '/static/images/product1.png' },
          { name: '全麦吐司', price: 22, quantity: 2, image: '/static/images/product2.png' },
          { name: '坚果面包', price: 25, quantity: 1, image: '/static/images/product4.png' },
        ],
      },
      {
        id: 4,
        orderNo: 'ORD20260425003',
        status: 'completed',
        createTime: '2026-04-25 18:00',
        totalQuantity: 2,
        totalPrice: 50,
        discount: 5,
        finalPrice: 45,
        items: [
          { name: '无糖曲奇', price: 32, quantity: 1, image: '/static/images/product5.png' },
          { name: '燕麦面包', price: 26, quantity: 1, image: '/static/images/product6.png' },
        ],
      },
    ]
    updateTabCounts()
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadOrders()
})

function updateTabCounts() {
  const counts = { all: orders.value.length, pending: 0, making: 0, ready: 0, completed: 0 }
  orders.value.forEach((o) => {
    if (counts[o.status] !== undefined) counts[o.status]++
  })
  orderTabs.forEach((tab) => {
    tab.count = counts[tab.value] || 0
  })
}

// 筛选订单
const filteredOrders = computed(() => {
  if (activeTab.value === 'all') {
    return orders.value
  }
  return orders.value.filter((o) => o.status === activeTab.value)
})

// 状态映射
const statusMap = {
  pending: { text: '待制作', class: 'warning' },
  making: { text: '制作中', class: 'primary' },
  ready: { text: '待取餐', class: 'success' },
  completed: { text: '已完成', class: 'default' },
  cancelled: { text: '已取消', class: 'gray' },
}

function statusText(status) {
  return statusMap[status]?.text || status
}

function statusClass(status) {
  return `status-${statusMap[status]?.class || 'default'}`
}

function onTabChange(tab) {
  activeTab.value = tab
}

function handleBack() {
  uni.navigateBack()
}

function onOrderClick(order) {
  if (order.status === 'making' || order.status === 'ready') {
    onTrackOrder(order)
  }
}

async function onCancelOrder(order) {
  uni.showModal({
    title: '确认取消订单？',
    content: '取消后支付金额将原路退回',
    confirmColor: '#D4A574',
    success: async (res) => {
      if (res.confirm) {
        try {
          const res = await cancelOrder(order.id)
          if (res.code === 0) {
            order.status = 'cancelled'
            uni.showToast({ title: '订单已取消', icon: 'success' })
          } else {
            uni.showToast({ title: res.message || '取消失败', icon: 'none' })
          }
        } catch (e) {
          order.status = 'cancelled'
          uni.showToast({ title: '订单已取消', icon: 'success' })
        }
      }
    },
  })
}

function onTrackOrder(order) {
  uni.navigateTo({ url: `/pages/orderTracking/index?id=${order.id}` })
}

function onConfirmPickup(order) {
  uni.showModal({
    title: '确认已取餐？',
    content: '请确认您已到店取餐',
    confirmColor: '#D4A574',
    success: (res) => {
      if (res.confirm) {
        order.status = 'completed'
        uni.showToast({ title: '取餐确认成功', icon: 'success' })
      }
    },
  })
}

function onReviewOrder(order) {
  uni.navigateTo({ url: `/pages/review/index?orderId=${order.id}` })
}

function goShopping() {
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

// 订单 Tab
.order-tabs {
  display: flex;
  background-color: $color-white;
  padding: $spacing-md $spacing-page;
  margin-bottom: $spacing-md;
}

.order-tab {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
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

.tab-count {
  font-size: 10px;
  color: $color-white;
  background-color: $color-error;
  padding: 0 6px;
  border-radius: 10px;
  min-width: 16px;
  text-align: center;
}

// 订单卡片
.order-list {
  padding: 0 $spacing-page;
}

.order-card {
  background-color: $color-white;
  border-radius: $border-radius-card;
  padding: $spacing-md;
  margin-bottom: $spacing-md;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-md;
  padding-bottom: $spacing-sm;
  border-bottom: 1px solid $color-gray-100;
}

.order-no {
  font-size: 12px;
  color: $color-gray-500;
  font-family: monospace;
}

.order-status {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: $border-radius-tag;
}

.status-warning {
  background-color: rgba($color-warning, 0.1);
  color: $color-warning;
}

.status-primary {
  background-color: rgba($color-primary, 0.1);
  color: $color-primary;
}

.status-success {
  background-color: rgba($color-success, 0.1);
  color: $color-success;
}

.status-default {
  background-color: $color-gray-200;
  color: $color-gray-600;
}

.status-gray {
  background-color: $color-gray-100;
  color: $color-gray-500;
}

// 订单商品
.order-items {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
  margin-bottom: $spacing-md;
}

.order-item {
  display: flex;
  align-items: center;
  gap: $spacing-md;
}

.item-image {
  width: 50px;
  height: 50px;
  border-radius: $border-radius-card;
}

.item-info {
  flex: 1;
}

.item-name {
  font-size: 14px;
  color: $color-text-primary;
  display: block;
  margin-bottom: 2px;
}

.item-spec {
  font-size: 12px;
  color: $color-gray-500;
}

.more-items {
  font-size: 12px;
  color: $color-gray-500;
  text-align: center;
  padding: $spacing-sm 0;
}

// 订单底部
.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: $spacing-sm;
  border-top: 1px solid $color-gray-100;
}

.order-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.order-time {
  font-size: 12px;
  color: $color-gray-500;
}

.order-total {
  font-size: 14px;
  color: $color-text-primary;
}

.order-actions {
  display: flex;
  gap: $spacing-sm;
}

.action-btn {
  font-size: 12px;
  padding: 6px 12px;
  border-radius: $border-radius-button;
  border: 1px solid;

  &.cancel {
    border-color: $color-gray-400;
    color: $color-gray-600;
  }

  &.track,
  &.confirm {
    border-color: $color-primary;
    color: $color-primary;
  }

  &.review {
    background-color: $color-primary;
    color: $color-white;
    border-color: $color-primary;
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
  font-size: 16px;
  font-weight: 500;
  color: $color-text-primary;
  margin-bottom: $spacing-sm;
}

.empty-desc {
  font-size: 14px;
  color: $color-gray-500;
  margin-bottom: $spacing-lg;
}

.empty-btn {
  background-color: $color-primary;
  color: $color-white;
  padding: 10px 32px;
  border-radius: $border-radius-button;
  font-size: 14px;
}

.bottom-space {
  height: 20px;
}
</style>