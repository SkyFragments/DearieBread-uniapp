<template>
  <view class="navbar" :style="{ paddingTop: statusBarHeight + 'px' }">
    <view class="navbar-content">
      <view class="navbar-left" v-if="showBack" @click="handleBack">
        <text class="back-icon">←</text>
      </view>
      <view class="navbar-title">
        <text class="title-text">{{ title }}</text>
      </view>
      <view class="navbar-right">
        <slot name="right">{{ rightContent }}</slot>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  showBack: {
    type: Boolean,
    default: false
  },
  rightContent: {
    type: String,
    default: ''
  }
})

// 获取状态栏高度
const statusBarHeight = ref(0)
uni.getSystemInfo({
  success: (res) => {
    statusBarHeight.value = res.statusBarHeight || 0
  }
})

const emit = defineEmits(['back'])

function handleBack() {
  emit('back')
  uni.navigateBack()
}
</script>

<style lang="scss" scoped>
@import '@/uni.scss';

.navbar {
  background-color: $color-accent;
  color: $color-white;
}

.navbar-content {
  display: flex;
  align-items: center;
  height: 44px;
  padding: 0 $spacing-page;
}

.navbar-left {
  width: 60px;
  display: flex;
  align-items: center;
}

.back-icon {
  font-size: 20px;
  font-weight: bold;
}

.navbar-title {
  flex: 1;
  text-align: center;
}

.title-text {
  font-size: 17px;
  font-weight: 500;
}

.navbar-right {
  width: 60px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>