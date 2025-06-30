<!--
 * @Author: tzq
 * @Date: 2024-01-09 19:01:27
 * @LastEditors: tzq
 * @LastEditTime: 2024-01-09 19:42:11
 * @FilePath: \web\src\components\Screenfull\index.vue
 * @Description: 
 * Copyright (c) 2024 by tzq/exsun, All Rights Reserved. 
-->
<template>
  <div>
    <svg-icon :icon-class="isFullscreen ? 'exit-fullscreen' : 'fullscreen'" @click="toggle" />
  </div>
</template>

<script setup>
import { useFullscreen } from '@vueuse/core'

const { isFullscreen, enter, exit, toggle } = useFullscreen();
</script>

<style lang='scss' scoped>
.screenfull-svg {
  display: inline-block;
  cursor: pointer;
  fill: #5a5e66;
  width: 20px;
  height: 20px;
  vertical-align: 10px;
}
.svg-icon {
  color: #d9dee8;
}
</style>