<!--
 * @Author: tzq
 * @Date: 2023-10-27 15:20:21
 * @LastEditors: tzq
 * @LastEditTime: 2024-01-09 20:01:56
 * @FilePath: \web\src\layout\components\Sidebar\index.vue
 * @Description: 
 * Copyright (c) 2024 by tzq/exsun, All Rights Reserved. 
-->
<template>
  <div
    :style="{ backgroundColor: sideTheme === 'theme-dark' ? variables.menuBackground : variables.menuLightBackground }">
    <el-scrollbar :class="sideTheme" wrap-class="scrollbar-wrapper">
      <el-menu :default-active="activeMenu" :collapse="isCollapse"
        :background-color="sideTheme === 'theme-dark' ? variables.menuBackground : variables.menuLightBackground"
        :text-color="sideTheme === 'theme-dark' ? variables.menuColor : variables.menuLightColor" :unique-opened="true"
        :active-text-color="theme" :collapse-transition="false" mode="vertical">
        <sidebar-item v-for="(route, index) in sidebarRouters" :key="route.path + index" :item="route"
          :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
    <hamburger id="hamburger-container" :is-active="appStore.sidebar.opened" class="hamburger-container"
      @toggleClick="toggleSideBar" />
  </div>
</template>

<script setup>
import SidebarItem from './SidebarItem'
import Hamburger from '@/components/Hamburger'
import variables from '@/assets/styles/variables.module.scss'
import useAppStore from '@/store/modules/app'
import useSettingsStore from '@/store/modules/settings'
import usePermissionStore from '@/store/modules/permission'

const route = useRoute();
const appStore = useAppStore()
const settingsStore = useSettingsStore()
const permissionStore = usePermissionStore()

const sidebarRouters = computed(() => permissionStore.sidebarRouters);

const sideTheme = computed(() => settingsStore.sideTheme);
const theme = computed(() => settingsStore.theme);
const isCollapse = computed(() => !appStore.sidebar.opened);

const activeMenu = computed(() => {
  const { meta, path } = route;
  // if set path, the sidebar will highlight the path you set
  if (meta.activeMenu) {
    return meta.activeMenu;
  }
  return path;
})
function toggleSideBar() {
  appStore.toggleSideBar()
}
</script>
<style lang='scss' scoped>
.hamburger-container {
  cursor: pointer;
  transition: background 0.3s;
  -webkit-tap-highlight-color: transparent;
  display: flex;
  align-items: center;
  border-top: 1px solid rgba(255, 255, 255, .2);
}
</style>