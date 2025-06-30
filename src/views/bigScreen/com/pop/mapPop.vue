<!--
 * @Author: nxx
 * @Date: 2024-01-08 11:16:55
 * @LastEditors: nxx
 * @LastEditTime: 2024-02-02 13:47:31
 * @FilePath: \web\src\views\bigScreen\com\pop\mapPop.vue
 * @Description: 
 * Copyright (c) 2024 by nxx/exsun, All Rights Reserved. 
-->
<!-- deviceType --- 1:GNSS接收机 2:应急感知站 3:农情感知站 4:摄像头 5:5G基站 6:仿生机器人 -->
<template>
    <div class="mapPop" :class="{ active: maxW.includes(propsData.deviceType) }">
        <span class="mars3d-popup-close-button closeButton"></span>
        <div class="top">
            <template v-if="status.includes(propsData.deviceType)">
                <div class="status green" v-if="propsData.status === 1">在线</div>
                <div class="status" v-if="propsData.status === 0">离线</div>
            </template>
            <div class="label">
                {{ propsData.deviceTypeName }}
            </div>
        </div>
        <div class="center">
            <ul class="equip-values" v-if="propsData.deviceType === 2">
                <li v-for="(key, val) in propsData.monitoringData">
                    <span>{{ val }}:</span>
                    <span>{{ key }}</span>
                </li>
            </ul>
            <div class="video" v-if="propsData.deviceType === 4">
                <img v-if="!propsData.url" class="img" src="@/assets/img/bigScreen/error/video.png" alt="">
                <video v-else ref="mapPopVideo" controls autoplay muted class="videoBox"></video>
            </div>
            <div class="body-item" v-for="item in labelList[propsData.deviceType]">
                <div class="item-label">{{ item.label }}：</div>
                <div class="item-text">{{ propsData[item.name] || '---' }}</div>
            </div>
            <div class="but" v-if="but.includes(propsData.deviceType)" @click="showTheDetail">查看详情</div>
        </div>
        <div class="bottom"></div>
    </div>
</template>

<script setup>
import { cameraFlv } from "../../js/cameraFlv"
let status = [1, 2, 3, 4, 6]
let but = [1, 2, 3, 6];
let maxW = [2, 4]
let labelList = {
    '1': [
        {
            label: "设备名称",
            name: 'deviceName',
        },
        {
            label: "设备地址",
            name: 'position',
        },
        {
            label: "最后通讯时间",
            name: 'time',
        },
    ],
    '2': [
        {
            label: "设备名称",
            name: 'deviceName',
        },
        {
            label: "设备地址",
            name: 'position',
        },
        {
            label: "最后通讯时间",
            name: 'time',
        },
    ],
    '3': [
        {
            label: "设备名称",
            name: 'deviceName',
        },
        {
            label: "设备地址",
            name: 'address',
        },
        // {
        //     label: "最后通讯时间",
        //     name: 'time',
        // },
    ],
    '4': [
        {
            label: "设备地址",
            name: 'position',
        },
    ],
    '5': [
        {
            label: "设备名称",
            name: 'deviceName',
        },
        {
            label: "设备地址",
            name: 'position',
        },
    ],
    '6': [
        {
            label: "设备名称",
            name: 'deviceName',
        },
        {
            label: "设备地址",
            name: 'position',
        },
    ],
}
let myProps = ref({})
let propsData = ref({})
let mapPopVideo = ref()
function setPopData(data) {
    propsData.value = data
    if (propsData.value.deviceType === 4 && propsData.value.url) {
        cameraFlv.videoPlay(mapPopVideo.value, propsData.value.url)
    }
}
function showTheDetail() {
    myProps.value.showDetail(propsData);
}
defineExpose({
    setPopData,
    myProps
})
</script>
<style lang="scss" scoped>
.mapPop {
    width: 330px;
    // height: 253px;
    position: relative;
    top: -40px;

    &.active {
        width: 460px;

        .top {
            background-image: url("@/assets/img/bigScreen/pop/top-max.png");
        }

        .center {
            background-image: url("@/assets/img/bigScreen/pop/center-max.png");

            .video {
                height: 222px;
                margin-top: 8px;
                border-radius: 2px;
                border: 1px solid rgba(38, 161, 239, 0.30);
                background: #1A2043;
                box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.55);
                position: relative;

                .videoBox {
                    width: 100%;
                    height: 100%;
                }
            }

            .img {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }

        }

        .bottom {
            background-image: url("@/assets/img/bigScreen/pop/bottom-max.png");
        }
    }

    .top {
        width: 100%;
        height: 35px;
        padding-top: 3px;
        background: url("@/assets/img/bigScreen/pop/top.png") center no-repeat;
        background-size: 100% 100%;
        display: flex;
        align-items: center;
        justify-content: center;

        .status {
            height: 24px;
            line-height: 20px;
            padding: 2px 10px;
            border-radius: 4px;
            margin-right: 6px;
            color: #C3CAD9;
            border: 1px solid #E4E4E4;
            background: #666;

            &.green {
                color: #11C79B;
                border: 1px solid #11C79B;
                background: #064032;
            }
        }

        .label {
            font-size: 18px;
            font-weight: 600;
            background: linear-gradient(180deg, #FFF 0%, #9CF9FD 100%);
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
    }

    .center {
        width: 100%;
        // height: 174px;
        background: url("@/assets/img/bigScreen/pop/center.png") center no-repeat;
        background-size: 100% 100%;
        padding: 0 30px;
        overflow: hidden;

        .equip-values {
            display: flex;
            flex-wrap: wrap;
            border-radius: 8px;
            color: #bdbecb;
            font-size: 16px;
            padding-top: 8px;

            li {
                width: 50%;
                margin: 4px 0;

                span:first-of-type {
                    margin-right: 12px;
                }

                span:nth-of-type(2) {
                    color: #fff;
                }
            }
        }

        .body-item {
            padding-top: 8px;
            display: flex;
            font-size: 16px;
            padding-top: 8px;
            line-height: 22px;

            .item-label {
                width: fit-content;
                color: #bdbecb;
            }

            .item-text {
                flex: 1;
            }
        }

        .but {
            width: 164px;
            height: 30px;
            margin: auto;
            margin-top: 15px;
            line-height: 30px;
            font-size: 16px;
            text-align: center;
            backdrop-filter: blur(7.5px);
            border-radius: 2px;
            border: 1px solid #C7EEFF;
            background: linear-gradient(131deg, rgba(51, 136, 255, 0.28) 6.33%, rgba(113, 160, 199, 0.70) 95.12%);
            box-shadow: 0px 0px 15px 0px #67B9ED inset;
            cursor: pointer;
        }
    }

    .bottom {
        width: 100%;
        height: 27px;
        background: url("@/assets/img/bigScreen/pop/bottom.png") center no-repeat;
        background-size: 100% 100%;
    }

    .mars3d-popup-close-button {
        top: 8px;
        right: 8px;
        padding: 8px 8px 0 0;
    }
}
</style>