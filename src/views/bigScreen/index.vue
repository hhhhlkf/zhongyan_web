<!--
 * @Author: nxx
 * @Date: 2024-01-08 16:53:54
 * @LastEditors: hhhhlkf 153648356@qq.com
 * @LastEditTime: 2025-06-24 18:17:59
 * @FilePath: \web\src\views\bigScreen\index.vue
 * @Description: 
 * Copyright (c) 2024 by nxx/exsun, All Rights Reserved. 
-->
<template>

    <div class="big-page">
        <div class="bg"></div>
        <div class="big-screen-stage" :style="stageStyle">
            <div class="big-screen-shell">
        <!-- <div class="page-btn screen-detail" @click="goToBigScreen()">综合评估</div> -->
        <div v-if="!workbenchExpanded" class="page-btn screen-workbench-toggle" @click="openWorkbenchPanel()">
            显示流程控制
        </div>
        <div class="page-btn screen-detail" @click="changetime()">{{ timeMode }}</div>
        <div class="bg"></div>
        <pageTitle></pageTitle>

        <div class="detail-page right">
            <!-- <div class="goBack" v-show="mapShow" @click="mapShow = false"></div> -->


            <outPage class="access" title="通信状态">
                <template #content>
                    <!-- <postDisasterAccess :startWork="startWork"></postDisasterAccess> -->
                    <communicateStatus :perc="perc"></communicateStatus>
                </template>
            </outPage>

            <outPage class="news" title="灾时场景展示">
                <template #content>
                    <newsSection ref="newSection"></newsSection>
                </template>
            </outPage>
        </div>

        <div class="center-title">
            <span class="content">自主学习的采-融-处-传一体化软硬件平台</span>
            <!-- <span class="content">无人机实时遥感灾害评估系s统平台</span> -->
            <!-- <span class="content">灾害遥感信息提取与评估系统平台</span> -->
            <!-- <span class="content">无人机实时遥感灾害信息提取系统平台</span> -->


        </div>

        <!-- 地图 -->
        <div class="center-map" id="myMap">
            <MarsMap :url="configUrl" map-key="test" @onload="marsOnload" />
        </div>

        <div class="legend-box" v-if="isVis">
            <div class="legend-item">
                <div class="color-box-1"></div>
                <div class="legend-text">
                    <span>无损毁</span>
                </div>
            </div>
            <div class="legend-item">
                <div class="color-box-2"></div>
                <div class="legend-text">
                    <span>轻微损毁</span>
                </div>
            </div>
            <div class="legend-item">
                <div class="color-box-3"></div>
                <div class="legend-text">
                    <span>重度损毁</span>
                </div>
            </div>
            <div class="legend-item">
                <div class="color-box-4"></div>
                <div class="legend-text">
                    <span>完全损毁</span>
                </div>
            </div>
        </div>

        <div class="legend-box" v-if="isVis1">
            <div class="legend-item">
                <div class="color-box-5"></div>
                <div class="legend-text">
                    <span>农田</span>
                </div>
            </div>
            <div class="legend-item">
                <div class="color-box-6"></div>
                <div class="legend-text">
                    <span>森林</span>
                </div>
            </div>
            <div class="legend-item">
                <div class="color-box-7"></div>
                <div class="legend-text">
                    <span>草地</span>
                </div>
            </div>
            <div class="legend-item">
                <div class="color-box-8"></div>
                <div class="legend-text">
                    <span>灌木</span>
                </div>
            </div>
            <div class="legend-item">
                <div class="color-box-9"></div>
                <div class="legend-text">
                    <span>湿地</span>
                </div>
            </div>
            <div class="legend-item">
                <div class="color-box-10"></div>
                <div class="legend-text">
                    <span>水体</span>
                </div>
            </div>
            <div class="legend-item">
                <div class="color-box-11"></div>
                <div class="legend-text">
                    <span>建筑物</span>
                </div>
            </div>
            <div class="legend-item">
                <div class="color-box-12"></div>
                <div class="legend-text">
                    <span>道路</span>
                </div>
            </div>
            <div class="legend-item">
                <div class="color-box-13"></div>
                <div class="legend-text">
                    <span>不透水面</span>
                </div>
            </div>
            <div class="legend-item">
                <div class="color-box-14"></div>
                <div class="legend-text">
                    <span>裸地</span>
                </div>
            </div>
        </div>

        <div class="detail-page left" :class="{ 'workbench-expanded': workbenchExpanded }">

            <outPage class="center workbench-stage" title="流程控制板块">
                <template #butList>
                    <!-- <div class="btn" :class="{ active: informationServiceAcitve == '1' }" @click="toggleTo(1, false)">
                        边缘处理
                    </div> -->
                    <el-select v-model="value_edge" placeholder="案例选择" size="large" style="" class="custom-select">
                        <el-option v-for="item in options_edge" :key="item.value" :label="item.label"
                            :value="item.value" @click="toggleTo(1, false, item.label)" />
                    </el-select>
                    <!-- <div class="btn" :class="{ active: informationServiceAcitve == '2' }" @click="toggleTo(2, true)">
                        线下处理
                    </div> -->
                    <!-- <el-select v-model="value_line" placeholder="线下处理" size="large"
                        style="width: 120px;margin-top: -10px;" class="custom-select">
                        <el-option v-for="item in options_line" :key="item.value" :label="item.label"
                            :value="item.value" @click="toggleTo(2, true, item.label)" />
                    </el-select> -->
                </template>
                <template #content>
                    <!-- <informationService :active="informationServiceAcitve" @openInfo="openInformationServiceInfo">
                    </informationService> -->
                    <processControlView ref="processControlPanel" :processCtrlData="informationServiceAcitve" :changeRotate="changeRotate"
                        :graphicQueue="processPanelGraphicQueue" :updateProcess="updateProcess" :updateEvaluate="updateEvaluate"
                        :showgraphic="showgraphic" :toggleIsVisible="toggleIsVisible" :areaLabel="areaLabel"
                        :getProcessResult="getProcessResult" :bindMourseClick="bindMourseClick"
                        @workbench-visible-change="handleWorkbenchVisibleChange"
                        @realtime-uav-update="handleRealtimeUavUpdate"
                        @realtime-uav-visibility-change="handleRealtimeUavVisibilityChange">
                    </processControlView>
                </template>
            </outPage>
            <outPage v-show="!workbenchExpanded" class="top body-overflow" title="应急数据与结果管理">
                <template #content>
                    <generalOverview :showgraphic="showgraphic" :showDisaster="showDisaster"
                        :closeDisaster="closeDisaster" :generView="generView"></generalOverview>
                </template>
            </outPage>
        </div>

        <informationServiceInfo :infoShow="informationServiceInfoShow" :infoType="informationServiceInfoType"
            :onClick="informationServiceInfoClick" :close="informationServiceInfoClose"
            :active="informationServiceAcitve">
        </informationServiceInfo>


        <div class="cesium-button cesium-toolbar-button mar3d-toolButton multiplier-speed"
            :class="{ 'active': multiplierSpeed }" @click="multiplierSpeed = !multiplierSpeed">
            <img src="../../assets/img/bigScreen/legend/multiplierSpeed.png" alt="">
        </div>

            </div>
        </div>
    </div>
</template>
<script setup>

import * as Cesium from "mars3d-cesium";
import * as mars3d from "mars3d";
import MarsMap from "../../components/MarsWork/marsMap.vue";

import pageTitle from "./pageTitle.vue"
import outPage from "./com/outPage.vue"
import generalOverview from "./com/generalOverview.vue"
import informationService from "./com/informationService.vue"

import postDisasterAccess from "./com/postDisasterAccess.vue"

import informationServiceInfo from "./com/informationServiceInfo.vue"

import mapPop from './com/pop/mapPop.vue';
import newsSection from './com/newsSection.vue';
import processControlView from "./com/processControlView.vue";
import communicateStatus from "./com/communicateStatus.vue";


import { computed, onBeforeUnmount, reactive, ref, watch } from "vue";
import { add, random } from "xe-utils";
import { ElMessage } from "element-plus";
import { getAreaAxis, getPointData, processResult, getServerIp } from "../../api/zhongyan/api";
import { Shp2JsonLayer } from "./js/Shp2JsonLayer.js"
import { useProcessStore } from "@/store/modules/process";
const configUrl = "config/config.json";
let value_edge = ref('案例选择')
// let value_line = ref('线下处理')
const newSection = ref(null)
const processControlPanel = ref(null)

let processStore = useProcessStore()

let options_edge = [
    {
        value: '1',
        label: '洞庭湖',
    },
    {
        value: '2',
        label: '甘肃地震',
    },
    {
        value: '3',
        label: '资兴州司门',
    },
]
let options_line = [
    {
        value: '1',
        label: '洞庭湖',
    },
    {
        value: '2',
        label: '甘肃地震',
    },
]

let map;
let graphicLayer;
let shpLayer1;
let shpLayer2;
let isRotate = false;

let multiplierSpeed = ref(false)
const workbenchExpanded = ref(false)
const baseScreenWidth = 2109
const baseScreenHeight = 1085
const stageSize = reactive({
    width: window.innerWidth,
    height: window.innerHeight
})
const stageStyle = computed(() => {
    const scale = Math.min(stageSize.width / baseScreenWidth, stageSize.height / baseScreenHeight) || 1
    return {
        width: `${baseScreenWidth}px`,
        height: `${baseScreenHeight}px`,
        transform: `translate(-50%, -50%) scale(${scale})`
    }
})

