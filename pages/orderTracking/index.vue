<template>
  <view class="page">
    <navbar title="订单追踪" :showBack="true" @back="handleBack" />

    <!-- 订单状态 -->
    <view class="status-card">
      <view class="status-header">
        <text class="status-icon">{{ statusIcon }}</text>
        <view class="status-info">
          <text class="status-text">{{ statusText }}</text>
          <text class="status-desc">{{ statusDesc }}</text>
        </view>
      </view>
      <view class="status-progress">
        <view
          v-for="(step, index) in progressSteps"
          :key="index"
          class="progress-step"
          :class="{ active: index <= currentStep, completed: index < currentStep }"
        >
          <view class="step-dot">
            <text v-if="index < currentStep" class="check-icon">✓</text>
          </view>
          <text class="step-label">{{ step }}</text>
        </view>
      </view>
    </view>

    <!-- 订单信息 -->
    <view class="section order-info">
      <view class="info-row">
        <text class="info-label">订单编号</text>
        <view class="info-value">
          <text class="order-no">{{ orderInfo.orderNo }}</text>
          <text class="copy-btn" @click="onCopyOrderNo">复制</text>
        </view>
      </view>
      <view class="info-row">
        <text class="info-label">下单时间</text>
        <text class="info-value">{{ orderInfo.createTime }}</text>
      </view>
      <view class="info-row">
        <text class="info-label">取餐方式</text>
        <text class="info-value">{{ orderInfo.deliveryType === 'pickup' ? '到店自提' : '外卖配送' }}</text>
      </view>
    </view>

    <!-- 门店/配送信息 -->
    <view class="section location-section">
      <view class="location-header">
        <text class="location-icon">{{ orderInfo.deliveryType === 'pickup' ? '🏪' : '🚚' }}</text>
        <text class="location-title">{{ orderInfo.deliveryType === 'pickup' ? '取餐门店' : '配送地址' }}</text>
      </view>
      <view class="location-detail">
        <text class="location-name">{{ orderInfo.storeName }}</text>
        <text class="location-address">{{ orderInfo.storeAddress || orderInfo.deliveryAddress }}</text>
      </view>
      <view v-if="orderInfo.deliveryType === 'pickup'" class="pickup-time">
        <text class="time-label">预计取餐时间：</text>
        <text class="time-value">{{ orderInfo.pickupTime }}</text>
      </view>
    </view>

    <!-- 商品清单 -->
    <view class="section items-section">
      <text class="section-title">订单商品</text>
      <view class="order-items">
        <view
          v-for="item in orderInfo.items"
          :key="item.id"
          class="order-item"
        >
          <image class="item-image" :src="item.image" mode="aspectFill" />
          <view class="item-info">
            <text class="item-name">{{ item.name }}</text>
            <text class="item-spec">×{{ item.quantity }}</text>
          </view>
          <text class="item-price">¥{{ (item.price * item.quantity).toFixed(2) }}</text>
        </view>
      </view>
    </view>

    <!-- 价格明细 -->
    <view class="section price-section">
      <view class="price-row">
        <text class="price-label">商品总价</text>
        <text class="price-value">¥{{ orderInfo.totalPrice.toFixed(2) }}</text>
      </view>
      <view class="price-row">
        <text class="price-label">优惠</text>
        <text class="price-value discount">-¥{{ orderInfo.discount.toFixed(2) }}</text>
      </view>
      <view class="price-row">
        <text class="price-label">配送费</text>
        <text class="price-value">¥0</text>
      </view>
      <view class="price-row total-row">
        <text class="price-label">实付金额</text>
        <text class="total-price">¥{{ orderInfo.finalPrice.toFixed(2) }}</text>
      </view>
    </view>

    <!-- 底部操作栏 -->
    <view class="bottom-bar">
      <view class="action-left">
        <text class="contact-btn" @click="onContact">联系客服</text>
      </view>
      <view class="action-right">
        <view v-if="orderInfo.status === 'pending'" class="btn-outline" @click="onCancelOrder">取消订单</view>
        <view v-if="orderInfo.status === 'completed'" class="btn-primary" @click="onReview">去评价</view>
        <view v-if="orderInfo.status === 'completed'" class="btn-outline" @click="onRepurchase">再来一单</view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import navbar from '@/components/navbar.vue'

