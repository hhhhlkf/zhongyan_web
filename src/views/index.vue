<!--
 * @Author: pmy
 * @Date: 2023-08-09 10:16:50
 * @LastEditors: pmy
 * @LastEditTime: 2023-10-31 09:16:03
 * @FilePath: \system\src\views\index.vue
 * @Description: 
 * Copyright (c) 2023 by pmy/exsun, All Rights Reserved. 
-->
<template>
    <div class="home" v-loading="loading">
        <!-- 地图 -->
        <div id="wtMap"></div>

        <!-- 工具栏 -->
        <mapTool class="leftTopTool" :show="true" :map="reactMap.map"></mapTool>

        <!-- 图例 -->
        <ul class="legend">

            <div class="legend-head">
                <div class="blue-ractangle"></div>
                <span>地图图例</span>
                <div class="check-all-btn" @click="checkAllToggle">{{ mapChecked.length != legendArr.length ? "全选" :
                    "取消" }}</div>
            </div>
            <el-checkbox-group v-model="mapChecked" @change="handleLegendChange" class="legend-checkbox">
                <el-checkbox :label="v.img" v-for="v in legendArr" :key="v[0]">
                    <img :src="myRequire('legend/' + v.img + '.png')" alt="" style="vertical-align: text-top;">
                    {{ v.name }}({{ v.arr.length }})
                </el-checkbox>
            </el-checkbox-group>
        </ul>



        <!-- 右侧窗体 -->
        <div class="right-window" :style="{ width: boxWidth + 'px' }">
            <div class="scroll-dom" @mousedown="startDrag">
                <img src="@/assets/img/tree/scroll.png" />
            </div>
            <ul class="type-selection">
                <li :class="{ active: activeWindow == 'terminalDevice' }" @click="activeWindow = 'terminalDevice'">
                    <span class="text">终端设备</span>
                    <span class="number">{{ deviceList.length }}</span>
                </li>
                <li :class="{ active: activeWindow == 'imageData' }" @click="activeWindow = 'imageData'">
                    <span class="text">影像数据</span>
                    <span class="number">{{ striographCount }}</span>
                </li>
            </ul>
            <div class="tree-dom">
                <equipTree ref="myETree" :treeList="equipTreeData" :nodeClick="equipTreeClick"
                    :dataRefresh="addMapLayers" v-show="activeWindow == 'terminalDevice'"></equipTree>
                <vTree ref="myVTree" :treeList="striographTreeData" :handleCheckChange="handleImageCheck"
                    :nodeClick="imageTreeClick" :dataRefresh="getStriographTreeData"
                    v-show="activeWindow == 'imageData'">
                </vTree>
            </div>
        </div>




    </div>
</template>
<script setup name="Index">
let wbMap = null, popLayer = {}, popsHash = {}, MapPopContent = null, thePop = L.popup({
    maxWidth: undefined,
    offset: L.point(0, -8),
    autoPanPaddingBottomRight: L.point(280, 0),
    minWidth: 200, // 设置最小宽度
    closeOnClick: false, // 禁止点击地图关闭 Popup
    autoClose: false, // 禁止自动关闭 Popup
    closeButton: false // 禁止显示关闭按钮
})
// 遥感影像图层
let rsLayer;
// 记录已经勾选上的影像
let imageHash = {};
import useAppStore from '@/store/modules/app'
import { TreeCreate, countLeaves } from '@/utils/createTree'

import axios from "axios"
import { initMap } from '@/utils/map/leafletMap';
import { getStriographTree, getMapDeviceList, getMapDeptList, getMap5GStationList, getPopDetail, getImageDetail } from '@/api/comlbs/workbench'
import { nextTick, onMounted, toRaw } from 'vue';
import { myCRS } from '@/utils/map/coordinateTransfor'
import vTree from '@/views/workbench/vTree'
import equipTree from '@/views/workbench/equipTree'
import mapTool from "../components/map/mapTool.vue"
import mapPop from '@/views/workbench/mapPop'

