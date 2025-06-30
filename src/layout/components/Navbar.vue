<template>
  <div class="navbar" :style="{ backgroundImage: 'url(' + myRequire(headerBg) + ')' }">
    <logo v-if="showLogo" />

    <div class="right-menu">
      <template v-if="appStore.device !== 'mobile'">
        <!-- 系统监测数据 -->
        <div class="statistics-dom">
          <svg-icon class-name="size-icon" icon-class="onlineRate" />
          设备在线率：
          <span class="number-text">{{ appStore.statisticsData || deviceData?.statisticsData }}</span>
        </div>

        <header-search id="header-search" class="right-menu-item" />

        <el-tooltip content="布局大小" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect layout-size" />
        </el-tooltip>

        <el-tooltip content="大屏" effect="dark" placement="bottom">
          <div style="height: 100%;margin: 0 12px 0 2px;cursor: pointer;" @click="goToBigScreen">
            <svg-icon class-name="size-icon" icon-class="bigScreen" />
          </div>
        </el-tooltip>
      </template>
      <div class="avatar-container">
        <el-dropdown @command="handleCommand" class="right-menu-item hover-effect" trigger="click">
          <div class="avatar-wrapper">
            <img :src="userStore.avatar" class="user-avatar" />
            <span class="user-name">{{ userStore.info.nickName }}</span>
            <el-icon><caret-bottom /></el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <router-link to="/user/profile">
                <el-dropdown-item>个人中心</el-dropdown-item>
              </router-link>
              <el-dropdown-item command="setLayout">
                <span>布局设置</span>
              </el-dropdown-item>
              <el-dropdown-item divided command="logout">
                <span>退出登录</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <screenfull id="screenfull" class="right-menu-item hover-effect" />
    </div>
  </div>
</template>

<script setup>
import { ElMessageBox } from 'element-plus'
import Logo from './Sidebar/Logo'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import HeaderSearch from '@/components/HeaderSearch'
import useAppStore from '@/store/modules/app'
import useUserStore from '@/store/modules/user'
import useSettingsStore from '@/store/modules/settings'
const appStore = useAppStore()
const deviceData = JSON.parse(localStorage.getItem("deviceData")) || {};
const userStore = useUserStore()
const settingsStore = useSettingsStore()
function toggleSideBar() {
  appStore.toggleSideBar()
}
const showLogo = computed(() => settingsStore.sidebarLogo);
const headerBg = computed(() => settingsStore.headerBg);
function handleCommand(command) {
  switch (command) {
    case "basicSet":
      setBasic();
      break;
    case "setLayout":
      setLayout();
      break;
    case "logout":
      logout();
      break;
    default:
      break;
  }
}

function goToBigScreen() {
  // location.href = '/bigScreen'
  window.open('/bigScreen', '_blank');
}

function logout() {
  ElMessageBox.confirm('确定注销并退出系统吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    userStore.logOut().then(() => {
      location.href = '/index';
    })
  }).catch(() => { });
}

const emits = defineEmits(['setLayout', 'setBasic'])
function setBasic() {
  emits('setBasic');
}
function setLayout() {
  emits('setLayout');
}
function myRequire(str) {
  return new URL(`../../assets/img/bg${str}.png`, import.meta.url).href
}
const props = defineProps({
  alarmNum: {
    type: Number
  }
})
</script>

<style lang='scss' scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  background: url("../../assets/img/bg1.png") no-repeat center;
  background-size: 100% 100%;

  .hamburger-container {
    line-height: 57px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .topmenu-container {
    position: absolute;
    left: 50px;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .statistics-dom {
    position: absolute;
    top: 0;
    right: 540px;
    bottom: 0;
    display: flex;
    align-items: center;
    font-size: 14px;
    min-width: 180px;

    .number-text {
      font-weight: 600;
      font-size: 20px;
    }

    .svg-icon {
      width: 24px;
      height: 24px;
    }
  }

  .right-menu {
    position: absolute;
    top: 0;
    right: 24px;
    height: 100%;
    line-height: 50px;
    display: flex;
    align-items: center;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .layout-size {
      height: 100%;
      display: flex;
      align-items: center;
    }

    .avatar-container {
      height: 100%;

      .avatar-wrapper {
        display: flex;
        align-items: center;
        height: 100%;

        .user-avatar {
          cursor: pointer;
          width: 30px;
          height: 30px;
          border-radius: 50%;
        }

        .user-name {
          color: var(---, #D9DEE8);
          text-align: right;
          font-family: PingFang SC;
          font-size: 16px;
          font-style: normal;
          font-weight: 400;
          margin: 0 5px;
        }

        i {
          cursor: pointer;
          font-size: 12px;
          color: #D9DEE8;
        }
      }
    }
  }
}
</style>
