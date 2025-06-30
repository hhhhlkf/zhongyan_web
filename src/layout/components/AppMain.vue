<!--
 * @Author: pmy
 * @Date: 2023-08-11 09:10:42
 * @LastEditors: tzq
 * @LastEditTime: 2023-10-26 09:57:10
 * @FilePath: \bdcar-net\src\layout\components\AppMain.vue
 * @Description: 
 * Copyright (c) 2023 by pmy/exsun, All Rights Reserved. 
-->
<template>
  <section class="app-main">
    <router-view v-slot="{ Component, route }">
      <transition name="fade-transform" mode="out-in">
        <keep-alive :include="tagsViewStore.cachedViews">
          <component v-if="!route.meta.link" :is="Component" :key="route.path" />
        </keep-alive>
      </transition>
    </router-view>
    <iframe-toggle />
  </section>
</template>

<script setup>
import iframeToggle from "./IframeToggle/index"
import useTagsViewStore from '@/store/modules/tagsView'

const tagsViewStore = useTagsViewStore()
</script>

<style lang="scss" scoped>
.app-main {
  /* 60= navbar  60  */
  min-height: calc(100vh - 60px);
  width: 100%;
  position: relative;
  // overflow: hidden;
  background-color: #F1F6FA;
}

.fixed-header+.app-main {
  padding-top: 50px;
}

.hasTagsView {

  .fixed-header+.app-main {
    padding-top: 84px;
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 6px;
  }
}

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background-color: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background-color: #c0c0c0;
  border-radius: 3px;
}
</style>