import "@/utils/map/Leaflet.Marker.SlideTo"
import Cookies from "js-cookie";
// 不带后缀是在线，带-0是离线,arr表示所有存储的数据，showCount表示跟右侧树关联以后，实际展示的数据数量
let legendArr = ref([
    { name: "农机终端_在线", img: "njzd", arr: [], showCount: 0 },
    { name: "农机终端_离线", img: "njzd-0", arr: [], showCount: 0 },
    { name: "应急感知站_在线", img: "yjgzz", arr: [], showCount: 0 },
    { name: "应急感知站_离线", img: "yjgzz-0", arr: [], showCount: 0 },
    { name: "农情感知站_在线", img: "nqgzz", arr: [], showCount: 0 },
    { name: "农情感知站_离线", img: "nqgzz-0", arr: [], showCount: 0 },
    { name: "监控设备_在线", img: "jksb", arr: [], showCount: 0 },
    { name: "监控设备_离线", img: "jksb-0", arr: [], showCount: 0 },
    { name: "5G基站", img: "5gjz", arr: [], showCount: 0 },
])
const loading = ref(false)
const appStore = useAppStore();
// 遥感树数据  type { 0 ：公司   1：节点   2：影像服务   3：设备}
const striographTreeData = ref([])
const mapChecked = ref(legendArr.value.map(v => v.img))
const activeWindow = ref("terminalDevice")
let beforeCheckS = mapChecked.value
const reactMap = ref({})
const myETree = ref({})
const myVTree = ref({})
const myPopWindow = ref({})
// const username = "admin"
// const password_encrypted = "SHA256:6848d6405bf34bf9b2d82ed8822c756807632d3eaefedec90ac33cb32ac83671"
// const timestamp = 1713065506
var hfysToken = Cookies.get("HfysToken")
var parent = document.createElement('div');
// 地图图例方法
function handleLegendChange() {
    let beforeLen = beforeCheckS.length, nowLen = mapChecked.value.length, diff = {};

    if (beforeLen > nowLen) {//说明点击的这项是隐藏图层
        mapChecked.value.forEach(v => {

            diff[v] = true;
        })

        beforeCheckS.forEach(v => {
            if (!diff[v]) {

                mapLayerControl(v, 'hide');
            }
        })
    } else {//说明点击的这项是显示图层
        beforeCheckS.forEach(v => {
            diff[v] = true;
        })
        mapChecked.value.forEach(v => {
            if (!diff[v]) {
                mapLayerControl(v, 'show');
            }
        })
    }
    beforeCheckS = mapChecked.value;
}

function checkAllToggle() {
    let len = legendArr.value.length
    if (mapChecked.value.length == len) {
        mapChecked.value = [];
        beforeCheckS = mapChecked.value
        isShowAllLayer(false)
    } else {
        mapChecked.value = legendArr.value.map(v => v.img)
        beforeCheckS = mapChecked.value
        isShowAllLayer(true)
    }
}

