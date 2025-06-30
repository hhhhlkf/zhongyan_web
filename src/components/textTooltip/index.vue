<!--
 * @Author: pmy
 * @Date: 2022-10-31 14:54:18
 * @LastEditors: pmy
 * @LastEditTime: 2023-09-20 11:09:51
 * @FilePath: \bdcar-net\src\components\textTooltip\index.vue
 * @Description: 超出长度显示tooltip，注意：使用这个组件父元素必须长显或者v-if，否则会导致checkWidth方法判断出现问题
 * Copyright (c) 2022 by pmy/exsun, All Rights Reserved. 
-->
<template>
  <div class="tooltip-container">
    <el-tooltip class="my-tooltip" :disabled="isUsed" :content="text">
      <div ref="tooltipBox" class="text-box">
        <span ref="tooltipItem">{{ text }}</span>
      </div>
    </el-tooltip>
  </div>
</template>
<script lang="ts">
import { ref, nextTick } from "vue"
export default {
  name: "textTooltip",
  props: {
    text: {
      type: String,
      default: () => ""
    }
  },
  setup() {
    const isUsed = ref(true);
    return {
      isUsed //是否使用
    }
  },
  watch: {
    text: {
      handler() {
        nextTick(() => this.checkWidth());
      },
      immediate: true
    }
  },
  methods: {
    checkWidth() {
      //@ts-ignore
      const parentWidth = this.$refs['tooltipBox'].offsetWidth;
      //@ts-ignore
      const sonWidth = this.$refs['tooltipItem'].offsetWidth;
      this.isUsed = parentWidth >= sonWidth
    }
  }
};
</script>
<style scoped lang="scss">
.tooltip-container {
  width: 100%;

  .text-box {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
</style>