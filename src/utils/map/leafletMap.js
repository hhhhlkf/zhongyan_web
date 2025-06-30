/*
 * @Author: pmy
 * @Date: 2022-07-27 09:06:06
 * @LastEditors: pmy
 * @LastEditTime: 2023-10-12 16:18:52
 * @FilePath: \bdcar-net\src\utils\map\leafletMap.js
 * @Description: 本文档是基于leaflet封装的一些常用功能，为隔离地图防止图层感染，每个方法需要将当前页面的地图作为参数输入
 * Copyright (c) 2022 by pmy/exsun, All Rights Reserved. 
 * 
 */

/**
 * @description 通过id初始化地图
 * @param {string} id 容器id
 */
export async function initMap(id, isImage = true) {
    return new Promise((resolve) => {
        // 天地图地图配置项
        let t_setting = GlobalSetting.MapConfig.tianditu;
        let _map = L.map(id, {
            center: GlobalSetting.MapConfig.center, // 地图中心
            zoom: t_setting.zoom, //缩放比列
            zoomControl: false, //禁用 + - 按钮
            doubleClickZoom: true, // 禁用双击放大
            attributionControl: false, // 移除右下角leaflet标识
            closePopupOnClick: false, //点击地图时 popups（弹出窗口）自动关闭
            maxZoom: t_setting.maxZoom,
            minZoom: t_setting.minZoom,
        });

        let layer, note
        if (isImage) {
            layer = t_setting.imageUrl
            note = t_setting.iNoteUrl
        } else {
            layer = t_setting.vectorUrl
            note = t_setting.vNoteUrl
        }

        let baseLayer = L.tileLayer(layer, {
            subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
            maxZoom: t_setting.maxZoom,
            className: 'bigScreen'
        });
        let baseNote = L.tileLayer(note, {
            subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
            maxZoom: t_setting.maxZoom,
            maxNativeZoom: t_setting.maxZoom,
            className: 'bigScreen'
        });
        //设置初始化地图源
        _map.baseLayerGroup = L.layerGroup([baseLayer, baseNote]).addTo(_map)

        _map.on('click', (e) => {
            console.log("lng:" + e.latlng.lng, "lat:" + e.latlng.lat)
        })

        resolve(_map)
    })
}

/**
 * @description 地图添加点集合
 * @param {object} map 地图
 * @param {array} points 点集合
 * @param {function} clickFunc 点击执行的方法
 */
export async function addLotsOfPoints(map, points, clickFunc) {
    return new Promise((resolve) => {
        let _list = [];
        points.forEach((v) => {
            let _marker = L.circleMarker(v, {
                fill: true,
                fillColor: '#fff',
                radius: 5,
                weight: 2,
                opacity: 1,
                fillOpacity: 1
            });
            _marker.attribution = v
            _list.push(_marker)
        })
        const pointsLayer = L.featureGroup(_list)
            .on('click', clickFunc)
            .addTo(map);
        resolve(pointsLayer)
    })
}

/**
 * @description 计算中心
 * @param {array} points 点集合
 */
export function computCenter(points) {
    // 如果是数组，先转换为对象
    if (Array.isArray(points[0])) {
        points = points.map(v => {
            return { lng: v[0], lat: v[1] }
        })
    }
    let sumX = 0;
    let sumY = 0;
    // 计算所有点的坐标之和
    for (let i = 0; i < points.length; i++) {
        sumX += points[i].lng;
        sumY += points[i].lat;
    }
    // 计算质心的坐标
    const centroidX = sumX / points.length;
    const centroidY = sumY / points.length;
    return { lng: centroidX, lat: centroidY }
}