let informationServiceAcitve = ref(1)
let informationServiceInfoShow = ref(false)
let informationServiceInfoType = ref('')
let graphicQueue = reactive([])
let graphicQueueLocal = []
const processPanelGraphicQueue = computed(() => graphicQueue.filter((item) => item?.source !== 'realtime-transfer'))
let isProcess = ref(false)
// let isTrans = ref(false)
let isEvaluate = ref(false)
let areaLabel = ref('洞庭湖')
let graphicValId = null
let perc = ref(0)
let isVis = ref(false)
let isVis1 = ref(false)
let extent = reactive({})
let divideX = ref()
let divideY = ref()
let car = reactive([112.7957644, 29.3971501])
let pointIdList = reactive([])
let generView = ref(false)
let timeMode = ref('夜间模式')
let timeModeFlag = ref(true)
const OVERLAY_Z_INDEX = {
    collect: 200,
    process: 100
}
let uavRoutePositions = reactive([])
let overlayRegistry = {}
let realtimeUavLastTimestamp = ''
let realtimeUavGraphic = null
let realtimeUavTrackLine = null
let realtimeUavScanGraphic = null
let realtimeUavHasFocusedStart = false
let realtimeUavScanAnimationTimer = null
let realtimeUavScanPulse = 0
let realtimeUavModelUrl = "//data.mars3d.cn/gltf/mars/wrj.glb"
const overlayDisplayDuration = 3000
let pendingOverlayQueue = reactive([])
let pendingOverlayKeySet = new Set()
let overlayPlaybackTimer = null
let overlayPlaybackRunning = false
function toggleIsVisible(flag) {
    isVis.value = flag
}
function updateProcess(flag) {
    isProcess.value = flag
}

// function updateTrans(flag) {
//     isTrans.value = flag
// }

function updateEvaluate(flag) {
    isEvaluate.value = flag
}

function getProcessResult() {
    generView.value = !generView.value
    // console.log("I m here")
}

function openInformationServiceInfo(data) {
    // console.log(data, 'openInformationServiceInfo')
    informationServiceInfoShow.value = true
    informationServiceInfoType.value = data.type
}

function informationServiceInfoClose() {
    informationServiceInfoShow.value = false
}

function informationServiceInfoClick(data) {

}

function goToBigScreen() {
    window.location.href = "https://jcyj.ndrcc.org.cn:4016/diit-flood-web/app/module/home/home.html?login=1&token=95fb5b75-dcaa-415a-a49e-9ec5089e1901"
}

function changetime() {
    if (timeMode.value === '夜间模式') {
        timeMode.value = '白天模式'
        ElMessage({
            message: '夜间模式',
            type: 'success'
        })
    } else {
        timeMode.value = '夜间模式'
        ElMessage({
            message: '白天模式',
            type: 'success'
        })
    }
    timeModeFlag.value = !timeModeFlag.value
}

function changeRotate() {
    // console.log(isRotate)
    isRotate = !isRotate
}

const myPopWindow = ref({})
let mapPopContent = null;
onMounted(() => {
    window.addEventListener('resize', updateStageSize)

    processStore.registerGraphicCallbacks({
        createGraphic,
        delGraphic,
        reviseGraphic,
        clearGraphic,
        focusGraphic: focusGraphicFromHistory

    });
    // // 引入 Vue 组件构造器实例化
    let parent = document.createElement('div');
    // 挂载组件
    mapPopContent = createApp(mapPop).mount(parent);
    mapPopContent.myProps = {
        closePopup: closePopup,
        showDetail: showDetail,
    };

    getServerIp().then((res) => {
        if (res?.code === 200 && res?.data?.ip) {
            realtimeUavModelUrl = `http://${res.data.ip}:8088/v2/static/uav.gltf`
        }
    }).catch((error) => {
        console.warn('Failed to resolve realtime UAV model url, fallback to default model.', error)
    })


})

onBeforeUnmount(() => {
    window.removeEventListener('resize', updateStageSize)
    stopRealtimeUavMission()
    clearOverlayPlaybackQueue()
})

function updateStageSize() {
    stageSize.width = window.innerWidth
    stageSize.height = window.innerHeight
}

// Key change: parent layout reacts to workbench visibility without remounting the flow control view.
function handleWorkbenchVisibleChange(visible) {
    workbenchExpanded.value = visible
}

function openWorkbenchPanel() {
    processControlPanel.value?.openWorkbench?.()
}



function marsOnload(_map) {
    map = _map
    window.mapobj = map
    graphicLayer = new mars3d.layer.GraphicLayer()
    map.addLayer(graphicLayer)
    ensureOverlayGraphicLayers()
    // processStore.setGraphicLayer(graphicLayer)
    // addUAVGraphic(UAVLayer)

}

let patchList = [] // 用于存储图形对象的列表

let collectOverlayLayer = null
let processOverlayLayer = null

function ensureOverlayGraphicLayers() {
    if (!map) {
        return
    }

    // 关键修改：采集贴图与处理贴图固定分层，保证 process 永远覆盖在 collect 之上。
    if (!collectOverlayLayer) {
        collectOverlayLayer = new mars3d.layer.GraphicLayer()
        map.addLayer(collectOverlayLayer)
    }

    if (!processOverlayLayer) {
        processOverlayLayer = new mars3d.layer.GraphicLayer()
        map.addLayer(processOverlayLayer)
    }
}

function getOverlayLayer(task = 'collect') {
    ensureOverlayGraphicLayers()
    return task === 'process' ? collectOverlayLayer : processOverlayLayer
}

function getFullImageUrl(url = '') {
    if (!url) {
        return '';
    }
    if (/^https?:\/\//.test(url)) {
        return url;
    }
    return `http://${url.replace(/^\/+/, '')}`;
}

function getOverlayKey(item = {}) {
    return String(item.id || item.captureId || item.resultId || item.name || item.fileName || '');
}

function normalizeCornerPoint(point = {}) {
    const lng = Number(point?.lng ?? point?.lon ?? point?.longitude ?? point?.x);
    const lat = Number(point?.lat ?? point?.latitude ?? point?.y);
    const alt = Number(point?.alt ?? point?.height ?? point?.z ?? 0);
    if (Number.isNaN(lng) || Number.isNaN(lat)) {
        return null;
    }
    return { lng, lat, alt };
}

function resolveOverlayPositionsFromBounds(item = {}) {
    const lngmin = Number(item?.lngmin);
    const lngmax = Number(item?.lngmax);
    const latmin = Number(item?.latmin);
    const latmax = Number(item?.latmax);
    if ([lngmin, lngmax, latmin, latmax].some((value) => Number.isNaN(value))) {
        return [];
    }

    return [
        [lngmin, latmax, 0],
        [lngmax, latmax, 0],
        [lngmax, latmin, 0],
        [lngmin, latmin, 0],
    ];
}

function resolveOverlayPositions(item = {}) {
    const rawPoly = Array.isArray(item?.poly) && item.poly.length
        ? item.poly
        : (Array.isArray(item?.corners) ? item.corners : []);
    if (!Array.isArray(rawPoly) || rawPoly.length < 4) {
        return resolveOverlayPositionsFromBounds(item);
    }

    const polyCorners = rawPoly.map(normalizeCornerPoint).filter(Boolean);
    if (polyCorners.length < 4) {
        return resolveOverlayPositionsFromBounds(item);
    }

    return polyCorners.slice(0, 4).map((point) => [point.lng, point.lat, point.alt ?? 0]);
}

function getOverlayBounds(item = {}) {
    const positions = resolveOverlayPositions(item);
    if (!positions.length) {
        return null;
    }

    const lngList = positions.map((position) => position[0]);
    const latList = positions.map((position) => position[1]);
    return {
        xmin: Math.min(...lngList),
        xmax: Math.max(...lngList),
        ymin: Math.min(...latList),
        ymax: Math.max(...latList),
        height: 3000
    };
}

function isOverlayItem(item = {}) {
    return !!((item?.type === 'rgb' || item?.imageUrl || item?.url || item?.path)
        && resolveOverlayPositions(item).length >= 4);
}

function getOverlayZIndex(task = 'collect') {
    return OVERLAY_Z_INDEX[task] || OVERLAY_Z_INDEX.collect;
}

function isRecentOverlaySource(source = '') {
    return String(source).startsWith('recent-');
}

function clearOverlayPlaybackQueue() {
    pendingOverlayQueue.splice(0, pendingOverlayQueue.length)
    pendingOverlayKeySet.clear()
    overlayPlaybackRunning = false
    if (overlayPlaybackTimer) {
        clearTimeout(overlayPlaybackTimer)
        overlayPlaybackTimer = null
    }
}

function playNextOverlayInQueue() {
    if (overlayPlaybackRunning) {
        return
    }

    const nextTask = pendingOverlayQueue.shift()
    if (!nextTask) {
        return
    }

    overlayPlaybackRunning = true
    pendingOverlayKeySet.delete(nextTask.key)

    const overlayGraphic = addOrUpdateImageOverlay(nextTask.item, nextTask.task)
    const overlayBounds = getOverlayBounds(nextTask.item)
    if (!overlayGraphic) {
        overlayPlaybackRunning = false
        playNextOverlayInQueue()
        return
    }

    overlayGraphic.show = nextTask.item.graphic !== false
    if (overlayBounds && overlayGraphic.show && map) {
        map.flyToExtent(overlayBounds, { duration: 0.5 })
        processStore.setFlyToFlag(false)
    }

    overlayPlaybackTimer = setTimeout(() => {
        overlayPlaybackRunning = false
        overlayPlaybackTimer = null
        playNextOverlayInQueue()
    }, overlayDisplayDuration)
}

function enqueueOverlayPlayback(item, task = item?.task || 'collect') {
    const key = getOverlayKey(item)
    if (!key || pendingOverlayKeySet.has(key)) {
        return
    }

    pendingOverlayKeySet.add(key)
    pendingOverlayQueue.push({
        key,
        task,
        item: {
            ...item,
            task
        }
    })
    playNextOverlayInQueue()
}

function updateOverlayListEntry(item, graphic) {
    const key = getOverlayKey(item);
    if (!key) {
        return;
    }

    const queueIndex = graphicQueue.findIndex((queueItem) => String(queueItem.id) === key);
    const queueItem = {
        id: key,
        name: item.name || item.fileName || key,
        type: item.time || item.captureTime || item.resultTime || item.fileDate || '',
        task: item.task || 'collect',
        source: item.source || '',
        graphic: graphic.show
    };
    if (queueIndex === -1) {
        graphicQueue.push(queueItem);
    } else {
        graphicQueue[queueIndex] = {
            ...graphicQueue[queueIndex],
            ...queueItem
        };
    }

    const localIndex = graphicQueueLocal.findIndex((graphicItem) => String(graphicItem.id) === key);
    if (localIndex === -1) {
        graphicQueueLocal.push({ id: key, graphic });
    } else {
        graphicQueueLocal[localIndex].graphic = graphic;
    }
}

