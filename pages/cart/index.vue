<template>
  <view class="page">
    <navbar title="购物车" :showBack="false">
      <template #right>
        <text class="edit-btn" @click="toggleEdit">{{ isEditing ? '完成' : '管理' }}</text>
      </template>
    </navbar>

    <!-- 取餐方式切换 -->
    <view class="delivery-type-card">
      <view
        class="type-option"
        :class="{ active: deliveryType === 'pickup' }"
        @click="setDeliveryType('pickup')"
      >
        <view class="radio">
          <view class="radio-inner" v-if="deliveryType === 'pickup'"></view>
        </view>
        <text class="type-label">🏪 到店自提</text>
      </view>
      <view
        class="type-option"
        :class="{ active: deliveryType === 'delivery' }"
        @click="setDeliveryType('delivery')"
      >
        <view class="radio">
          <view class="radio-inner" v-if="deliveryType === 'delivery'"></view>
        </view>
        <text class="type-label">🚚 外卖配送</text>
      </view>
    </view>

    <!-- 门店信息 -->
    <view class="store-card">
      <text class="store-icon">📍</text>
      <view class="store-info">
        <text class="store-name">门店：Dearie Bread 旗舰店</text>
        <text class="store-distance">距您约500米</text>
      </view>
    </view>

    <!-- 购物车商品列表 -->
    <view class="cart-list">
      <view
        v-for="item in cartItems"
        :key="item.id"
        class="cart-item"
      >
        <!-- 选择框 -->
        <view class="item-checkbox" @click="toggleItem(item.id)">
          <view class="checkbox" :class="{ checked: item.checked }">
            <text v-if="item.checked" class="check-icon">✓</text>
          </view>
        </view>

        <!-- 商品图片 -->
        <image class="item-image" :src="item.image" mode="aspectFill" />

        <!-- 商品信息 -->
        <view class="item-info">
          <text class="item-name">{{ item.name }}</text>
          <text class="item-price">¥{{ item.price }}</text>
          <view class="item-control">
            <text class="qty-btn" @click="updateQuantity(item.id, -1)">-</text>
            <text class="qty-value">{{ item.quantity }}</text>
            <text class="qty-btn" @click="updateQuantity(item.id, 1)">+</text>
            <text v-if="isEditing" class="delete-btn" @click="removeItem(item.id)">🗑</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 优惠券 -->
    <view class="coupon-card">
      <text class="coupon-label">优惠券</text>
      <view class="coupon-value">
        <text class="coupon-text">已选：满50减10</text>
        <text class="coupon-discount">[已优惠¥{{ discount }}]</text>
      </view>
    </view>

    <!-- 价格明细 -->
    <view class="price-detail-card">
      <text class="detail-title">价格明细</text>
      <view class="detail-row">
        <text class="detail-label">商品总价：</text>
        <text class="detail-value">¥{{ totalPrice.toFixed(2) }}</text>
      </view>
      <view class="detail-row">
        <text class="detail-label">优惠：</text>
        <text class="detail-value error">-¥{{ discount.toFixed(2) }}</text>
      </view>
      <view class="detail-row">
        <text class="detail-label">运费：</text>
        <text class="detail-value">¥0</text>
      </view>
      <view class="detail-row total-row">
        <text class="detail-label">应付：</text>
        <text class="total-price">¥{{ finalPrice.toFixed(2) }}</text>
      </view>
    </view>

    <!-- 底部结算栏 -->
    <view class="bottom-bar">
      <view class="select-all" @click="toggleAll">
        <view class="checkbox" :class="{ checked: isAllSelected }">
          <text v-if="isAllSelected" class="check-icon">✓</text>
        </view>
        <text class="select-label">全选</text>
        <text class="selected-count">已选{{ selectedCount }}件</text>
      </view>
      <view class="checkout-btn" @click="goCheckout">去结算</view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import navbar from '@/components/navbar.vue'
import { getCartList, updateCartItem, removeFromCart } from '@/api/cart.js'

// 取餐方式
const deliveryType = ref('pickup')

// 编辑状态
const isEditing = ref(false)

// 购物车商品
const cartItems = ref([])

// 加载状态
const isLoading = ref(false)

// 优惠金额
const discount = 10

// 已选商品
const selectedItems = computed(() => cartItems.value.filter((item) => item.checked))

// 总价
const totalPrice = computed(() =>
  selectedItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
)

// 最终价格
const finalPrice = computed(() => totalPrice.value - discount)

// 是否全选
const isAllSelected = computed(() =>
  cartItems.value.length > 0 && cartItems.value.every((item) => item.checked)
)

// 已选数量
const selectedCount = computed(() => selectedItems.value.length)

// 获取真实 API 数据
onMounted(async () => {
  isLoading.value = true
  try {
    const res = await getCartList()
    if (res.code === 0) {
      cartItems.value = (res.data || []).map((item) => ({ ...item, checked: true }))
    }
  } catch (e) {
    // 降级到 mock 数据
    cartItems.value = [
      { id: 1, name: '手撕包', price: 28, quantity: 2, image: '/static/images/product1.png', checked: true },
      { id: 2, name: '全麦吐司', price: 22, quantity: 1, image: '/static/images/product2.png', checked: true },
    ]
  } finally {
    isLoading.value = false
  }
})

function setDeliveryType(type) {
  deliveryType.value = type
}

function toggleEdit() {
  isEditing.value = !isEditing.value
}

function toggleItem(id) {
  const item = cartItems.value.find((i) => i.id === id)
  if (item) {
    item.checked = !item.checked
  }
}

