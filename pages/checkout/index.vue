<template>
  <view class="page">
    <navbar title="订单确认" :showBack="true" @back="handleBack" />

    <!-- 取餐方式 -->
    <view class="section delivery-section">
      <text class="section-title">取餐方式</text>
      <view class="delivery-options">
        <view
          class="delivery-option"
          :class="{ active: deliveryType === 'pickup' }"
          @click="setDeliveryType('pickup')"
        >
          <text class="option-icon">🏪</text>
          <view class="option-info">
            <text class="option-name">到店自提</text>
            <text class="option-desc">到店取餐，无需等待配送</text>
          </view>
          <view class="radio">
            <view class="radio-inner" v-if="deliveryType === 'pickup'"></view>
          </view>
        </view>
        <view
          class="delivery-option"
          :class="{ active: deliveryType === 'delivery' }"
          @click="setDeliveryType('delivery')"
        >
          <text class="option-icon">🚚</text>
          <view class="option-info">
            <text class="option-name">外卖配送</text>
            <text class="option-desc">送货上门，配送费¥0</text>
          </view>
          <view class="radio">
            <view class="radio-inner" v-if="deliveryType === 'delivery'"></view>
          </view>
        </view>
      </view>
    </view>

    <!-- 门店信息 -->
    <view class="section store-section">
      <view class="store-header">
        <text class="store-icon">📍</text>
        <text class="store-name">Dearie Bread 旗舰店</text>
      </view>
      <text class="store-address">朝阳区建国路88号SOHO现代城1层</text>
      <text class="store-hours">营业时间：08:00-22:00</text>
    </view>

    <!-- 配送地址（仅外卖） -->
    <view v-if="deliveryType === 'delivery'" class="section address-section">
      <view class="address-header">
        <text class="section-title">配送地址</text>
        <text class="change-btn" @click="onChangeAddress">修改</text>
      </view>
      <view class="address-card">
        <text class="address-name">张小姐  138****8888</text>
        <text class="address-detail">朝阳区建国路88号SOHO现代城3号楼1201</text>
      </view>
    </view>

    <!-- 预计时间 -->
    <view class="section time-section">
      <text class="section-title">预计可取餐时间</text>
      <view class="time-options">
        <view
          v-for="time in pickupTimes"
          :key="time.value"
          class="time-option"
          :class="{ active: selectedTime === time.value }"
          @click="selectedTime = time.value"
        >
          <text class="time-value">{{ time.label }}</text>
          <text class="time-desc">{{ time.desc }}</text>
        </view>
      </view>
    </view>

    <!-- 商品清单 -->
    <view class="section items-section">
      <text class="section-title">订单商品</text>
      <view class="order-items">
        <view
          v-for="item in orderItems"
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

    <!-- 备注 -->
    <view class="section remark-section">
      <text class="remark-label">订单备注</text>
      <input
        class="remark-input"
        placeholder="如：少糖、不要辣等特殊要求"
        v-model="remark"
      />
    </view>

    <!-- 优惠信息 -->
    <view class="section coupon-section">
      <view class="coupon-row" @click="onSelectCoupon">
        <text class="coupon-label">使用优惠券</text>
        <view class="coupon-value">
          <text class="coupon-name">{{ selectedCoupon ? selectedCoupon.name : '暂无可用' }}</text>
          <text class="arrow">›</text>
        </view>
      </view>
      <view class="coupon-row">
        <text class="coupon-label">使用积分</text>
        <view class="coupon-value">
          <text class="points-value">可用{{ availablePoints }}积分抵¥{{ pointsDiscount }}</text>
          <switch
            :checked="usePoints"
            @change="onTogglePoints"
            color="#D4A574"
            size="small"
          />
        </view>
      </view>
    </view>

    <!-- 价格明细 -->
    <view class="section price-section">
      <view class="price-row">
        <text class="price-label">商品总价</text>
        <text class="price-value">¥{{ totalPrice.toFixed(2) }}</text>
      </view>
      <view class="price-row">
        <text class="price-label">优惠金额</text>
        <text class="price-value discount">-¥{{ totalDiscount.toFixed(2) }}</text>
      </view>
      <view class="price-row">
        <text class="price-label">配送费</text>
        <text class="price-value">¥0</text>
      </view>
      <view class="price-row total-row">
        <text class="price-label">合计</text>
        <text class="total-price">¥{{ finalPrice.toFixed(2) }}</text>
      </view>
    </view>

    <!-- 底部提交栏 -->
    <view class="bottom-bar">
      <view class="total-info">
        <text class="total-label">实付</text>
        <text class="total-amount">¥{{ finalPrice.toFixed(2) }}</text>
      </view>
      <view class="submit-btn" @click="onSubmitOrder">
        <text>提交订单</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import navbar from '@/components/navbar.vue'

// 取餐方式
const deliveryType = ref('pickup')
const selectedTime = ref('asap')
const remark = ref('')
const usePoints = ref(false)

// 订单商品（mock数据，应从购物车或商品详情传入）
const orderItems = ref([
  { id: 1, name: '手撕包', price: 28, quantity: 2, image: '/static/images/product1.png' },
  { id: 2, name: '全麦吐司', price: 22, quantity: 1, image: '/static/images/product2.png' },
])

// 可用优惠券（mock）
const availableCoupon = ref({ id: 1, name: '满50减10', discount: 10 })
const selectedCoupon = ref(null)

// 积分信息
const availablePoints = ref(500)
const pointsDiscount = computed(() => (availablePoints.value / 100).toFixed(2))

