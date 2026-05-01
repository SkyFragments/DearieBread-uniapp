<template>
  <view class="page">
    <navbar title="收银台" :showBack="true" @back="handleBack" />

    <!-- 订单金额 -->
    <view class="amount-card">
      <text class="amount-label">实付金额</text>
      <text class="amount-value">¥{{ orderAmount.toFixed(2) }}</text>
      <text class="amount-desc">订单号：{{ orderNo }}</text>
    </view>

    <!-- 支付方式 -->
    <view class="payment-section">
      <text class="section-title">选择支付方式</text>

      <view class="payment-list">
        <view
          v-for="method in paymentMethods"
          :key="method.id"
          class="payment-item"
          :class="{ active: selectedMethod === method.id }"
          @click="onSelectMethod(method.id)"
        >
          <view class="payment-left">
            <text class="payment-icon">{{ method.icon }}</text>
            <view class="payment-info">
              <text class="payment-name">{{ method.name }}</text>
              <text class="payment-desc">{{ method.desc }}</text>
            </view>
          </view>
          <view class="payment-check">
            <view v-if="selectedMethod === method.id" class="check-inner"></view>
          </view>
        </view>
      </view>
    </view>

    <!-- 温馨提示 -->
    <view class="tips-section">
      <text class="tips-title">温馨提示</text>
      <view class="tips-list">
        <text class="tips-item">• 请在15分钟内完成支付，超时订单将自动取消</text>
        <text class="tips-item">• 支付成功后，预计10:45可取餐</text>
        <text class="tips-item">• 如有疑问，请联系客服：400-888-9999</text>
      </view>
    </view>

    <!-- 底部支付按钮 -->
    <view class="bottom-bar">
      <view class="pay-btn" :class="{ disabled: isProcessing }" @click="onConfirmPay">
        <text v-if="isProcessing" class="btn-loading">支付中...</text>
        <text v-else>确认支付 ¥{{ orderAmount.toFixed(2) }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import navbar from '@/components/navbar.vue'

// 获取页面参数
const pageOptions = uni.getPageOptions()
const orderId = pageOptions?.id || ''

// 模拟订单数据
const orderNo = ref('ORD' + Date.now().toString().slice(-10))
const orderAmount = ref(68.00)
const isProcessing = ref(false)

// 支付方式
const paymentMethods = [
  { id: 'wechat', name: '微信支付', desc: '推荐', icon: '💳' },
  { id: 'alipay', name: '支付宝', desc: '', icon: '💰' },
  { id: 'balance', name: '余额支付', desc: '账户余额：¥88.50', icon: '🏦' },
]

const selectedMethod = ref('wechat')

function handleBack() {
  uni.showModal({
    title: '确认离开？',
    content: '支付完成后订单将自动创建',
    confirmColor: '#D4A574',
    success: (res) => {
      if (res.confirm) {
        uni.navigateBack()
      }
    },
  })
}

function onSelectMethod(methodId) {
  selectedMethod.value = methodId
}

function onConfirmPay() {
  if (isProcessing.value) return

  isProcessing.value = true

  // 模拟支付过程
  setTimeout(() => {
    isProcessing.value = false
    uni.showToast({ title: '支付成功', icon: 'success' })

    // 跳转到订单追踪页
    setTimeout(() => {
      uni.redirectTo({ url: `/pages/orderTracking/index?id=${orderId || 'new'}` })
    }, 1500)
  }, 2000)
}
</script>

<style lang="scss" scoped>
@import '@/uni.scss';

.page {
  min-height: 100vh;
  background-color: $color-background;
  padding-bottom: calc(80px + env(safe-area-inset-bottom));
}

// 金额卡片
.amount-card {
  background-color: $color-white;
  margin: $spacing-md $spacing-page;
  padding: $spacing-lg;
  border-radius: $border-radius-card;
  text-align: center;
}

.amount-label {
  font-size: 14px;
  color: $color-gray-600;
  display: block;
  margin-bottom: $spacing-sm;
}

.amount-value {
  font-size: 36px;
  font-weight: bold;
  color: $color-primary;
  display: block;
  margin-bottom: $spacing-sm;
}

.amount-desc {
  font-size: 12px;
  color: $color-gray-500;
}

// 支付方式
.payment-section {
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

.payment-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.payment-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $spacing-md;
  border: 1px solid $color-gray-200;
  border-radius: $border-radius-card;
  transition: all 0.2s;

  &.active {
    border-color: $color-primary;
    background-color: rgba($color-primary, 0.05);
  }
}

.payment-left {
  display: flex;
  align-items: center;
  gap: $spacing-md;
}

.payment-icon {
  font-size: 24px;
}

.payment-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.payment-name {
  font-size: 14px;
  font-weight: 500;
  color: $color-text-primary;
}

.payment-desc {
  font-size: 12px;
  color: $color-gray-500;
}

.payment-check {
  width: 20px;
  height: 20px;
  border: 2px solid $color-gray-400;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  .active & {
    border-color: $color-primary;
  }
}

.check-inner {
  width: 12px;
  height: 12px;
  background-color: $color-primary;
  border-radius: 50%;
}

// 温馨提示
.tips-section {
  background-color: $color-white;
  margin: 0 $spacing-page;
  padding: $spacing-md;
  border-radius: $border-radius-card;
}

.tips-title {
  font-size: 14px;
  font-weight: bold;
  color: $color-text-primary;
  display: block;
  margin-bottom: $spacing-sm;
}

.tips-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.tips-item {
  font-size: 12px;
  color: $color-gray-500;
  line-height: 1.6;
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
  padding-bottom: calc($spacing-md + env(safe-area-inset-bottom));
}

.pay-btn {
  background-color: $color-primary;
  color: $color-white;
  text-align: center;
  padding: 14px 0;
  border-radius: $border-radius-button;
  font-size: 16px;
  font-weight: bold;

  &.disabled {
    opacity: 0.6;
  }
}

.btn-loading {
  font-size: 14px;
}
</style>