// 是否展示所有图层
function isShowAllLayer(bool) {
    closePopup();
    if (bool) {
        // 农机
        addAggregationLayer([...legendArr.value[0].arr, ...legendArr.value[1].arr], 'njzd')
        // 应急感知站
        addAggregationLayer([...legendArr.value[2].arr, ...legendArr.value[3].arr], 'yjgzz')
        // 农情感知站
        addAggregationLayer([...legendArr.value[4].arr, ...legendArr.value[5].arr], 'nqgzz')
        // 监控设备
        addAggregationLayer([...legendArr.value[6].arr, ...legendArr.value[7].arr], 'jksb')
        popLayer['5gjzlayer'].addTo(wbMap)
    } else {
        // 农机
        addAggregationLayer([], 'njzd')
        // 应急感知站
        addAggregationLayer([], 'yjgzz')
        // 农情感知站
        addAggregationLayer([], 'nqgzz')
        // 监控设备
        addAggregationLayer([], 'jksb')
        popLayer['5gjzlayer'].removeFrom(wbMap)
    }
}
// 图例事件
function mapLayerControl(param, order) {
    closePopup();
    let list = [];
    switch (param) {
        case "5gjz":
            order == 'show' ? popLayer[param + 'layer'].addTo(wbMap) : popLayer[param + 'layer'].removeFrom(wbMap)
            break
        case "jksb-0":
        case "jksb":
            if (mapChecked.value.includes('jksb')) list = list.concat(toRaw(legendArr.value[6].arr))
            if (mapChecked.value.includes('jksb-0')) list = list.concat(toRaw(legendArr.value[7].arr))
            addAggregationLayer(list, 'jksb')
            break
        case "njzd-0":
        case "njzd":
            if (mapChecked.value.includes('njzd')) list = list.concat(toRaw(legendArr.value[0].arr))
            if (mapChecked.value.includes('njzd-0')) list = list.concat(toRaw(legendArr.value[1].arr))
            addAggregationLayer(list, 'njzd')
            break
        case "nqgzz-0":
        case "nqgzz":
            if (mapChecked.value.includes('nqgzz')) list = list.concat(toRaw(legendArr.value[4].arr))
            if (mapChecked.value.includes('nqgzz-0')) list = list.concat(toRaw(legendArr.value[5].arr))
            addAggregationLayer(list, 'nqgzz')
            break
        case "yjgzz-0":
        case "yjgzz":
            if (mapChecked.value.includes('yjgzz')) list = list.concat(toRaw(legendArr.value[2].arr))
            if (mapChecked.value.includes('yjgzz-0')) list = list.concat(toRaw(legendArr.value[3].arr))
            addAggregationLayer(list, 'yjgzz')
            break
    }

}
function init() {
    initMap("wtMap").then(_map => {
        wbMap = _map;
        reactMap.value.map = _map;

        addMapLayers();

        rsLayer = L.layerGroup().addTo(wbMap);
        getStriographTreeData();
    })
}
let deptList = ref([])
// 地图设备数据列表
let deviceList = ref([])
function myRequire(str) {
    return new URL(`../assets/img/map/${str}`, import.meta.url).href
}
function getPopImg(obj) {
    let imgStr = {
        1: 'njzd',
        2: 'yjgzz',
        3: 'nqgzz',
        4: 'jksb',
        5: '5gjz',
    }
    let bool = !!obj.onlineStatus, srcStr = 'cluster/' + imgStr[obj.deviceType] + (bool ? '.png' : '-0.png')
    let _src = myRequire(srcStr)
    let _prefixStr = bool ? `<div class='map-back'>` : `<div class='map-back map-offline'>`
    return L.divIcon({
        html: _prefixStr + `<img src="${_src}" class='map-icon'/></div>`,
    })
}
// 根据数据和图形添加聚合图层
function addAggregationLayer(list, imgStr) {
    let markerList = []
    list.forEach(v => {
        const _marker = L.marker(L.latLng(v), {
            icon: getPopImg(v, imgStr)
        }).on('click', function () {
            openPopByEquip(v)
        });
        popsHash[v.id] = _marker
        markerList.push(_marker)
    })
    if (popLayer[imgStr + 'layer']) {
        popLayer[imgStr + 'layer'].removeFrom(wbMap)
    }
    popLayer[imgStr + 'layer'] = L.markerClusterGroup({
        chunkedLoading: true,
        showCoverageOnHover: false,
        disableClusteringAtZoom: 17,
        spiderfyOnMaxZoom: false
    }).addTo(wbMap);
    // 聚合样式
    popLayer[imgStr + 'layer'].options.iconCreateFunction = function (cluster) {
        let childCount = cluster.getChildCount();
        let _backSrc = myRequire('cluster/' + imgStr + '-0.png');
        return L.divIcon({
            html:
                `<div class="map-cluster">
        <div class="cluster-img"><img src="${_backSrc}" class='cluster-icon' /></div>        
        <div class="cluster-count">${childCount}</div>
      </div>`,
        });
    };
    popLayer[imgStr + 'layer'].addLayers(markerList);
}
// 打开设备气泡
function openPopByEquip(obj) {
    //deviceType --- 1:农机终端 2:应急感知站 3:农情感知站 4:监控设备 5:5G基站

    MapPopContent = createApp(mapPop).mount(parent);
    MapPopContent.myProps = {
        closePopup: closePopup,
        showDetail: showDetail,
        hfysToken: hfysToken,
    };
    getPopDetail(obj.deviceType, obj.deviceNo).then(res => {

        obj = Object.assign(obj, res.data)

        // 更新marker,包括定位和状态
        popsHash[obj.id].setLatLng(obj);
        popsHash[obj.id].setIcon(getPopImg(obj))

        MapPopContent.setPopData(obj);
        // MapPopContent.initCamera();
        // MapPopContent.open();
        thePop.setLatLng(obj).setContent(MapPopContent.$el).openOn(wbMap);


        // 解决错位问题
        nextTick(() => {
            thePop.setLatLng(obj).setContent(MapPopContent.$el)
        })
    })


}
// 点击设备定位先检查一下对应的图例有没有勾选上，没有就主动勾选
function checkLegendAndShow(obj) {
    //deviceType --- 1:农机终端 2:应急感知站 3:农情感知站 4:监控设备 5:5G基站
    let hash = {
        1: { 1: 0, 0: 1 },
        2: { 1: 2, 0: 3 },
        3: { 1: 4, 0: 5 },
        4: { 1: 6, 0: 7 },
        5: { 1: 8 },
    }
    let index = hash[obj.deviceType][obj.onlineStatus]
    if (!mapChecked.value.includes(legendArr.value[index].img)) {
        mapChecked.value.push(legendArr.value[index].img)
        beforeCheckS.value = mapChecked.value
        mapLayerControl(legendArr.value[index].img, 'show')
    }
}
function equipTreeClick(obj) {
    // 点击设备定位先检查一下对应的图例有没有勾选上，没有就主动勾选
    checkLegendAndShow(obj)

    openPopByEquip(obj)
    setTimeout(() => {
        wbMap.flyTo(obj, 18, { animate: false });
    }, 100)
}
// 刷新获取影像树数据
function getStriographTreeData() {
    getStriographTree().then(res => {
        imageHash = {}
        rsLayer.clearLayers();
        for (let key in myVTree.value.checkHash) {
            myVTree.value.checkHash[key] = false
        }
        striographTreeData.value = res.data
    })
}
// 影像树数据勾选
function handleImageCheck(data, bool) {
    if (bool) {
        imageTreeClick(data, true)
    } else {
        imageHash[data.id]?.removeFrom(rsLayer)
        delete imageHash[data.id]
    }
}
// 影像树数据点击
function imageTreeClick(data, show = false) {
    getImageDetail(data.id).then(res => {
        if (show) {
            myVTree.value.checkHash[data.id] = true
            imageHash[data.id] = L.tileLayer.wms(res.data.url, {
                layers: data.label,
                transparent: true,	//输出图像背景是否透明
                format: "image/png",	//输出图像的类型
                crs: myCRS[res.data.coordinate_system]
            }).addTo(rsLayer);
        }
        setTimeout(() => {
            wbMap.flyTo(res.data, 6, { animate: false });
        }, 100)
    })
}
// 刷新获取标注数据并生成树以及添加到地图
function addMapLayers() {
    closePopup();
    mapChecked.value = legendArr.value.map(v => v.img)
    beforeCheckS = mapChecked.value
    loading.value = true
    getMap5GStationList().then(res => {
        legendArr.value[8].arr = res.data
        legendArr.value[8].showCount = res.data.length
        // 5G基站
        addAggregationLayer([...legendArr.value[8].arr], '5gjz')
    })
    axios.all([getMapDeptList(), getMapDeviceList()]).then(([dept, device]) => {
        loading.value = false
        deptList.value = dept.data
        deviceList.value = device.data

        //deviceType --- 1:农机终端 2:应急感知站 3:农情感知站 4:监控设备 5:5G基站
        let hash = {
            1: { 1: 0, 0: 1 },
            2: { 1: 2, 0: 3 },
            3: { 1: 4, 0: 5 },
            4: { 1: 6, 0: 7 },
            5: { 1: 8 },
        }
        // reset除了基站以外的数据
        for (let i = 0; i < 8; i++) {
            legendArr.value[i].arr = [];
        }
        let online = 0

        deviceList.value.forEach(v => {

            let index = hash[v.deviceType][v.onlineStatus]

            legendArr.value[index].arr.push(v)

            if (v.onlineStatus) online++
        })

        appStore.setStatisticsData((online / deviceList.value.length).toFixed(2) * 100 + '%')

        let deviceData = {
            statisticsData: (online / deviceList.value.length).toFixed(2) * 100 + '%',
        }
        localStorage.setItem("deviceData", JSON.stringify(deviceData));
        // 农机
        addAggregationLayer([...legendArr.value[0].arr, ...legendArr.value[1].arr], 'njzd')
        // 应急感知站
        addAggregationLayer([...legendArr.value[2].arr, ...legendArr.value[3].arr], 'yjgzz')
        // 农情感知站
        addAggregationLayer([...legendArr.value[4].arr, ...legendArr.value[5].arr], 'nqgzz')
        // 监控设备
        addAggregationLayer([...legendArr.value[6].arr, ...legendArr.value[7].arr], 'jksb')
    }).catch(() => {
        loading.value = false
    })
}
// 设备树数据
const equipTreeData = computed(() => {
    const treeBaseData = [...deptList.value, ...deviceList.value];
    let newTree = new TreeCreate(treeBaseData,
        {
            pId2: 'organizationId',
        })
    let list = [newTree.getData()]
    list.forEach(v => {
        countLeaves(null, v)
    })
    return list;
})
// 影像数据统计
const striographCount = computed(() => {
    let count = 0, stack = [...striographTreeData.value];
    while (stack.length) {
        const data = stack.shift();
        if (data.type == 2) {
            count++
        } else {
            stack = stack.concat(data.children)
        }
    }
    return count
})
const startX = ref(0);
const boxWidth = ref(270);
// 拖拽
const startDrag = (event) => {
    startX.value = event.clientX;
    const drag = (event) => {
        const offsetX = event.clientX - startX.value;
        boxWidth.value -= offsetX;
        if (boxWidth.value >= 400) boxWidth.value = 400
        else if (boxWidth.value <= 270) boxWidth.value = 270
        startX.value = event.clientX;
    };
    const stopDrag = () => {
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('mouseup', stopDrag);
    };
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDrag);
};
// 关闭气泡
function closePopup() {
    wbMap.closePopup();
}
// 展示气泡详情
function showDetail(data) {
    myPopWindow.value.showDetail(data);
}
//获得合肥优视设备的Token

