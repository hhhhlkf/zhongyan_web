<!--
 * @Author: pmy
 * @Date: 2023-08-11 09:10:42
 * @LastEditors: pmy
 * @LastEditTime: 2023-09-18 17:41:48
 * @FilePath: \bdcar-net\src\layout\components\IframeToggle\index.vue
 * @Description: 
 * Copyright (c) 2023 by pmy/exsun, All Rights Reserved. 
-->
<template>
  <transition-group name="fade-transform" mode="out-in">
    <inner-link v-for="(item, index) in tagsViewStore.iframeViews" :key="item.path" :iframeId="'iframe' + index"
      v-show="route.path === item.path" :src="item.meta.link"></inner-link>
  </transition-group>
</template>

<script setup>
import InnerLink from "../InnerLink/index"
import useTagsViewStore from '@/store/modules/tagsView'

const route = useRoute();
const tagsViewStore = useTagsViewStore()
</script>
