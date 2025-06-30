/*
 * @Author: pmy
 * @Date: 2021-11-30 11:14:48
 * @LastEditors: nxx
 * @LastEditTime: 2024-01-29 16:20:56
 * @FilePath: \web\src\main.js
 * @Description: 
 * Copyright (c) 2023 by pmy/exsun, All Rights Reserved. 
 */
import { createApp } from 'vue'

import Cookies from 'js-cookie'

import * as echarts from 'echarts'

import ElementPlus from 'element-plus'
import locale from 'element-plus/lib/locale/lang/zh-cn' // 中文语言

import '@/assets/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import directive from './directive' // directive

import * as L from 'leaflet';
import "leaflet/dist/leaflet.css";
/* leaflet icon */
delete L.Icon.Default.prototype._getIconUrl;
import * as Radar from 'leaflet-radar';
import "leaflet.markercluster/dist/MarkerCluster.Default.css"
import "leaflet.markercluster/dist/MarkerCluster.css"
import "leaflet.markercluster";

import "mars3d-cesium/Build/Cesium/Widgets/widgets.css"
import "mars3d/dist/mars3d.css"

// 工作台、轨迹
import "@/utils/map/MovingMarker"
import "@/utils/map/Leaflet.Marker.SlideTo"
import "@/utils/map/L.Path.DashFlow"
// window.L = L
// window.Radar = Radar

// 注册指令
import plugins from './plugins' // plugins
import { download, downloadByJSON } from '@/utils/request'

// svg图标
import 'virtual:svg-icons-register'
import SvgIcon from '@/components/SvgIcon'
import elementIcons from '@/components/SvgIcon/svgicon'

import './permission' // permission control

import { useDict } from '@/utils/dict'
import { parseTime, resetForm, addDateRange, addDateRange2, handleTree, selectDictLabel, selectDictLabels } from '@/utils/exsun'

// 分页组件
import Pagination from '@/components/Pagination'
// 自定义表格工具组件
import RightToolbar from '@/components/RightToolbar'
// 富文本组件
import Editor from "@/components/Editor"
// 文件上传组件
import FileUpload from "@/components/FileUpload"
// 图片上传组件
import ImageUpload from "@/components/ImageUpload"
// 图片预览组件
import ImagePreview from "@/components/ImagePreview"
// 自定义树选择组件
import TreeSelect from '@/components/TreeSelect'
// 字典标签组件
import DictTag from '@/components/DictTag'
// 加载地图基础依赖
import "@/utils/map"

const app = createApp(App)

// 全局方法挂载
app.config.globalProperties.useDict = useDict
app.config.globalProperties.download = download
app.config.globalProperties.downloadByJSON = downloadByJSON
app.config.globalProperties.parseTime = parseTime
app.config.globalProperties.resetForm = resetForm
app.config.globalProperties.handleTree = handleTree
app.config.globalProperties.addDateRange = addDateRange
app.config.globalProperties.addDateRange2 = addDateRange2
app.config.globalProperties.selectDictLabel = selectDictLabel
app.config.globalProperties.selectDictLabels = selectDictLabels

// 全局组件挂载
app.component('DictTag', DictTag)
app.component('Pagination', Pagination)
app.component('TreeSelect', TreeSelect)
app.component('FileUpload', FileUpload)
app.component('ImageUpload', ImageUpload)
app.component('ImagePreview', ImagePreview)
app.component('RightToolbar', RightToolbar)
app.component('Editor', Editor)
app.config.globalProperties.$echarts = echarts
app.use(router)
app.use(store)
app.use(plugins)
app.use(elementIcons)
app.component('svg-icon', SvgIcon)
// app.use(Echarts)
directive(app)

// 使用element-plus 并且设置全局的大小
app.use(ElementPlus, {
  locale: locale,
  // 支持 large、default、small
  size: Cookies.get('size') || 'default'
})



app.mount('#app')