function addOrUpdateImageOverlay(item, task = item?.task || 'collect') {
    const positions = resolveOverlayPositions(item);
    const key = getOverlayKey(item);
    const imageUrl = getFullImageUrl(item?.imageUrl || item?.url || item?.path);
    const overlayLayer = getOverlayLayer(task);
    if (!overlayLayer || !positions.length || !key || !imageUrl) {
        return null;
    }

    const registryItem = overlayRegistry[key];
    if (registryItem?.graphic) {
        if (registryItem.layer && registryItem.layer !== overlayLayer) {
            registryItem.layer.removeGraphic(registryItem.graphic);
            overlayLayer.addGraphic(registryItem.graphic);
            registryItem.layer = overlayLayer;
        }
        registryItem.graphic.positions = positions;
        registryItem.graphic.style = {
            ...registryItem.graphic.style,
            image: imageUrl,
            zIndex: getOverlayZIndex(task)
        };
        registryItem.graphic.show = item.graphic !== false;
        registryItem.task = task;
        registryItem.item = item;
        updateOverlayListEntry(item, registryItem.graphic);
        return registryItem.graphic;
    }

    const graphic = new mars3d.graphic.PolygonPrimitive({
        positions,
        id: key,
        style: {
            image: imageUrl,
            clampToGround: true,
            zIndex: getOverlayZIndex(task)
        }
    });
    overlayLayer.addGraphic(graphic);
    overlayRegistry[key] = { graphic, task, item, layer: overlayLayer };
    patchList.push({ id: key, graphic, task });
    updateOverlayListEntry(item, graphic);
    return graphic;
}

function convertToSurroundingPointsNew(item, height = 0) {
    console.log("item is:", item)
    const surroundingPoints = [
        [item.poly[0].lng, item.poly[1].lat, 0],
        [item.poly[1].lng, item.poly[1].lat, 0],
        [item.poly[1].lng, item.poly[0].lat, 0],
        [item.poly[0].lng, item.poly[0].lat, 0]
    ]
    console.log("surroundingPoints: ", surroundingPoints);
    return surroundingPoints
}

// 获取当前图形
function createGraphic(item) {
    if (isOverlayItem(item)) {
        const graphic = addOrUpdateImageOverlay(item, item.task || 'collect')
        return graphic
    }
    console.log("graphicLayer: ", item.type, item?.poly?.[0]);
    if (item.type === 'rgb') {

        const graphic = new mars3d.graphic.PolygonPrimitive({
            positions: convertToSurroundingPointsNew(item),
            id: item.id,
            style: {
                // color: arrColor[graphicLayer.length % arrColor.length],
                image: "http://" + item.url,
                clampToGround: true,
                // image: `http://localhost:8088/v2/images/gansu/UAV_00_00.png`,
                // stRotationDegree: fixedRoute.model.heading,
                zIndex: item.name.includes('O') ? graphicLayer.length + 1000 : graphicLayer.length,
            }
        })
        graphicLayer.addGraphic(graphic); // 将图形对象添加到图形层
        // console.log("成功添加！")
        patchList.push(
            {
                id: graphic.id,
                graphic: graphic
            }
        )
        patchList.forEach(item => {
            console.log("patchList: ", item);
        });


    } else {
        // console.log("here is createPoint");
        createRealPoint(item); // 针对微光红外图片和高光谱图片创建点对象
    }
}

// 针对微光红外图片和高光谱图片创建点对象
// TODO 等到有了微光红外图片和高光谱图片的具体数据格式后再完善
function createRealPoint(item, lng = null, lat = null) {
    const assetUrl = getFullImageUrl(item.imageUrl || item.url || item.path)
    let htmlContent = `<table style="width:280px;">
    <tr><th scope="col" colspan="4" style="text-align:center;font-size:15px;">灾害现场</th></tr>
    <tr><td colspan="4" style="text-align:center;"><img src="${assetUrl}" alt="Image" style="max-width:100%;"></td></tr>
    </table>`;
    const baseUrl = assetUrl.includes('/static/') ? assetUrl.split('/static/')[0] : ''
    const sourcePoint = normalizeCornerPoint(item?.uavPosition || item?.sourcePosition || {})
    let newlng = sourcePoint?.lng
    let newlat = sourcePoint?.lat
    if (lng && lat) {
        newlng = lng
        newlat = lat
    }
    if (newlng == null || newlat == null) {
        return null
    }
    const graphic = new mars3d.graphic.BillboardEntity({
        position: new mars3d.LngLatPoint(newlng, newlat, 0),
        id: getOverlayKey(item),
        style: {

            image: `${baseUrl}/static/poly.png`,
            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            label: {
                pixelOffsetY: -45,
                horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM
            }
        },
    })
    graphicLayer.addGraphic(graphic)
    patchList.push(
        {
            id: graphic.id,
            graphic: graphic,
            task: item.task || 'collect'
        }
    )
    // 绑定Popup
    updateOverlayListEntry(item, graphic)
    graphic.bindTooltip(htmlContent, { offsetY: -30, pointerEvents: true }).openTooltip()
    return graphic
}

function delGraphic(item) {
    const key = getOverlayKey(item)
    const index = patchList.findIndex((i) => i.id === key);
    const registryItem = overlayRegistry[key]
    if (index !== -1) {
        // console.log("正在删除", item.type)
        // this.drawer.rgb = false; // 关闭rgb_drawer
        // patchList[index].graphic.show = false; // 隐藏图形对象
        // setTimeout(() => {
        const targetGraphic = registryItem?.graphic || patchList[index].graphic
        const targetLayer = registryItem?.layer || collectOverlayLayer || processOverlayLayer || graphicLayer
        if (targetGraphic && targetLayer) {
            targetLayer.removeGraphic(targetGraphic)
        }
        patchList.splice(index, 1); // 从公共列表中删除
        // }, 100);
    }
    if (overlayRegistry[key]) {
        delete overlayRegistry[key]
    }
    const queueIndex = graphicQueue.findIndex((queueItem) => String(queueItem.id) === key)
    if (queueIndex !== -1) {
        graphicQueue.splice(queueIndex, 1)
    }
    const localIndex = graphicQueueLocal.findIndex((graphicItem) => String(graphicItem.id) === key)
    if (localIndex !== -1) {
        graphicQueueLocal.splice(localIndex, 1)
    }
}

function clearGraphic(itemList) {
    itemList.forEach(item => {
        const graphicIndex = patchList.findIndex(g => g.id === getOverlayKey(item));
        if (graphicIndex !== -1) {
            delGraphic(item)
        }
    });
}

function focusGraphicFromHistory(item) {
    if (!map || !map.scene || !map.scene.camera) {
        console.warn('Map is not ready, skip focusing history item.', item?.id);
        return;
    }

    const overlayBounds = getOverlayBounds(item)
    if (overlayBounds) {
        const centerLng = (overlayBounds.xmin + overlayBounds.xmax) / 2;
        const centerLat = (overlayBounds.ymin + overlayBounds.ymax) / 2;
        const focusHeight = Number(item?.focusHeight);
        const cameraHeight = Number.isFinite(focusHeight) && focusHeight > 0 ? focusHeight : 3000;
        map.scene.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(centerLng, centerLat, cameraHeight),
            orientation: {
                heading: Cesium.Math.toRadians(0),
                pitch: Cesium.Math.toRadians(-90),
                roll: 0
            },
            duration: 0.8
        });
        return;
    }

    console.warn('Invalid poly data, skip focusing history item.', item?.id, item?.poly);
    return;

    const poly = item?.poly;
    if (!Array.isArray(poly) || poly.length < 2) {
        console.warn('Invalid poly data, skip focusing history item.', item?.id, poly);
        return;
    }

    const p1 = poly[0];
    const p2 = poly[1];
    const lng1 = Number(p1?.lng);
    const lat1 = Number(p1?.lat);
    const lng2 = Number(p2?.lng);
    const lat2 = Number(p2?.lat);
    const hasInvalidCoord = [lng1, lat1, lng2, lat2].some((value) => Number.isNaN(value));
    if (hasInvalidCoord) {
        console.warn('Invalid coordinates, skip focusing history item.', item?.id, poly);
        return;
    }

    const centerLng = (lng1 + lng2) / 2;
    const centerLat = (lat1 + lat2) / 2;
    // 历史记录定位采用俯视视角，镜头移动到当前图片中心点上方。
    const focusHeight = Number(item?.focusHeight);
    const cameraHeight = Number.isFinite(focusHeight) && focusHeight > 0 ? focusHeight : 3000;
    map.scene.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(centerLng, centerLat, cameraHeight),
        orientation: {
            heading: Cesium.Math.toRadians(0),
            pitch: Cesium.Math.toRadians(-90),
            roll: 0
        },
        duration: 0.8
    });
}

function reviseGraphic(newItem) {
    const overlayKey = getOverlayKey(newItem)
    const overlayBounds = getOverlayBounds(newItem)
    const hadOverlayGraphic = Boolean(overlayRegistry[overlayKey]?.graphic)
    if (isOverlayItem(newItem)) {
        if (!hadOverlayGraphic && isRecentOverlaySource(newItem?.source) && newItem.graphic !== false) {
            enqueueOverlayPlayback(newItem, newItem.task || 'collect')
            return
        }
        const overlayGraphic = addOrUpdateImageOverlay(newItem, newItem.task || overlayRegistry[overlayKey]?.task || 'collect')
        if (overlayGraphic) {
            overlayGraphic.show = newItem.graphic !== false
            // 关键修改：recent 新图成功贴到底图后，镜头自动飞到该图上空，便于实时查看。
            if (!hadOverlayGraphic && overlayBounds && overlayGraphic.show && map) {
                map.flyToExtent(overlayBounds, { duration: 0.5 });
                processStore.setFlyToFlag(false)
            }
            return
        }
        return
    }
    const existingIndex = patchList.findIndex(

        (item) => item.id === newItem.id

    );
    // console.log("existingIndex is ", existingIndex, "newItem: ", newItem.id);
    if (existingIndex !== -1) {
        if (overlayBounds) {
            extent = overlayBounds
            map.flyToExtent(extent, { duration: 0.1 });
        }
        console.log("existingIndex is not -1")
        patchList[existingIndex].graphic.show = newItem.graphic;
    } else {
        if (processStore.getFlyToFlag() && overlayBounds) {
            extent = overlayBounds
            map.flyToExtent(extent, { duration: 0.5 });
        }
        processStore.setFlyToFlag(false)
        createGraphic(newItem)
    }
}


