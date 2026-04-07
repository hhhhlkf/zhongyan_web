<!--
 * @Author: nxx
 * @Date: 2024-01-04 15:27:26
 * @LastEditors: nxx
 * @LastEditTime: 2024-01-11 08:44:55
 * @FilePath: \web\src\views\bigScreen\com\timingSystem.vue
 * @Description: 高精度授时服务
 * Copyright (c) 2024 by nxx/exsun, All Rights Reserved. 
-->
<template>
    <div class="div-body">
        <div ref="carouselHost" class="top">
            <el-carousel :height="carouselHeight" motion-blur class="custom-carousel" :interval="carouselInterval"
                indicator-position="outside">
                <el-carousel-item v-for="item in dataList" :key="item">
                    <template v-if="item.url.endsWith('.mp4')">
                        <video class="newsVideo" :src="'http://' + item.url" controls autoplay muted loop fit="contain"
                            @play="setVideoInterval" @pause="resetInterval" @ended="resetInterval"></video>
                    </template>
                    <template v-else>
                        <el-image class="newsImg" :src="'http://' + item.url" fit="contain" />
                    </template>
                </el-carousel-item>
            </el-carousel>
        </div>
    </div>
</template>

<script setup>
import { getAreaData } from "../../../api/zhongyan/api";
import { defineExpose, onBeforeUnmount } from 'vue';

let dataList = reactive([]);
const defaultInterval = 4000; // 默认轮播时间
const videoInterval = 30000; // 视频轮播时间
const carouselInterval = ref(defaultInterval);
const carouselHost = ref(null);
const carouselHeight = ref('240px');

onMounted(async () => {
    updateCarouselHeight();
    window.addEventListener('resize', updateCarouselHeight);
    getAreaData("overview").then(res => {
        if (res.code === 200) {
            res.data.pointList.forEach(item => {
                dataList.push(item)
            })
        }
    }).catch(err => {
        console.log(err)
    })
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', updateCarouselHeight);
});

function setVideoInterval() {
    carouselInterval.value = videoInterval;
}

function resetInterval() {
    carouselInterval.value = defaultInterval;
}

function areaChange(val) {
    getAreaData(val).then(res => {
        if (res.code === 200) {
            // 清空原有数据
            dataList.splice(0, dataList.length)
            res.data.pointList.forEach(item => {
                if (item.url.endsWith('.mp4') && item.url.includes('演示')) {
                    dataList.unshift(item);
                } else {
                    dataList.push(item);
                }
            })
        }
    }).catch(err => {
        console.log(err)
    })
}

defineExpose({
    areaChange
});

function updateCarouselHeight() {
    const width = carouselHost.value?.clientWidth || 0;
    const nextHeight = width ? Math.max(180, Math.min(300, Math.round(width * 0.56))) : 240;
    carouselHeight.value = `${nextHeight}px`;
}

</script>
<style scoped>
.newsImg .newsVideo {
    width: inherit
}

.newsVideo {
    width: 100%;
    /* 使视频宽度适应整个容器 */
    height: 100%;
    /* 使视频高度适应整个容器 */
    object-fit: contain;
    /* 保持视频的纵横比 */
}

.top {
    width: 100%;
    height: 100%;
    padding: 37px 16px 0;
    box-sizing: border-box;
}

.bottom {
    width: 100%;
    transform: translateX(20px) translateY(-10px);
}

.li-name {

    text-decoration: underline;
    margin-bottom: 1px;

}

.li-name:hover {
    color: rgb(31, 112, 225);

}


.div-body {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    position: relative;
    justify-content: space-around;
    align-items: center;
    background: url("@/assets/img/bigScreen/highChart/back-h.png") center no-repeat;
    background-size: 100% 100%;
    display: flex;
}

.el-carousel__item h3 {
    color: #475669;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
    text-align: center;

}

.el-carousel__item:nth-child(2n) {
    background-color: transparent;
}

.el-carousel__item:nth-child(2n + 1) {
    background-color: transparent;
}

.custom-carousel {
    width: 100%;
    /* 设置轮播图的宽度为 80%，你可以根据需要调整这个值 */
    /* 往下一点 */
    height: 100%;
}
</style>
