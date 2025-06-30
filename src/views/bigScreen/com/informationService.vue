<!--
 * @Author: nxx
 * @Date: 2024-01-04 08:53:37
 * @LastEditors: nxx
 * @LastEditTime: 2024-01-05 15:37:04
 * @FilePath: \web\src\views\bigScreen\com\informationService.vue
 * @Description: 高分遥感信息服务
 * Copyright (c) 2024 by nxx/exsun, All Rights Reserved. 
-->
<template>
    <div>
        你好
    </div>
</template>

<script setup>

import { onMounted } from "vue";

let data = ref([]);
let props = defineProps(['active'])
let emit = defineEmits(['openInfo'])
let index = computed(() => {
    return Math.ceil(data.value.length / 2) - 1
})
const vueSeamlessScroll=ref()
let itemLable = {
    '遥感影像': {
        icon: 'remoteSensingImage',
        unit: '张',
    },
    '倾斜影像': {
        icon: 'obliquePhotography',
        unit: '张',
    },
    '三维点云': {
        icon: 'pointCloud',
        unit: '条',
    },
    '红外数据': {
        icon: 'infraredData',
        unit: '条',
    },
    '微光数据': {
        icon: 'glimmerData',
        unit: '条',
    },
    '全景数据': {
        icon: 'panoramicData',
        unit: '张',
    },
    '视频': {
        icon: 'video',
        unit: '条',
    },
    '照片': {
        icon: 'photograph',
        unit: '张',
    },
    '监督分类算法': {
        icon: 'partitioningAlgorithm',
        unit: '种',
    },
    '非监督分类算法': {
        icon: 'recognitionAlgorithm',
        unit: '种',
    },
    '指数算法': {
        icon: 'exponentialAlgorithm',
        unit: '种',
    },
    '地质检测算法': {
        icon: 'geologicalMonitoringAlgorithm',
        unit: '种',
    },
    '土壤墒情算法': {
        icon: 'soilMoistureContentAlgorithm',
        unit: '种',
    },
    '长势分析算法': {
        icon: 'growthAnalysisAlgorithm',
        unit: '种',
    },
}
function getImg(name) {
    return new URL(`../../../assets/img/bigScreen/informationService/${name}.png`, import.meta.url).href;
}

function getData() {
    let obj = {
        tap: props.active
    }
    data.value = []
    
}

function openInfo(obj) {
    emit('openInfo', obj)
}

function handleScroll(e) {
      // 改变组件内部 yPos 的值，这样html的translate(0, yPos)就会随之改变
      // e.deltaY是滚动的距离
      console.log(1)
      vueSeamlessScroll.yPos = vueSeamlessScroll.yPos - e.deltaY
      // 如果是正数 说明是往上滚
      if (vueSeamlessScroll.yPos > 0) {
        vueSeamlessScroll.yPos = 0
        return
      }
      // 如果yPos超过内部实际高度的一半则重新到顶部滚动
      // 一半的原因是因为组件实际上创建了两个dom，以达到无缝衔接的效果
      if (Math.abs(vueSeamlessScroll.yPos) > vueSeamlessScroll.realBoxHeight / 2) {
        vueSeamlessScroll.yPos = 0
      }
    }

onMounted(() => {
    console.log(vueSeamlessScroll)
})
watch(
    props,
    (newValue, oldValue) => {
        getData()
    },
    { immediate: true }
)
</script>
<style lang="scss" scoped>


.seamless-scroll-wrapper {
    overflow: auto;
}

.scrollDiv {
    position: relative;

    .itemBox:nth-child(2n) {
        padding-left: 10px;
    }
}

:deep(.scrollDiv div div:nth-child(2)) {

    .vertical,
    .across {
        display: none;
    }
}

.vertical {
    width: 1px;
    height: 100%;
    background: linear-gradient(0deg, rgba(51, 136, 255, 0.00) 0%, rgba(51, 136, 255, 0.60) 49.44%, rgba(51, 136, 255, 0.00) 99.16%);
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, 0);
    z-index: 1;
}

.across {
    height: 1px;
    background: linear-gradient(270deg, rgba(51, 136, 255, 0.00) 0%, rgba(51, 136, 255, 0.60) 49.44%, rgba(51, 136, 255, 0.00) 99.16%);
    position: absolute;
    top: 94px;
    left: 0;
    right: 0;
}

.itemBox {
    height: 85px;
    padding-bottom: 5px;
    float: left;

    &:nth-child(2n) {
        padding-left: 5px;
    }

    &:nth-child(2n+1) {
        padding-right: 5px;
    }

    .item {
        width: 195px;
        height: 80px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        // border: 1px solid #6EDBF4;
        &.active,
        &:hover {
            background: rgba(57, 147, 253, 0.28);
        }

        .img {
            width: auto;
            height: 50px;
            margin-top: 11px;
        }

        .label {
            width: 86px;
            font-size: 16px;
            color: #BDBECB;
            padding-left: 8px;
            white-space: nowrap;

            .num {
                font-family: D-DIN;
                font-size: 24px;
                font-weight: 800;
                background: linear-gradient(180deg, #F8FFFE 17.18%, #6EDBF4 80.82%);
                background-clip: text;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                margin-bottom: 4px;

                .unit {
                    font-family: PingFang SC;
                    font-size: 12px;
                    font-weight: 600;
                }
            }
        }
    }
}
</style>