function bindMourseClick() {
    if (timeModeFlag.value) {
        return true
    }
    eventTarget = new mars3d.BaseClass()
    map.setCursor(true)
    map.off(mars3d.EventType.click, map_onclick)
    map.once(mars3d.EventType.click, map_onclick)
    return false
}

/*
function getAreaMissionName(areaName) {
    if (areaName === '洞庭湖' || areaName === '娲炲涵婀?) {
        return 'dongtinghu'
    }
    if (areaName === '资兴州司门' || areaName === '璧勫叴宸炲徃闂?) {
        return 'zixing'
    }
    return 'gansu'
}
*/

function getAreaMissionName(areaName) {
    const areaText = String(areaName || '').toLowerCase()
    if (areaText.includes('洞庭') || areaText.includes('dongting')) {
        return 'dongtinghu'
    }
    if (areaText.includes('资兴') || areaText.includes('zixing')) {
        return 'zixing'
    }
    return 'gansu'
}

function clearOverlayRegistry() {
    Object.keys(overlayRegistry).forEach((key) => {
        delete overlayRegistry[key]
    })
    patchList.splice(0, patchList.length, ...patchList.filter((item) => !item?.task))
    collectOverlayLayer?.clear?.()
    processOverlayLayer?.clear?.()
    clearOverlayPlaybackQueue()
}

function resetRealtimeUavSession() {
    realtimeUavLastTimestamp = ''
    uavRoutePositions.splice(0, uavRoutePositions.length)
    realtimeUavHasFocusedStart = false
    realtimeUavScanPulse = 0
}

function stopRealtimeUavMission() {
    if (realtimeUavScanAnimationTimer) {
        clearInterval(realtimeUavScanAnimationTimer)
        realtimeUavScanAnimationTimer = null
    }
    if (realtimeUavTrackLine && graphicLayer) {
        graphicLayer.removeGraphic(realtimeUavTrackLine)
    }
    if (realtimeUavGraphic && graphicLayer) {
        graphicLayer.removeGraphic(realtimeUavGraphic)
    }
    if (realtimeUavScanGraphic && graphicLayer) {
        graphicLayer.removeGraphic(realtimeUavScanGraphic)
    }
    realtimeUavTrackLine = null
    realtimeUavGraphic = null
    realtimeUavScanGraphic = null
    realtimeUavLastTimestamp = ''
    uavRoutePositions.splice(0, uavRoutePositions.length)
    realtimeUavHasFocusedStart = false
    realtimeUavScanPulse = 0
}

function ensureUavTrackLine() {
    if (realtimeUavTrackLine || !graphicLayer) {
        return
    }
    realtimeUavTrackLine = new mars3d.graphic.PolylineEntity({
        positions: [],
        style: {
            width: 3,
            materialType: mars3d.MaterialType.LineFlowColor,
            materialOptions: {
                color: "#00ffff",
                speed: 10,
                percent: 0.15,
                alpha: 0.25
            }
        }
    })
    graphicLayer.addGraphic(realtimeUavTrackLine)
}

function updateUavTrackLine() {
    ensureUavTrackLine()
    if (realtimeUavTrackLine) {
        realtimeUavTrackLine.positions = [...uavRoutePositions]
    }
}

function startRealtimeUavDisplay() {
    resetRealtimeUavSession()
}

// 关键修改：无人机开始展示时，第一帧坐标到达后立即飞到起始点上方。
function focusRealtimeUavStartPosition(position, heading = 0, altitude = 1000) {
    if (!map?.scene?.camera || !position) {
        return
    }

    const lng = Number(position.lng)
    const lat = Number(position.lat)
    const alt = Number(position.alt ?? altitude ?? 1000)
    if ([lng, lat].some((value) => Number.isNaN(value))) {
        return
    }

    const cameraHeight = Math.max(alt + 1200, 1500)
    map.scene.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(lng, lat, cameraHeight),
        orientation: {
            heading: Cesium.Math.toRadians(Number(heading) || 0),
            pitch: Cesium.Math.toRadians(-70),
            roll: 0
        },
        duration: 0.8
    })
}

function ensureRealtimeUavScanAnimation() {
    if (realtimeUavScanAnimationTimer) {
        return
    }

    realtimeUavScanAnimationTimer = setInterval(() => {
        if (!realtimeUavScanGraphic) {
            return
        }

        realtimeUavScanPulse = (realtimeUavScanPulse + 1) % 120
        const wave = Math.sin((realtimeUavScanPulse / 120) * Math.PI * 2)
        const dynamicAngle = 7 + wave * 1.6
        const dynamicOpacity = 0.55 + (wave + 1) * 0.18

        realtimeUavScanGraphic.style = {
            ...realtimeUavScanGraphic.style,
            angle: dynamicAngle,
            angle2: dynamicAngle,
            opacity: dynamicOpacity
        }
    }, 80)
}

function updateRealtimeUavScanFrustum(position, heading = 0, altitude = 1000) {
    if (!graphicLayer || !position) {
        return
    }

    const groundScanPitch = -180
    const frustumStyle = {
        angle: 8,
        angle2: 8,
        heading,
        pitch: groundScanPitch,
        length: Math.max(Number(altitude) || 1000, 10),
        materialType: mars3d.MaterialType.CylinderWave,
        opacity: 1,
        outline: false,
        color: "#00ffff",
        highlight: {
            color: "#00ffff",
            opacity: 0.9
        }
    }

    if (!realtimeUavScanGraphic) {
        realtimeUavScanGraphic = new mars3d.graphic.FrustumPrimitive({
            position,
            style: frustumStyle,
            asynchronous: false,
            flat: true
        })
        graphicLayer.addGraphic(realtimeUavScanGraphic)
        ensureRealtimeUavScanAnimation()
        return
    }

    realtimeUavScanGraphic.position = position
    realtimeUavScanGraphic.style = {
        ...realtimeUavScanGraphic.style,
        ...frustumStyle
    }
}

function updateRealtimeUavDisplay(payload = {}) {
    const state = payload?.data || payload
    const lng = Number(state?.lon ?? state?.lng)
    const lat = Number(state?.lat)
    if (Number.isNaN(lng) || Number.isNaN(lat) || !graphicLayer) {
        return
    }

    const timestamp = state?.timestamp ?? ''
    if (timestamp && timestamp === realtimeUavLastTimestamp) {
        return
    }

    const alt = Number(state?.alt ?? 1000)
    const heading = Number(state?.yaw ?? 0)
    const position = new mars3d.LngLatPoint(lng, lat, alt)
    const isFirstRealtimeUavPoint = uavRoutePositions.length === 0

    if (!realtimeUavGraphic) {
        realtimeUavGraphic = new mars3d.graphic.ModelEntity({
            position,
            style: {
                url: realtimeUavModelUrl,
                scale: 1,
                minimumPixelSize: 300,
                heading
            }
        })
        graphicLayer.addGraphic(realtimeUavGraphic)
    } else {
        realtimeUavGraphic.position = position
        realtimeUavGraphic.style = {
            ...realtimeUavGraphic.style,
            heading
        }
    }

    const lastPosition = uavRoutePositions[uavRoutePositions.length - 1]
    const shouldAppendPosition = !lastPosition
        || Math.abs(lastPosition[0] - lng) > 0.000001
        || Math.abs(lastPosition[1] - lat) > 0.000001
        || Math.abs((lastPosition[2] || 0) - alt) > 0.1

    if (shouldAppendPosition) {
        uavRoutePositions.push([lng, lat, alt])
        updateUavTrackLine()
    }

    if (isFirstRealtimeUavPoint && !realtimeUavHasFocusedStart) {
        focusRealtimeUavStartPosition(position, heading, alt)
        realtimeUavHasFocusedStart = true
    }

    realtimeUavLastTimestamp = timestamp || realtimeUavLastTimestamp
    updateRealtimeUavScanFrustum(position, heading, alt)
}

function handleRealtimeUavUpdate(payload) {
    updateRealtimeUavDisplay(payload)
}

function handleRealtimeUavVisibilityChange(visible) {
    if (visible) {
        startRealtimeUavDisplay()
        return
    }
    if (!visible) {
        stopRealtimeUavMission()
    }
}
let isClickPoint = false
function map_onclick(event) {
    isClickPoint = true
    map.setCursor(false)
    let cartesian = event.cartesian
    let point = mars3d.LngLatPoint.fromCartesian(cartesian)
    point.format() // 经度、纬度、高度

    eventTarget.fire("clickMap", { point })
    updateMarker(true, point.lng, point.lat, 0)
}
let pointEntity = null
let pointPosition = null
function updateMarker(hasCenter, jd, wd, alt) {
    let position = [jd, wd, alt]
    pointPosition = position
    if (pointEntity == null) {
        pointEntity = new mars3d.graphic.PointEntity({
            position,
            style: {
                color: "#3388ff",
                pixelSize: 10,
                outlineColor: "#ffffff",
                outlineWidth: 2
            }
        })
        map.graphicLayer.addGraphic(pointEntity)
    } else {
        pointEntity.position = position
    }
}

// 关闭气泡
function closePopup() {
    map.closePopup();
}
// 展示气泡详情
function showDetail(data) {
    myPopWindow.value.showDetail(data);
}
function getImg(name) {
    return new URL(`../../assets/img/bigScreen/${name}`, import.meta.url).href;
}

