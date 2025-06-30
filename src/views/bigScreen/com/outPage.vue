<!--
 * @Author: pmy
 * @Date: 2023-08-21 15:49:04
 * @LastEditors: nxx
 * @LastEditTime: 2024-01-10 11:25:30
 * @FilePath: \web\src\views\bigScreen\com\outPage.vue
 * @Description: 
 * Copyright (c) 2023 by pmy/exsun, All Rights Reserved. 
-->
<template>
  <div>
    <div class="title">
      <img class="back" src="@/assets/img/bigScreen/title_bg.png" alt="">
      <div class="text">{{ title }}</div>
      <div class="butList">
        <slot name="butList"></slot>
      </div>
    </div>
    <div class="body">
      <slot name="content"></slot>
    </div>
  </div>
</template>
<script>
import dayjs from "dayjs";
export default {
  props: {
    title: {
      type: String
    },
    selectTime: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      time: []
    };
  },
  components: {},
  computed: {},
  created() {
    this.time = [
      dayjs(new Date()).add(-50, 'days').format("YYYY-MM-DD") + ' 00:00:00',
      dayjs(new Date()).format("YYYY-MM-DD") + ' 23:59:59',
    ]
  },
  mounted() { },
  methods: {}
}
</script>
<style lang='scss' scoped>
.title {
  width: 405px;
  height: 40px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding-left: 40px;
  box-sizing: border-box;
  font-size: 20px;
  position: relative;

  .back {
    width: 405px;
    height: 32px;
    position: absolute;
    left: 0;
    bottom: 0;
    z-index: -1;
  }

  .text {
    font-size: 20px;
    font-weight: 600;
    white-space: nowrap;
    text-align: left;
    transform: translateX(-20px); /* 向左移动 10 像素 */
  }

  .butList {
    display: flex;
  }
}

.body {
  height: calc(100% - 40px);
  display: flex;
  position: relative;
}
</style>