function toggleAll() {
  const allChecked = isAllSelected.value
  cartItems.value.forEach((item) => {
    item.checked = !allChecked
  })
}

function updateQuantity(id, delta) {
  const item = cartItems.value.find((i) => i.id === id)
  if (!item) return
  const newQty = Math.max(1, item.quantity + delta)
  const oldQty = item.quantity
  // Optimistic update
  item.quantity = newQty

  updateCartItem({ id, quantity: newQty }).catch(() => {
    // Rollback on failure
    item.quantity = oldQty
    uni.showToast({ title: '更新失败', icon: 'none' })
  })
}

function removeItem(id) {
  const index = cartItems.value.findIndex((i) => i.id === id)
  if (index === -1) return
  // Snapshot for rollback
  const removed = cartItems.value[index]
  // Optimistic remove
  cartItems.value.splice(index, 1)

  removeFromCart(id).catch(() => {
    // Rollback
    cartItems.value.splice(index, 0, removed)
    uni.showToast({ title: '删除失败', icon: 'none' })
  })
}

function goCheckout() {
  if (selectedItems.value.length === 0) {
    uni.showToast({ title: '请选择商品', icon: 'none' })
    return
  }
  uni.navigateTo({ url: '/pages/checkout/index' })
}
</script>

<style lang="scss" scoped>
@import '@/uni.scss';

.page {
  min-height: 100vh;
  background-color: $color-background;
  padding-bottom: calc(60px + env(safe-area-inset-bottom));
}

.edit-btn {
  font-size: 14px;
  color: $color-white;
}

// 取餐方式卡片
.delivery-type-card {
  display: flex;
  gap: $spacing-xl;
  background-color: $color-white;
  margin: $spacing-md $spacing-page;
  padding: $spacing-md;
  border-radius: $border-radius-card;
}

.type-option {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
}

.radio {
  width: 18px;
  height: 18px;
  border: 2px solid $color-gray-400;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.radio-inner {
  width: 10px;
  height: 10px;
  background-color: $color-primary;
  border-radius: 50%;
}

.type-label {
  font-size: 14px;
  color: $color-text-primary;
}

// 门店卡片
.store-card {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  background-color: $color-white;
  margin: 0 $spacing-page $spacing-md;
  padding: $spacing-md;
  border-radius: $border-radius-card;
}

.store-icon {
  font-size: 16px;
}

.store-info {
  flex: 1;
}

.store-name {
  font-size: 14px;
  font-weight: 500;
  color: $color-text-primary;
  display: block;
  margin-bottom: 2px;
}

.store-distance {
  font-size: 12px;
  color: $color-gray-500;
}

// 购物车列表
.cart-list {
  padding: 0 $spacing-page;
}

.cart-item {
  display: flex;
  align-items: flex-start;
  gap: $spacing-md;
  background-color: $color-white;
  margin-bottom: $spacing-md;
  padding: $spacing-md;
  border-radius: $border-radius-card;
}

.item-checkbox {
  padding-top: 40px;
}

.checkbox {
  width: 20px;
  height: 20px;
  border: 2px solid $color-gray-400;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;

  &.checked {
    background-color: $color-primary;
    border-color: $color-primary;
  }
}

.check-icon {
  color: $color-white;
  font-size: 12px;
  font-weight: bold;
}

.item-image {
  width: 80px;
  height: 80px;
  border-radius: $border-radius-card;
}

.item-info {
  flex: 1;
}

.item-name {
  font-size: 14px;
  color: $color-text-primary;
  display: block;
  margin-bottom: 4px;
}

.item-price {
  font-size: 14px;
  font-weight: bold;
  color: $color-primary;
  display: block;
  margin-bottom: $spacing-sm;
}

.item-control {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
}

.qty-btn {
  width: 24px;
  height: 24px;
  background-color: $color-secondary;
  text-align: center;
  line-height: 24px;
  border-radius: $border-radius-button;
  font-size: 14px;
}

.qty-value {
  font-size: 14px;
  width: 24px;
  text-align: center;
}

.delete-btn {
  margin-left: auto;
  font-size: 16px;
}

// 优惠券卡片
.coupon-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: $color-white;
  margin: 0 $spacing-page $spacing-md;
  padding: $spacing-md;
  border-radius: $border-radius-card;
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

.coupon-text {
  font-size: 14px;
  color: $color-primary;
}

.coupon-discount {
  font-size: 12px;
  color: $color-error;
}

// 价格明细卡片
.price-detail-card {
  background-color: $color-white;
  margin: 0 $spacing-page;
  padding: $spacing-md;
  border-radius: $border-radius-card;
}

.detail-title {
  font-size: 14px;
  font-weight: bold;
  color: $color-text-primary;
  display: block;
  margin-bottom: $spacing-sm;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}

.detail-label {
  font-size: 14px;
  color: $color-gray-600;
}

.detail-value {
  font-size: 14px;
  color: $color-text-primary;
}

.detail-value.error {
  color: $color-error;
}

.total-row {
  padding-top: $spacing-sm;
  border-top: 1px solid $color-gray-200;
}

.total-price {
  font-size: 18px;
  font-weight: bold;
  color: $color-primary;
}

// 底部结算栏
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

.select-all {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
}

.select-label {
  font-size: 14px;
  color: $color-text-primary;
}

.selected-count {
  font-size: 12px;
  color: $color-gray-500;
  margin-left: $spacing-sm;
}

.checkout-btn {
  background-color: $color-primary;
  color: $color-white;
  padding: 10px 24px;
  border-radius: $border-radius-button;
  font-size: 14px;
  font-weight: 500;
}
</style>