function toggleTo(num, type, label) {
    informationServiceAcitve.value = num;
    const isEdgeProcessing = num === 1;
    informationServiceInfoType.value = isEdgeProcessing ? '边缘处理' : '线下处理';
    value_edge.value = "边缘处理"
    // value_line.value = "线下处理"
    areaLabel.value = label
    let areaName;
    // console.log(label, 'label')
    if (label === '洞庭湖') {
        areaName = 'dongtinghu';
    } else if (label === '资兴州司门') {
        areaName = 'zixing';
    } else {
        areaName = 'gansu';
    }
    getAreaAxis(areaName).then(res => {
        if (res.code === 200) {
            // console.log(res.data)
            const axis = res.data.polyList
            divideX.value = res.data.divideX
            divideY.value = res.data.divideY
            extent = {
                xmin: axis[0][0],
                xmax: axis[1][0],
                ymin: axis[0][1],
                ymax: axis[1][1],
                height: 6000
            }
            car = [axis[2][0], axis[2][1]]
            map.flyToExtent(extent, { duration: 0.5 });
            // bindGraphicDemo2()
            // console.log(isEdgeProcessing, extent)
        }
    }).catch(err => {
        console.log(err)
    })
}

function showDisaster(areaName) {
    getPointData(areaName) // 洞庭湖
        .then(res => {
            if (res.code === 200) {
                res.data.pointList.forEach(item => {
                    createPoint(item)
                })
            }
        }).catch(err => {
            console.log(err)
        })
}

function showRescue(areaName, lng = null, lat = null) {
    getPointData(areaName) // 洞庭湖
        .then(res => {
            if (res.code === 200) {
                res.data.pointList.forEach(item => {
                    createPoint(item, lng, lat)
                })
            }
        }).catch(err => {
            console.log(err)
        })
}



function closeDisaster() {
    // console.log('closeDisaster', pointIdList)
    pointIdList.forEach(id => {
        const graphic = graphicLayer.getGraphicById(id)
        if (graphic == null) {
            // console.log('graphic is null')

        }
        graphicLayer.removeGraphic(graphic)
    })
    pointIdList.splice(0, pointIdList.length)
}

function createPoint(item, lng = null, lat = null) {
    let htmlContent = generateHtml(item.type, "http://" + item.url)
    const baseUrl = item.url.split('/static/')[0];
    // console.log("baseUrl: ", baseUrl)
    if (lng && lat) {
        item.lng = lng
        item.lat = lat
    }
    const graphic = new mars3d.graphic.BillboardEntity({
        position: new mars3d.LngLatPoint(item.lng, item.lat, 0),
        id: item.id,
        style: {

            image: 'http://' + baseUrl + '/static/poly.png',
            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            label: {
                pixelOffsetY: -45,
                horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM
            }
        },
    })
    graphicLayer.addGraphic(graphic)
    pointIdList.push(item.id)
    // 绑定Popup
    graphic.bindTooltip(htmlContent, { offsetY: -30, pointerEvents: true }).openTooltip()
}

function generateHtml(fileType, fileLink) {
    let htmlContent = '';

    if (fileType.includes("image")) {
        htmlContent = `<table style="width:280px;">
            <tr><th scope="col" colspan="4" style="text-align:center;font-size:15px;">灾害现场</th></tr>
            <tr><td colspan="4" style="text-align:center;"><img src="${fileLink}" alt="Image" style="max-width:100%;"></td></tr>
        </table>`;
    } else if (fileType.includes("video")) {
        htmlContent = `<table style="width:140px;">
            <tr><th scope="col" colspan="4" style="text-align:center;font-size:15px;">graphic.bindPopup灾害现场</th></tr>
            <tr><td colspan="4" style="text-align:center;"><video controls style="max-width:100%;"><source src="${fileLink}" type="video/mp4">Your browser does not support the video tag.</video></td></tr>
        </table>`;
    } else {
        htmlContent = `<table style="width:280px;">
            <tr><th scope="col" colspan="4" style="text-align:center;font-size:15px;">graphic.bindPopup局部刷新</th></tr>
            <tr><td>说明：</td><td>Popup鼠标单击信息弹窗2</td></tr>
            <tr><td>方式：</td><td>可以绑定任意html</td></tr>
            <tr><td>备注：</td><td>我是graphic上绑定的Popup</td></tr>
            <tr><td>时间：</td><td id="tdTime"></td></tr>
            <tr><td colspan="4" style="text-align:center;">Unsupported file type</td></tr>
        </table>`;
    }

    return htmlContent;
}

watch(isProcess, (newVal, oldVal) => {

    // console.log(areaLabel.value, "areaLabel.value")
    if (newVal === true && informationServiceAcitve.value === 1) {
        let areaName = '';
        if (areaLabel.value === '洞庭湖') {
            areaName = '洞庭湖';
        } else if (areaLabel.value === '甘肃地震') {
            areaName = '甘肃地震';
        } else if (areaLabel.value === '资兴州司门') {
            areaName = '资兴州司门';
        }

        if (areaName) {
            // console.log(`${areaName}开始处理`);
            ElMessage({
                message: `${areaName}开始处理`,
                type: 'success'
            });
            const axis = [
                [extent.xmin, extent.ymin, 0],
                [extent.xmin, extent.ymax, 0],
                [extent.xmax, extent.ymax, 0],
                [extent.xmax, extent.ymin, 0],
                [extent.xmin, extent.ymin, 0]
            ];
            addUAVPath(graphicLayer, axis, areaName);
        }
    }

    if (newVal === false) {
        // console.log('处理结束')
        // ElMessage({
        //     message: '处理结束',
        //     type: 'success'
        // })
        graphicLayer.clear()
        // console.log(graphicQueue.length)
        graphicQueue.splice(0, graphicQueue.length)
        graphicQueueLocal.splice(0, graphicQueueLocal.length)
        graphicInterval && clearInterval(graphicInterval)
        graphicInterval = null
        stopRealtimeUavMission()
        clearOverlayRegistry()
    }
})

// watch(isTrans, (newVal, oldVal) => {
//     if (newVal === true && informationServiceAcitve.value === 1
//         && options_edge[informationServiceAcitve.value - 1].label === '洞庭湖') {
//         // console.log('开始传输')
//         ElMessage({
//             message: '开始传输',
//             type: 'success'
//         })
//         return
//     }
//     else if (newVal === true && informationServiceAcitve.value === 1
//         && options_edge[informationServiceAcitve.value - 1].label === '甘肃地震') {
//         // console.log('开始传输')
//         ElMessage({
//             message: '开始传输',
//             type: 'success'
//         })
//         return
//     }
//     else if (newVal === true && informationServiceAcitve.value === 1
//         && options_edge[informationServiceAcitve.value - 1].label === '资兴州司门') {
//         // console.log('开始传输')
//         ElMessage({
//             message: '开始传输',
//             type: 'success'
//         })
//         return
//     }

//     if (newVal === false) {
//         // console.log('传输结束')
//         ElMessage({
//             message: '传输结束',
//             type: 'success'
//         })
//     }
// })



let lngmin = 102.845626
let lngmax = 102.884449
let latmin = 35.879596
let latmax = 35.844757
let x_num = 6
let y_num = 10
let rotatePoint
let graphicLine
// let frameNum = 0
let endNum = 35
let graphicInterval = null
let receivedList = []
let eventTarget = null

const arrColor = [new Cesium.Color(1.0, 0.0, 0.0, 0.3), new Cesium.Color(0.0, 1.0, 0, 0.3), new Cesium.Color(0.0, 0.0, 1, 0.3)]

function addUAVPath(graphicLayer, positions, area) {
    rotatePoint = new mars3d.thing.RotatePoint({
        direction: false, // 方向 true逆时针，false顺时针
        time: 120 // 给定飞行一周所需时间(单位 秒)，控制速度
        // autoStopAngle: 360, //到达指定角度后自动停止
    })
    map.addThing(rotatePoint)
    setTimeout(() => {
        const graphic = new mars3d.graphic.PolygonEntity({
            positions,
            style: {
                color: "#ffff00",
                outline: true,
                outlineWidth: 2,
                outlineColor: "#00ffff"
            }
        })
        graphicLayer.addGraphic(graphic)

        graphic.startFlicker({
            time: 2, // 闪烁时长（秒）
            onEnd: function () {
                // 结束后自动移除
                graphic.style = { fill: false }
                let areaName = ''
                if (area === '洞庭湖') {
                    receivedList.push('dongtinghu')
                    receivedList.push('dongtinghu_uav')
                    areaName = 'dongtinghu'
                    newSection.value.areaChange(areaName)
                    startRoam(extent.xmin, extent.xmax, extent.ymin, extent.ymax, divideX.value, divideY.value, divideX.value, divideY.value, 1000)
                    // startRoam(extent.xmin, extent.xmax, extent.ymin, extent.ymax, divideX.value, divideY.value, 5, 10, 1000, 0, 1)
                }
                else if (area === '甘肃地震') {
                    receivedList.push('gansu')
                    receivedList.push('gansu_uav')
                    areaName = 'gansu'
                    newSection.value.areaChange(areaName)
                    startRoam(extent.xmin, extent.xmax, extent.ymin, extent.ymax, divideX.value, divideY.value, divideX.value, divideY.value, 1000)
                }
                else if (area === '资兴州司门') {
                    receivedList.push('zixing')
                    receivedList.push('zixing_uav')
                    areaName = 'zixing'
                    newSection.value.areaChange(areaName)
                    startRoam(extent.xmin, extent.xmax, extent.ymin, extent.ymax, divideX.value, divideY.value, 9, 9, 1000, 20, 12)
                    // startRoam(extent.xmin, extent.xmax, extent.ymin, extent.ymax, divideX.value, divideY.value, divideX.value, divideY.value, 1000)
                }
                graphicLayer.removeGraphic(graphic)
            }
        })
    }, 100)
}