onMounted(() => {
    // 引入 Vue 组件构造器实例化

    init();

})
</script>
<style lang="scss" scoped>
#wtMap {
    width: 100%;
    height: 100%;
    z-index: 0;
}

.home {
    color: #223355;
    position: absolute;
    width: 100%;
    height: 100%;

    .leftTopTool {
        filter: drop-shadow(0px 12px 20px rgba(68, 77, 113, 0.3));
        position: absolute;
        left: 10px;
        top: 10px;
    }

    .legend {
        position: absolute;
        left: 16px;
        bottom: 16px;
        background-color: #fff;
        width: 220px;
        border-radius: 4px;
        padding-bottom: 8px;

        .legend-checkbox {
            padding-left: 16px;
            max-height: 0;
            overflow: hidden;
            transition: max-height .3s ease-in-out;
        }

        &:hover {

            .legend-checkbox {
                max-height: 288px;
            }
        }

        .legend-head {
            font-size: 18px;
            color: #424242;
            padding: 10px 0;
            margin: 0 8px;
            display: flex;
            border-bottom: 1px solid #dadada;
            display: flex;
            align-items: center;

            .blue-ractangle {
                height: 30px;
                width: 6px;
                background-color: var(--el-color-primary);
                border-radius: 4px;
                margin-right: 12px;
            }

            .check-all-btn {
                font-size: 14px;
                color: var(--el-color-primary);
                margin-left: auto;
                cursor: pointer;
            }
        }
    }



    .right-window {
        position: absolute;
        right: 0;
        width: 270px;
        top: 0;
        bottom: 0;
        background-color: #fff;


        .scroll-dom {
            position: absolute;
            left: 0;
            width: 8px;
            text-align: center;
            height: 100%;
            cursor: col-resize;

            img {
                top: 50%;
                position: absolute;
            }
        }

        .tree-dom {
            width: 100%;
            height: calc(100% - 88px);
        }


        .type-selection {
            padding: 18px;
            padding-bottom: 0;
            display: flex;

            li {
                background: var(--el-color-primary-light-9);
                border-radius: 4px;
                height: 52px;
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content: space-evenly;
                cursor: pointer;

                &.active {
                    background: linear-gradient(var(--el-color-primary), var(--el-color-primary-light-1));
                    color: #fff;

                    .number {
                        color: #fff;
                    }
                }

                .text {
                    font-size: 14px;
                }

                .number {
                    font-size: 16px;
                    font-weight: 600;
                    color: #6B7A99;
                }

                span {
                    text-align: center;
                }
            }

            li:first-of-type {
                margin-right: 12px;
            }
        }
    }
}

:deep(.el-dialog__body) {
    padding-top: 0;
}
</style>