// 获取页面参数
const pageOptions = uni.getPageOptions()
const orderId = pageOptions?.id || 'ORD20260502001'

// 订单状态：pending-待制作, making-制作中, ready-待取餐, completed-已完成, cancelled-已取消
const orderInfo = ref({
  id: orderId,
  orderNo: 'ORD20260502001234',
  createTime: '2026-05-02 10:15:32',
  status: 'making', // 当前模拟状态：制作中
  deliveryType: 'pickup',
  storeName: 'Dearie Bread 旗舰店',
  storeAddress: '朝阳区建国路88号SOHO现代城1层',
  deliveryAddress: '',
  pickupTime: '10:45 左右',
  totalPrice: 78,
  discount: 10,
  finalPrice: 68,
  items: [
    { id: 1, name: '手撕包', price: 28, quantity: 2, image: '/static/images/product1.png' },
    { id: 2, name: '全麦吐司', price: 22, quantity: 1, image: '/static/images/product2.png' },
  ],
})

// 状态配置
const statusConfig = {
  pending: { icon: '⏰', text: '等待接单', desc: '商家正在确认订单，请稍候' },
  making: { icon: '👨‍🍳', text: '制作中', desc: '您的订单正在制作中，预计10:45完成' },
  ready: { icon: '✅', text: '待取餐', desc: '您的订单已完成，请到店取餐' },
  completed: { icon: '🎉', text: '已完成', desc: '感谢您的购买，欢迎下次光临' },
  cancelled: { icon: '❌', text: '已取消', desc: '订单已取消，支付金额将原路退回' },
}

const progressSteps = ['下单', '接单', '制作', '完成']

const currentStep = computed(() => {
  const statusMap = { pending: 0, making: 1, ready: 2, completed: 3, cancelled: -1 }
  return statusMap[orderInfo.value.status] ?? 0
})

const statusIcon = computed(() => statusConfig[orderInfo.value.status]?.icon || '⏰')
const statusText = computed(() => statusConfig[orderInfo.value.status]?.text || '处理中')
const statusDesc = computed(() => statusConfig[orderInfo.value.status]?.desc || '')

function handleBack() {
  uni.navigateBack()
}

function onCopyOrderNo() {
  uni.setClipboardData({
    data: orderInfo.value.orderNo,
    success: () => {
      uni.showToast({ title: '已复制', icon: 'success' })
    },
  })
}

function onContact() {
  uni.showToast({ title: '客服电话：400-888-9999', icon: 'none' })
}

function onCancelOrder() {
  uni.showModal({
    title: '确认取消订单？',
    content: '取消后支付金额将原路退回',
    confirmColor: '#D4A574',
    success: (res) => {
      if (res.confirm) {
        orderInfo.value.status = 'cancelled'
        uni.showToast({ title: '订单已取消', icon: 'success' })
      }
    },
  })
}

function onReview() {
  uni.navigateTo({ url: `/pages/review/index?orderId=${orderId}` })
}

function onRepurchase() {
  // TODO: 将订单商品加入购物车
  uni.showToast({ title: '已加入购物车', icon: 'success' })
  setTimeout(() => {
    uni.switchTab({ url: '/pages/cart/index' })
  }, 1500)
}
</script>

<style lang="scss" scoped>
@import '@/uni.scss';

.page {
  min-height: 100vh;
  background-color: $color-background;
  padding-bottom: calc(80px + env(safe-area-inset-bottom));
}

.section {
  background-color: $color-white;
  margin: $spacing-md $spacing-page;
  padding: $spacing-md;
  border-radius: $border-radius-card;
}

// 状态卡片
.status-card {
  background-color: $color-white;
  margin: $spacing-md $spacing-page;
  padding: $spacing-lg;
  border-radius: $border-radius-card;
}

