<template>
  <view class="product-card" @click="handleClick">
    <image class="product-image" :src="image" mode="aspectFill" />
    <view class="product-info">
      <text class="product-name">{{ name }}</text>
      <view class="price-row">
        <text class="price">¥{{ price }}</text>
        <text v-if="originalPrice" class="original-price">¥{{ originalPrice }}</text>
      </view>
      <view v-if="tags && tags.length > 0" class="tag-row">
        <text
          v-for="tag in tags"
          :key="tag"
          class="tag"
          :class="tagClass(tag)"
        >{{ tagLabel(tag) }}</text>
      </view>
    </view>
    <view class="add-cart-btn" @click.stop="handleAddCart">+ 加入购物车</view>
  </view>
</template>

<script setup>
const props = defineProps({
  name: String,
  price: Number,
  originalPrice: Number,
  image: String,
  tags: {
    type: Array,
    default: () => []
  },
  onAddCart: Function,
  onClick: Function,
})

const tagLabels = {
  'low-carb': '低卡',
  'sugar-free': '无糖',
  'whole-grain': '全麦',
  'high-protein': '高蛋白',
  'gluten-free': '无麸质',
}

const tagColors = {
  'low-carb': 'primary',
  'sugar-free': 'warning',
  'whole-grain': 'accent',
  'high-protein': 'success',
  'gluten-free': 'purple',
}

function tagLabel(tag) {
  return tagLabels[tag] || tag
}

function tagClass(tag) {
  return `tag-${tagColors[tag] || 'primary'}`
}

function handleAddCart() {
  props.onAddCart?.()
}

function handleClick() {
  props.onClick?.()
}
</script>

<style lang="scss" scoped>
@import '@/uni.scss';

.product-card {
  background-color: $color-white;
  border-radius: $border-radius-card;
  padding: $spacing-sm;
  box-shadow: $shadow-sm;
}

.product-image {
  width: 100%;
  height: 120px;
  border-radius: $border-radius-card;
}

.product-info {
  margin-top: $spacing-sm;
}

.product-name {
  font-size: 14px;
  color: $color-text-primary;
  display: block;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.price-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.price {
  font-size: 16px;
  font-weight: bold;
  color: $color-primary;
}

.original-price {
  font-size: 12px;
  color: $color-gray-500;
  text-decoration: line-through;
}

.tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 8px;
}

.tag {
  font-size: 10px;
  padding: 2px 6px;
  border-radius: $border-radius-tag;
  color: $color-white;
}

.tag-primary { background-color: $color-primary; }
.tag-warning { background-color: $color-warning; }
.tag-accent { background-color: $color-accent; }
.tag-success { background-color: $color-success; }
.tag-purple { background-color: $color-purple; }

.add-cart-btn {
  background-color: $color-primary;
  color: $color-white;
  text-align: center;
  padding: 8px 0;
  border-radius: $border-radius-button;
  font-size: 12px;
}
</style>