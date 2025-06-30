<!--
 * @Author: pmy
 * @Date: 2021-11-30 11:14:48
 * @LastEditors: pmy
 * @LastEditTime: 2023-10-13 10:48:16
 * @FilePath: \bdcar-net\src\App.vue
 * @Description: 
 * Copyright (c) 2023 by pmy/exsun, All Rights Reserved. 
-->
<template>
  <router-view />
</template>

<script setup>
import useSettingsStore from '@/store/modules/settings'
import { handleThemeStyle } from '@/utils/theme'
onMounted(() => {
  nextTick(() => {
    // 初始化主题样式
    handleThemeStyle(useSettingsStore().theme);
  })
})
</script>