function calculateDistance(point, CesiumPosition) {
    const pathPosition = Cesium.Cartesian3.fromDegrees(
        point[0],
        point[1],
        point[2]
    );
    const distanceX = Math.abs(pathPosition.x - CesiumPosition.x);
    const distanceY = Math.abs(pathPosition.y - CesiumPosition.y);
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
    return distance;
}

function addDemoGraphic(graphicLayer, startPoint, endPoint) {
    const positions = mars3d.PolyUtil.getLinkedPointList(startPoint, endPoint, 20000, 50) // 计算曲线点

    graphicLine = new mars3d.graphic.PolylineEntity({
        positions,
        style: {
            width: 5,
            materialType: mars3d.MaterialType.LineFlowColor,
            materialOptions: {
                color: "#00ffff",
                speed: 10,
                percent: 0.15,
                alpha: 0.2
            }
        },
    })
    graphicLayer.addGraphic(graphicLine)
}

function startRoam(lngmin, lngmax, latmin, latmax, x_num, y_num, x_all, y_all, height = 500, x_min = 0, y_min = 0) {

    const pathObj = planRoute(lngmin, lngmax, latmin, latmax, x_num, y_num, x_all, y_all, height, x_min, y_min)

    if (!timeModeFlag.value) {
        // 检查isClickPoint
        console.log("pointEntity.position", pointPosition)
        pathObj.path = [pathObj.path[0], [pointPosition[0], pointPosition[1], 1000]]
        console.log("pathObj.path is ", pathObj.path)
    }
    // console.log(pathObj.blockOrder)
    const graphic = new mars3d.graphic.PolygonEntity({
        positions: pathObj.new_position,
        style: {
            fill: false,
            outline: true,
            outlineWidth: 2,
            outlineColor: "#00ffff"
        }
    })
    map.flyToExtent({
        xmin: pathObj.new_position[0][0],
        xmax: pathObj.new_position[2][0],
        ymin: pathObj.new_position[0][1],
        ymax: pathObj.new_position[2][1],
        height: 2500
    }, { duration: 0.5 });
    graphicLayer.addGraphic(graphic)

    let axis = [car[0], car[1], 0]
    // mars3d.PointUtil.getSurfaceTerrainHeight(map.scene, [(lngmin + lngmax) / 2, (latmin + latmax) / 2, 0]).then((result) => {
    //     axis = [(lngmin + lngmax) / 2, (latmin + latmax) / 2, result.height]
    // })
    let endBlock = x_all * y_all - 1
    setTimeout(() => {
        const CarGraphic = new mars3d.graphic.ModelEntity({
            position: axis,
            style: {
                url: "//data.mars3d.cn/gltf/imap/82bd55706595471793aed25081d923d3/gltf/gltf2.gltf",
                scale: 0.2,
                minimumPixelSize: 50
            }
        })
        graphicLayer.addGraphic(CarGraphic)
    }, 500)
    // console.log("I m here")
    let fixedRoute = null
    getServerIp().then(res => {
        if (res.code === 200) {
            const ip = res.data.ip
            fixedRoute = new mars3d.graphic.FixedRoute({
                name: "无人机航拍",
                speed: timeModeFlag.value ? 3000 : 2000,
                positions: pathObj.path,
                model: {
                    url: "http://" + ip + ":8088/v2/static/uav.gltf",
                    // url: '//data.mars3d.cn/gltf/imap/82bd55706595471793aed25081d923d3/gltf/gltf2.gltf',
                    scale: 1,
                    minimumPixelSize: 100,
                },
                path: {
                    color: "#83af9b",
                    width: 2,
                    leadTime: 0,
                    // opacity: 0.5,
                },
                // coneTrack: {
                //     angle: 15, // 半场角度
                //     color: "rgba(255,0,255,0.5)"
                // }
            })

            graphicLayer.addGraphic(fixedRoute)
            fixedRoute.start()
            let graphicFrustum
            let flydis = -1
            let frameNum = 0
            const endPoint = Cesium.Cartesian3.fromDegrees(car[0], car[1], 0)
            addDemoGraphic(graphicLayer, fixedRoute.position, endPoint)
            loadPic(fixedRoute, pathObj, endPoint, graphicFrustum, flydis, frameNum, endBlock)
        }
    }).catch(err => {
        console.log(err)
    })

    // frameNum = -1
}

function loadPic(fixedRoute, pathObj, endPoint, graphicFrustum, flydis, frameNum, endBlock) {
    const intervalId = setInterval(() => {
        if (fixedRoute.position && endPoint) {
            graphicLine.positions = mars3d.PolyUtil.getLinkedPointList(fixedRoute.position, endPoint, 20000, 50);
        } else {
            console.error('fixedRoute.position or endPoint is undefined');
            clearInterval(intervalId);
        }
    }, 500);
    fixedRoute.on(mars3d.EventType.change, function () {
        flydis = ++flydis % 100
        perc.value = (frameNum / endBlock).toFixed(2)
        if (!isRotate) {
            rotatePoint.stop()
        }
        const distance = calculateDistance(pathObj.path[frameNum], fixedRoute.position)

        if (pathObj.path.length - 1 === frameNum) {
            return
        } else {
            const nextdistance = calculateDistance(pathObj.path[frameNum + 1], fixedRoute.position)
            if (distance > nextdistance) {
                frameNum++
                if (isRotate) {
                    rotatePoint.stop()
                    rotatePoint.start(pathObj.path[frameNum]);
                } else {
                    rotatePoint.stop()
                }
            } else {
                if (flydis === 0) {
                    graphicFrustum = new mars3d.graphic.FrustumPrimitive({
                        position: fixedRoute.position,
                        style: {
                            angle: 8,
                            angle2: 8,
                            heading: fixedRoute.heading,
                            pitch: -180, // 俯视
                            // materialType: mars3d.MaterialType.CircleWave,
                            length: Cesium.Cartographic.fromCartesian(fixedRoute.position).height,
                            materialType: mars3d.MaterialType.CylinderWave,
                            opacity: 1,
                            outline: false,
                            color: "#00ffff",
                            highlight: {
                                color: "#00ffff",
                                opacity: 0.9
                            }
                        },
                        asynchronous: false,
                        flat: true
                    })

                    graphicLayer.addGraphic(graphicFrustum)
                }
                else if (flydis === 50 && graphicFrustum) {
                    graphicLayer.removeGraphic(graphicFrustum)
                    graphicFrustum = null
                }
                return
            }
        }
        if (!graphicInterval && timeModeFlag.value) {
            graphicInterval = setInterval(() => {
                processResult(receivedList).then(res => {
                    if (res.code === 200) {
                        // ElMessage({
                        //     message: '获取数据成功',
                        //     type: 'success'
                        // })
                        // console.log(res.data.fileList)
                        let resList = res.data.fileList
                        resList.forEach(item => {
                            processImageList.push(item)
                            // console.log("I got this")
                        })

                        processImageList.forEach(item => {
                            const itemName = item.fileName
                            const regex = /_(\d+)_(\d+)\.png$/;
                            const match = itemName.match(regex);
                            const y = match[1];
                            const x = match[2];
                            // console.log(pathObj.blockOrder)
                            // console.log("x: ", x, "y: ", y)
                            const position = pathObj.blockOrder.findIndex(block => block.x === x && block.y === y);
                            if (position <= frameNum && pathObj) {

                                // console.log("image: ", pathObj.blockOrder[position])
                                if (pathObj.blockOrder[position].flag || itemName.includes('A')) {
                                    // 退出本次循环但是不结束整个循环
                                    const graphic = new mars3d.graphic.PolygonPrimitive({
                                        positions: convertToSurroundingPoints(item),
                                        style: {
                                            // color: arrColor[graphicLayer.length % arrColor.length],
                                            image: "http://" + item.path,
                                            clampToGround: true,
                                            // image: `http://localhost:8088/v2/images/gansu/UAV_00_00.png`,
                                            // stRotationDegree: fixedRoute.model.heading,
                                            zIndex: itemName.includes('A') ? graphicLayer.length + 1000 : graphicLayer.length
                                        }
                                    })
                                    console.log("fileName: ", item.fileName, convertToSurroundingPoints(item))
                                    pathObj.blockOrder[position].flag = true
                                    graphicLayer.addGraphic(graphic)
                                    graphicQueue.push(
                                        {
                                            id: graphic.id,
                                            name: item.fileName,
                                            type: item.fileDate,
                                            source: 'realtime-transfer',
                                            graphic: graphic.show
                                        })

                                    graphicQueueLocal.push({
                                        id: graphic.id,
                                        graphic: graphic
                                    })
                                    // 将graphic添加到processStore中
                                    // if (itemName.includes('A')) {
                                    //     // 处理的数据
                                    //     processStore.addToProcessList(
                                    //         {
                                    //             id: graphic.id,
                                    //             name: item.fileName,
                                    //             type: item.fileDate,
                                    //             graphic: graphic.show
                                    //         }
                                    //     )
                                    // }
                                    // else {
                                    //     // 采集的数据
                                    //     processStore.addToCollectList(
                                    //         {
                                    //             id: graphic.id,
                                    //             name: item.fileName,
                                    //             type: item.fileDate,
                                    //             graphic: graphic.show
                                    //         }
                                    //     )
                                    // }
                                    // processStore.addToPatchList({
                                    //     id: graphic.id,
                                    //     graphic: graphic
                                    // })
                                    processImageList = processImageList.filter(item => item.fileName !== itemName);
                                }

                            }

                        });

                    }
                }).catch(err => {
                    console.log(err)
                })
            }, 500)
        }
        else if (timeModeFlag.value === false) {
            if (graphicInterval) {
                clearInterval(graphicInterval)
                graphicInterval = null
            }



            graphicFrustum = new mars3d.graphic.FrustumPrimitive({
                position: fixedRoute.position,
                style: {
                    angle: 8,
                    angle2: 8,
                    heading: fixedRoute.heading,
                    pitch: -180, // 俯视
                    // materialType: mars3d.MaterialType.CircleWave,
                    length: Cesium.Cartographic.fromCartesian(fixedRoute.position).height,
                    materialType: mars3d.MaterialType.CylinderWave,
                    opacity: 1,
                    outline: false,
                    color: "#00ffff",
                    highlight: {
                        color: "#00ffff",
                        opacity: 0.9
                    }
                },
                asynchronous: false,
                flat: true
            })

            graphicLayer.addGraphic(graphicFrustum)
            // 稍微慢一点
            setTimeout(() => {
                showRescue(receivedList[0] + "_res", pointPosition[0], pointPosition[1])
            }, 2000)

        }

        // graphicLayer.addGraphic(graphic2)
        // graphicLayer.addGraphic(graphic)
        // graphicQueue.push(
        //     {
        //         id: graphic.id,
        //         name: `评估影像${frameNum}`,
        //         type: new Date().toLocaleString('zh-CN', { hour12: false, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
        //         graphic: graphic.show
        //     })
        // graphicQueue.push(
        //     {
        //         id: graphic2.id,
        //         name: `灾害影像${frameNum}`,
        //         type: new Date().toLocaleString('zh-CN', { hour12: false, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
        //         graphic: graphic2.show
        //     })
        // graphicQueueLocal.push({
        //     id: graphic.id,
        //     graphic: graphic
        // })
        // graphicQueueLocal.push({
        //     id: graphic2.id,
        //     graphic: graphic2
        // })
        // console.log(graphicLayer.graphics)
    })
}