// 取餐时间选项
const pickupTimes = [
  { value: 'asap', label: '立即取餐', desc: '约15分钟后' },
  { value: '30min', label: '30分钟后', desc: '预计10:30可取' },
  { value: '1hour', label: '1小时后', desc: '预计11:00可取' },
  { value: '2hour', label: '2小时后', desc: '预计12:00可取' },
]

// 计算价格
const totalPrice = computed(() =>
  orderItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
)

const totalDiscount = computed(() => {
  let discount = 0
  if (selectedCoupon.value) {
    discount += selectedCoupon.value.discount
  }
  if (usePoints.value) {
    discount += parseFloat(pointsDiscount.value)
  }
  return discount
})

const finalPrice = computed(() => Math.max(0, totalPrice.value - totalDiscount.value))

function setDeliveryType(type) {
  deliveryType.value = type
}

function handleBack() {
  uni.navigateBack()
}

function onChangeAddress() {
  uni.showToast({ title: '地址选择开发中', icon: 'none' })
}

function onSelectCoupon() {
  // TODO: 打开优惠券选择弹窗
  if (!selectedCoupon.value && availableCoupon.value) {
    selectedCoupon.value = availableCoupon.value
  } else {
    selectedCoupon.value = null
  }
}

function onTogglePoints(e) {
  usePoints.value = e.detail.value
}

function onSubmitOrder() {
  if (deliveryType.value === 'delivery' && !selectedTime.value) {
    uni.showToast({ title: '请选择取餐时间', icon: 'none' })
    return
  }

  // TODO: 调用创建订单API
  uni.showLoading({ title: '提交中...' })

  setTimeout(() => {
    uni.hideLoading()
    uni.showToast({ title: '订单提交成功', icon: 'success' })
    // 跳转到支付页面
    setTimeout(() => {
      uni.redirectTo({ url: '/pages/payment/index' })
    }, 1500)
  }, 1000)
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

.section-title {
  font-size: 14px;
  font-weight: bold;
  color: $color-text-primary;
  display: block;
  margin-bottom: $spacing-sm;
}

// 取餐方式
.delivery-options {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
}

.delivery-option {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  padding: $spacing-md;
  border: 1px solid $color-gray-300;
  border-radius: $border-radius-card;

  &.active {
    border-color: $color-primary;
    background-color: rgba($color-primary, 0.05);
  }
}

.option-icon {
  font-size: 24px;
}

.option-info {
  flex: 1;
}

.option-name {
  font-size: 14px;
  font-weight: 500;
  color: $color-text-primary;
  display: block;
  margin-bottom: 2px;
}

.option-desc {
  font-size: 12px;
  color: $color-gray-500;
}

.radio {
  width: 18px;
  height: 18px;
  border: 2px solid $color-gray-400;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  .active & {
    border-color: $color-primary;
  }
}

.radio-inner {
  width: 10px;
  height: 10px;
  background-color: $color-primary;
  border-radius: 50%;
}

// 门店信息
.store-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.store-header {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
}

.store-icon {
  font-size: 16px;
}

.store-name {
  font-size: 14px;
  font-weight: 500;
  color: $color-text-primary;
}

.store-address,
.store-hours {
  font-size: 12px;
  color: $color-gray-500;
  margin-left: 24px;
}

// 配送地址
.address-section {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
}

.address-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.change-btn {
  font-size: 14px;
  color: $color-primary;
}

.address-card {
  background-color: $color-gray-100;
  padding: $spacing-md;
  border-radius: $border-radius-input;
}

.address-name {
  font-size: 14px;
  font-weight: 500;
  color: $color-text-primary;
  display: block;
  margin-bottom: 4px;
}

.address-detail {
  font-size: 12px;
  color: $color-gray-600;
}

// 预计时间
.time-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: $spacing-sm;
}

.time-option {
  padding: $spacing-md;
  border: 1px solid $color-gray-300;
  border-radius: $border-radius-card;
  text-align: center;

  &.active {
    border-color: $color-primary;
    background-color: rgba($color-primary, 0.05);
  }
}

.time-value {
  font-size: 14px;
  font-weight: 500;
  color: $color-text-primary;
  display: block;
  margin-bottom: 2px;
}

.time-desc {
  font-size: 12px;
  color: $color-gray-500;
}

// 商品清单
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
  width: 60px;
  height: 60px;
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
  font-weight: 500;
  color: $color-text-primary;
}

// 备注
.remark-section {
  display: flex;
  align-items: center;
  gap: $spacing-md;
}

.remark-label {
  font-size: 14px;
  color: $color-text-primary;
  flex-shrink: 0;
}

.remark-input {
  flex: 1;
  font-size: 14px;
  color: $color-text-primary;
}

// 优惠
.coupon-section {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.coupon-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.coupon-label {
  font-size: 14px;
  color: $color-text-primary;
}

.coupon-value {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
}

.coupon-name {
  font-size: 14px;
  color: $color-primary;
}

.arrow {
  font-size: 16px;
  color: $color-gray-400;
}

.points-value {
  font-size: 14px;
  color: $color-gray-600;
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

.total-info {
  display: flex;
  align-items: baseline;
  gap: $spacing-sm;
}

.total-label {
  font-size: 14px;
  color: $color-gray-600;
}

.total-amount {
  font-size: 20px;
  font-weight: bold;
  color: $color-primary;
}

.submit-btn {
  background-color: $color-primary;
  color: $color-white;
  padding: 12px 32px;
  border-radius: $border-radius-button;
  font-size: 14px;
  font-weight: 500;
}
</style>