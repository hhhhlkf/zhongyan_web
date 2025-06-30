<!--
 * @Author: pmy
 * @Date: 2023-08-11 09:10:42
 * @LastEditors: tzq
 * @LastEditTime: 2024-01-09 19:37:54
 * @FilePath: \web\src\layout\components\Sidebar\Logo.vue
 * @Description: 
 * Copyright (c) 2023 by pmy/exsun, All Rights Reserved. 
-->
<template>
  <div class="sidebar-logo-container">
    <transition name="sidebarLogoFade">
      <router-link class="sidebar-logo-link" to="/bigScreen">
        <img v-if="logoSrc" :src="logoSrc" class="sidebar-logo" />
        <h1 class="sidebar-title"
          :style="{ color: sideTheme === 'theme-dark' ? variables.logoTitleColor : variables.logoLightTitleColor }">{{
            title }}</h1>
      </router-link>
    </transition>
  </div>
</template>

<script setup>
import variables from '@/assets/styles/variables.module.scss'
import logo from '@/assets/logo/logo.png'
import useSettingsStore from '@/store/modules/settings'
import useUserStore from '@/store/modules/user'

const info = useUserStore().info;

const title = ref(import.meta.env.VITE_APP_TITLE);
const settingsStore = useSettingsStore();
const sideTheme = computed(() => settingsStore.sideTheme);

const logoSrc = ref(logo);
watchEffect(() => {
  const picture = info.dept.picture;
  const bool = picture && picture[0]
  if (bool) {
    logoSrc.value = import.meta.env.VITE_APP_BASE_API + picture[0].path
  }
})
</script>
<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: max-content;
  height: 50px;
  line-height: 50px;
  // background: #2b2f3a;
  text-align: center;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      width: 32px;
      height: 32px;
      vertical-align: middle;
      margin-right: 12px;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #fff;
      font-weight: 600;
      line-height: 50px;
      font-size: 21px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }

    @media (max-width: 750px) {
      .sidebar-title {
        display: none;
      }
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>