function convertToSurroundingPoints(item) {
    const surroundingPoints = [
        [item.lngmin, item.latmax, 0],

        [item.lngmax, item.latmax, 0],
        [item.lngmax, item.latmin, 0],
        [item.lngmin, item.latmin, 0]
    ]
    return surroundingPoints
}

let processImageList = reactive([])

watch(graphicQueue, (newVal, oldVal) => {
    newVal.forEach(item => {
        const graphicItem = graphicQueueLocal.find(g => g.id === item.id)
        if (!graphicItem?.graphic) {
            return
        }
        if (item.graphic != graphicItem.graphic.show) {
            graphicItem.graphic.show = item.graphic
        }
    })
})

function showgraphic(lngmax, lngmin, latmax, latmin, id, selected, image, hasLegend, isShp = false) {
    if (selected) {

        if (isShp === true && image.includes('Economic_Belt')) {
            shpLayer1 = new Shp2JsonLayer({
                id: "shpLayer1",
                url: "http://" + image,
                encoding: "utf-8",
                simplify: { tolerance: 0.0001 },
                symbol: {
                    type: "polygon",
                    styleOptions: {
                        fill: true,
                        color: "#808080", // 随机色
                        opacity: 0.3,
                        clampToGround: false,
                        outline: true,
                        // outlineStyle: {
                        //     width: 3,
                        //     color: "#FED976"
                        // },
                        // 高亮时的样式
                        highlight: {
                            opacity: 0.6,
                            outline: true,
                            outlineStyle: {
                                width: 2,
                                color: "#808080",
                                addHeight: 10
                            }
                        }
                    }
                },
                popup: "all",
                flyTo: true
            })
            map.addLayer(shpLayer1)
        }
        else if (isShp === true && image.includes('province')) {

            shpLayer2 = new Shp2JsonLayer({
                id: "shpLayer2",
                url: "http://" + image,
                encoding: "utf-8",
                simplify: { tolerance: 0.0001 },
                symbol: {
                    type: "polygon",
                    styleOptions: {
                        fill: true,
                        color: "#08F3FE", // 随机色
                        opacity: 0.6,
                        clampToGround: false,
                        outline: true,
                        // outlineStyle: {
                        //     width: 3,
                        //     color: "#FED976"
                        // },
                        // 高亮时的样式
                        highlight: {
                            opacity: 0.6,
                            outline: true,
                            outlineStyle: {
                                width: 2,
                                color: "#08F3FE",
                                addHeight: 10
                            }
                        }
                    }
                },
                popup: "all",
                flyTo: true
            })
            map.addLayer(shpLayer2)
        }
        else if (isShp === true && image.includes('four')) {

            shpLayer2 = new Shp2JsonLayer({
                id: "shpLayer3",
                url: "http://" + image,
                encoding: "utf-8",
                simplify: { tolerance: 0.0001 },
                symbol: {
                    type: "polygon",
                    styleOptions: {
                        fill: true,
                        color: "#08F3FE", // 随机色
                        opacity: 0.6,
                        clampToGround: false,
                        outline: true,
                        outlineStyle: {
                            width: 5,
                            color: "#FED976"
                        },
                        // 高亮时的样式
                        highlight: {
                            opacity: 0.6,
                            outline: true,
                            outlineStyle: {
                                width: 2,
                                color: "#08F3FE",
                                addHeight: 10
                            }
                        }
                    }
                },
                popup: "all",
                flyTo: true
            })
            map.addLayer(shpLayer2)
        }
        else {
            // console.log(lngmax, lngmin, latmax, latmin, id, selected, image)
            let positions = [
                [lngmin, latmax, 0],
                [lngmax, latmax, 0],
                [lngmax, latmin, 0],
                [lngmin, latmin, 0]
            ]
            const graphic = new mars3d.graphic.PolygonPrimitive({
                positions,
                id,
                style: {
                    // color: arrColor[graphicLayer.length % arrColor.length],
                    image: "http://" + image,
                    // stRotationDegree: fixedRoute.model.heading,
                    zIndex: graphicLayer.length + 2000,
                    clampToGround: true
                }
            })
            graphicLayer.addGraphic(graphic)
            let extent = {
                xmin: lngmin,
                xmax: lngmax,
                ymin: latmin,
                ymax: latmax,
                height: 10000
            };
            map.flyToExtent(extent, {
                duration: 0.5,
                zoom: 15, // 根据需要调整缩放级别
                bearing: 30, // 设置方向角度，范围为 -180 到 180
            })

            isVis1.value = hasLegend
        }

    } else {
        if (isShp == true) {
            const layer = map.getLayerById(id)
            // console.log(layer.id, "remove")
            if (layer) {
                map.removeLayer(layer, true)
            }
            return
        }
        // console.log(lngmax, lngmin, latmax, latmin, id, selected, image, "remove")
        const graphic = graphicLayer.getGraphicById(id)
        // console.log("graphic is:", graphic)
        graphicLayer.removeGraphic(graphic)
        isVis1.value = false
    }

}






/**
 * 规划从起始块到终止块的S形路径
 * 
 * @param {number} lngmin - 显示区域的最小经度
 * @param {number} lngmax - 显示区域的最大经度
 * @param {number} latmin - 显示区域的最小纬度
 * @param {number} latmax - 显示区域的最大纬度
 * @param {number} x_num - 区域块划分的列数
 * @param {number} y_num - 区域块划分的行数
 * @param {number} startBlock - 起始块的索引
 * @param {number} endBlock - 终止块的索引
 * @param {number} height - 飞行高度
 * @returns {Array} 路径点数组，每个路径点包含经纬度坐标
 * @example planRoute(102.865626, 102.877301, 35.851528, 35.879791, 6, 10, 0, 59, 300)
 */
function planRoute(lngmin, lngmax, latmin, latmax, x_num, y_num, x_all, y_all, height = 3000, x_min = 0, y_min = 0) {
    // 计算每个块的宽度和高度
    const xd = (lngmax - lngmin) / x_num;
    const yd = (latmax - latmin) / y_num;

    // 计算每个块的中心点和周围的四个点
    const centers = [];
    const surroundingPoints = [];
    for (let i = 0; i < y_num; i++) {
        for (let j = 0; j < x_num; j++) {
            const centerX = lngmin + (j + 0.5) * xd;
            const centerY = latmin + (i + 0.5) * yd;
            centers.push([centerX, centerY, height]);

            // 计算周围的四个点
            const topLeft = [centerX - xd / 2, centerY + yd / 2, 0];
            const topRight = [centerX + xd / 2, centerY + yd / 2, 0];
            const bottomLeft = [centerX - xd / 2, centerY - yd / 2, 0];
            const bottomRight = [centerX + xd / 2, centerY - yd / 2, 0];
            surroundingPoints.push([topLeft, topRight, bottomRight, bottomLeft]);
        }
    }

    // 获取起始块和终止块的坐标
    const startX = x_min;
    const startY = y_min;
    const endX = startX + x_all - 1;
    const endY = startY + y_all - 1;

    // 生成 S 形路径
    const path = [];
    const pathSurroundingPoints = [];
    const blockOrder = [];
    let direction = 1; // 1 表示向右，-1 表示向左
    for (let y = startY; y <= endY; y++) {
        if (direction === 1) {
            for (let x = startX; x <= endX; x++) {
                const index = y * x_num + x;
                path.push(centers[index]);
                pathSurroundingPoints.push(surroundingPoints[index]);
                blockOrder.push({
                    x: String(x).padStart(2, '0'),
                    y: String(y).padStart(2, '0'),
                    flag: false
                });
            }
        } else {
            for (let x = endX; x >= startX; x--) {
                const index = y * x_num + x;
                path.push(centers[index]);
                pathSurroundingPoints.push(surroundingPoints[index]);
                blockOrder.push({
                    x: String(x).padStart(2, '0'),
                    y: String(y).padStart(2, '0'),
                    flag: false
                });
            }
        }
        direction *= -1; // 改变方向
    }

    // 计算开始块的左上角坐标和结束块的右下角坐标
    const startBlockTopLeft = [
        lngmin + startX * xd,
        latmin + startY * yd
    ];
    const endBlockBottomRight = [
        lngmin + (endX + 1) * xd,
        latmin + (endY + 1) * yd
    ];
    const new_position = [
        [startBlockTopLeft[0], startBlockTopLeft[1], 0],
        [endBlockBottomRight[0], startBlockTopLeft[1], 0],
        [endBlockBottomRight[0], endBlockBottomRight[1], 0],
        [startBlockTopLeft[0], endBlockBottomRight[1], 0]
    ]

    return { path, pathSurroundingPoints, blockOrder, new_position };
}
</script>
<style lang="scss" src="./bigScreen.scss"></style>
<style lang="scss" scoped>
.body-overflow {
    :deep(.body) {
        overflow: hidden;
    }
}