.status-header {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  margin-bottom: $spacing-lg;
}

.status-icon {
  font-size: 40px;
}

.status-info {
  flex: 1;
}

.status-text {
  font-size: 18px;
  font-weight: bold;
  color: $color-text-primary;
  display: block;
  margin-bottom: 4px;
}

.status-desc {
  font-size: 14px;
  color: $color-gray-600;
}

// 进度条
.status-progress {
  display: flex;
  justify-content: space-between;
  position: relative;
}

.status-progress::before {
  content: '';
  position: absolute;
  top: 8px;
  left: 20px;
  right: 20px;
  height: 2px;
  background-color: $color-gray-300;
  z-index: 0;
}

.progress-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-sm;
  position: relative;
  z-index: 1;
}

.step-dot {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: $color-gray-300;
  display: flex;
  align-items: center;
  justify-content: center;

  .completed & {
    background-color: $color-primary;
  }

  .active & {
    background-color: $color-primary;
    box-shadow: 0 0 0 4px rgba($color-primary, 0.2);
  }
}

.check-icon {
  color: $color-white;
  font-size: 10px;
  font-weight: bold;
}

.step-label {
  font-size: 12px;
  color: $color-gray-500;

  .active &,
  .completed & {
    color: $color-primary;
  }
}

// 订单信息
.order-info {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-label {
  font-size: 14px;
  color: $color-gray-600;
}

.info-value {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
}

.order-no {
  font-size: 14px;
  color: $color-text-primary;
  font-family: monospace;
}

.copy-btn {
  font-size: 12px;
  color: $color-primary;
  padding: 2px 8px;
  border: 1px solid $color-primary;
  border-radius: $border-radius-tag;
}

// 位置信息
.location-section {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
}

.location-header {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
}

.location-icon {
  font-size: 16px;
}

.location-title {
  font-size: 14px;
  font-weight: 500;
  color: $color-text-primary;
}

.location-detail {
  margin-left: 24px;
}

.location-name {
  font-size: 14px;
  font-weight: 500;
  color: $color-text-primary;
  display: block;
  margin-bottom: 2px;
}

.location-address {
  font-size: 12px;
  color: $color-gray-500;
}

.pickup-time {
  margin-left: 24px;
  margin-top: $spacing-sm;
  padding-top: $spacing-sm;
  border-top: 1px dashed $color-gray-300;
}

.time-label {
  font-size: 14px;
  color: $color-gray-600;
}

.time-value {
  font-size: 14px;
  font-weight: 500;
  color: $color-primary;
}

// 商品清单
.items-section {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
}

.section-title {
  font-size: 14px;
  font-weight: bold;
  color: $color-text-primary;
  display: block;
  margin-bottom: $spacing-sm;
}

.order-items {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
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

.item-price {
  font-size: 14px;
  color: $color-text-primary;
}

// 价格明细
.price-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price-label {
  font-size: 14px;
  color: $color-gray-600;
}

.price-value {
  font-size: 14px;
  color: $color-text-primary;
}

.price-value.discount {
  color: $color-error;
}

.total-row {
  padding-top: $spacing-sm;
  border-top: 1px solid $color-gray-200;
  margin-top: $spacing-sm;
}

.total-price {
  font-size: 18px;
  font-weight: bold;
  color: $color-primary;
}

// 底部栏
.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: $color-white;
  border-top: 1px solid $color-gray-200;
  padding: $spacing-md $spacing-page;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: calc($spacing-md + env(safe-area-inset-bottom));
}

.action-left {
  flex: 1;
}

.contact-btn {
  font-size: 14px;
  color: $color-gray-600;
}

.action-right {
  display: flex;
  gap: $spacing-md;
}

.btn-outline,
.btn-primary {
  padding: 8px 20px;
  border-radius: $border-radius-button;
  font-size: 14px;
}

.btn-outline {
  border: 1px solid $color-gray-400;
  color: $color-text-primary;
}

.btn-primary {
  background-color: $color-primary;
  color: $color-white;
}
</style>