.custom-select {
    background: linear-gradient(270deg, rgba(30, 55, 71, 0.8) 0%, rgba(14, 200, 217, 0.3) 100%);
    cursor: pointer;
    width: 120px;
    margin-top: -10px;
    transform: translateX(-20px);
    /* 向左移动 */
}

.page-btn {
    width: 155px;
    height: 48px;
    line-height: 48px;
    text-align: center;
    font-size: 18px;
    color: #EAEDF2;
    margin-top: 24px;
    background: url("@/assets/img/bigScreen/btn_head.png") no-repeat center;
    background-size: 100% 100%;
    position: absolute;
    top: -10px;
    /* 定位到顶部 */
    right: 250px;
    /* 定位到右侧 */
    cursor: pointer;
    z-index: 2;
}

.page-btn.active,
.page-btn:hover {
    background: url("@/assets/img/bigScreen/btn_head_active.png") no-repeat center;
    background-size: 100% 100%;
    color: #FBFFC7;
}

.screen-workbench-toggle {
    left: 250px;
    right: auto;
}

.big-page {
    height: 100vh;
    width: 100%;
    overflow: hidden;
    position: relative;
    // background: #010814 url("@/assets/img/bigScreen/bg.png") center center no-repeat;
    background-size: cover;
}

.big-screen-stage {
    position: absolute;
    left: 50%;
    top: 50%;
    transform-origin: center center;
}

.big-screen-shell {
    width: 100%;
    height: 100%;
    background-size: 100% 100%;
    position: relative;



    .bg {
        background: url("@/assets/img/bigScreen/bg.png") center no-repeat;
        background-size: 100% 100%;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 1;
        pointer-events: none;

    }

    .legend-box {
        position: absolute;
        display: flex;
        left: 500px;
        bottom: 40px;
        // 字体白色

        z-index: 1000;

        .legend-item {
            display: flex;
            align-items: center;
            margin: 10px 10px;

            .color-box-1 {
                width: 20px;
                height: 20px;
                background-color: rgb(255, 255, 255);
                /* 你可以根据需要更改颜色 */
                margin-right: 10px;
            }

            .color-box-2 {
                width: 20px;
                height: 20px;
                background-color: rgb(0, 255, 0);
                /* 你可以根据需要更改颜色 */
                margin-right: 10px;
            }

            .color-box-3 {
                width: 20px;
                height: 20px;
                background-color: rgb(255, 170, 0);
                /* 你可以根据需要更改颜色 */
                margin-right: 10px;
            }

            .color-box-4 {
                width: 20px;
                height: 20px;
                background-color: rgb(255, 0, 0);
                /* 你可以根据需要更改颜色 */
                margin-right: 10px;
            }

            .color-box-5 {
                width: 20px;
                height: 20px;
                background-color: rgb(252, 250, 205);
                /* 你可以根据需要更改颜色 */
                margin-right: 10px;
            }

            .color-box-6 {
                width: 20px;
                height: 20px;
                background-color: rgb(0, 123, 79);
                /* 你可以根据需要更改颜色 */
                margin-right: 10px;
            }

            .color-box-7 {
                width: 20px;
                height: 20px;
                background-color: rgb(157, 221, 106);
                /* 你可以根据需要更改颜色 */
                margin-right: 10px;
            }

            .color-box-8 {
                width: 20px;
                height: 20px;
                background-color: rgb(77, 208, 159);
                /* 你可以根据需要更改颜色 */
                margin-right: 10px;
            }

            .color-box-9 {
                width: 20px;
                height: 20px;
                background-color: rgb(111, 208, 242);
                /* 你可以根据需要更改颜色 */
                margin-right: 10px;
            }

            .color-box-10 {
                width: 20px;
                height: 20px;
                background-color: rgb(10, 78, 151);
                /* 你可以根据需要更改颜色 */
                margin-right: 10px;
            }

            .color-box-11 {
                width: 20px;
                height: 20px;
                background-color: rgb(155, 36, 22);
                /* 你可以根据需要更改颜色 */
                margin-right: 10px;
            }

            .color-box-12 {
                width: 20px;
                height: 20px;
                background-color: rgb(127, 127, 127);
                /* 你可以根据需要更改颜色 */
                margin-right: 10px;
            }

            .color-box-13 {
                width: 20px;
                height: 20px;
                background-color: rgb(255, 255, 255);
                /* 你可以根据需要更改颜色 */
                margin-right: 10px;
            }

            .color-box-14 {
                width: 20px;
                height: 20px;
                background-color: rgb(207, 203, 206);
                /* 你可以根据需要更改颜色 */
                margin-right: 10px;
            }

            .legend-text {
                font-size: 14px;
                color: #fff;
            }
        }


    }

    .center-map {
        width: 100%;
        height: 100%;
        position: absolute;
        margin: auto;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 0;
    }

    .center-satellite {
        opacity: 1;
        transition: opacity 2s;

        &.active {
            opacity: 0;
            pointer-events: none;
        }
    }

    .goBack {
        width: 72px;
        height: 32px;
        background: url("@/assets/img/bigScreen/goBack.png") center no-repeat;
        background-size: 100% 100%;
        position: absolute;
        top: 14px;
        right: -100px;
        cursor: pointer;
    }

    .detail-page {
        width: 430px;
        position: absolute;
        top: 86px;
        bottom: 20px;
        z-index: 99;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        gap: 15px;

        &.left {
            left: 20px;
            align-items: stretch;

            .center,
            .top {
                flex: 0 0 calc(50% - 7.5px);
                height: calc(50% - 7.5px);
                min-height: 0;
            }

            &.workbench-expanded {
                width: 700px;
                bottom: 32px;

                .workbench-stage {
                    flex: 1 1 auto;
                    height: 100%;
                    min-height: 0;

                    :deep(.title) {
                        display: none;
                    }

                    :deep(.body) {
                        height: 100%;
                        padding-top: 0;
                    }
                }
            }
        }

        &.right {
            right: 20px;
        }

        .news {
            height: calc(47% - 7.5px - 50px);
        }

        .access {
            height: calc(47% - 7.5px + 100px);
        }

        .top,
        .center,
        .bottom {
            flex: 1;
            box-sizing: border-box;

            .btn {
                width: max-content;
                color: #FFF;
                font-size: 16px;
                padding: 5px 10px;
                border-radius: 1px;
                border: 1px solid rgba(141, 253, 255, 0.7);
                background: linear-gradient(270deg, rgba(30, 55, 71, 0.8) 0%, rgba(14, 200, 217, 0.3) 100%);
                cursor: pointer;
                margin-left: 2px;

                &.active,
                &:hover {
                    background: linear-gradient(136deg, rgba(51, 221, 255, 0.4) 7.84%, rgba(134, 239, 246, 0.9) 94.16%), rgba(4, 25, 66, 0.60);
                }
            }
        }
    }
}

.center-title {
    width: 850px;
    height: 85px;
    position: absolute;
    left: 50%;
    top: 0;
    transform: translate(-50%);
    z-index: 100;
    pointer-events: none;

    .content {
        width: max-content;
        font-size: 32px;
        text-align: center;
        text-shadow: 0 4px 4px rgba(0, 0, 0, 0.45);
        letter-spacing: 2px; //两条属性要一起使用
        text-indent: 20px;
        position: absolute;
        left: 47%;
        top: 12px;
        transform: translate(-50%);
        font-weight: 600;
    }
}

.legend {
    top: 116px;
    right: 23.3%;
    position: absolute;
    width: 200px;
    // height: 400px;
    z-index: 1000;
    background: url("@/assets/img/bigScreen/legend/legend-bg.png") center no-repeat;
    background-size: 100% 100%;
    padding: 20px 10px;
    box-sizing: border-box;
    transform: scale(70%);
    transform-origin: 100% 0%;

    .legend-checkbox {
        display: flex;
        flex-direction: column;
        padding: 10px;
    }

    .legend-item {
        height: 50px;
        margin-bottom: 5px;
        display: flex;
        align-items: center;
        justify-content: flex-end;

        .legend-text {
            color: #BDCBC3;
            font-size: 14px;
            width: fit-content;
            line-height: 28px;
            padding: 0 10px 0 10px;
            // background: linear-gradient(270deg, rgba(4, 25, 66, 0.80) 0%, rgba(51, 136, 255, 0.24) 100%);
            background: url("@/assets/img/bigScreen/legend_bg.png") no-repeat center;
            background-size: 100% 100%;
            text-align: right;

            &.active {
                color: #fff;
            }
        }

        .legend-img {
            width: 50px;
            height: 50px;
            margin-left: 8px;
            cursor: pointer;
            transform: scale(0.8);

            >img {
                width: 50px;
                height: 50px;
            }
        }
    }
}

.multiplier-speed {
    position: absolute;
    left: 74%;
    bottom: 35px;
    display: flex;
    align-items: center;
    justify-content: center;

    &.active {
        background: #3ea6ff;
        color: #fff;
        fill: #fff;
        border-color: #aef;
        box-shadow: 0 0 8px #fff;
    }

    img {
        width: 20px;
        height: 20px;
    }
}

.multiplier-speed-box {
    position: absolute;
    left: 69.5%;
    bottom: 20px;
    padding: 6px;
    padding-bottom: 0;
    gap: 8px;
    border-radius: 4px;
    border: 1px solid rgba(96, 169, 255, 0.50);
    background: #042250;
    box-shadow: 0px 0px 65px 0px rgba(0, 0, 0, 0.65);

    &::after {
        content: " ";
        width: 0;
        height: 0;
        position: absolute;
        right: -14px;
        bottom: 26px;
        transform: rotateZ(90deg);
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        border-bottom: 10px solid #3265A7
    }

    .item {
        font-size: 14px;
        padding: 2px 0px;
        margin-bottom: 6px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;

        &.active {
            border-radius: 4px;
            background: linear-gradient(136deg, rgba(51, 136, 255, 0.40) 7.84%, rgba(134, 211, 246, 0.90) 94.16%), rgba(4, 25, 66, 0.20);
        }
    }
}
</style>
