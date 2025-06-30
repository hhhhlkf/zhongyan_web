import request from '@/utils/request'

// 查询地图影像树
export function getStriographTree() {
    return request({
        url: '/system/dept/mapDataTree',
        method: 'get'
    })
}

// 获取设备数组(不包括基站)
export function getMapDeviceList() {
    return request({
        url: '/backend/search/mapDeviceList',
        method: 'post'
    })
}

// 获取基站数组
export function getMap5GStationList() {
    return request({
        url: '/backend/search/map5GStationList',
        method: 'post'
    })
}

// 获取公司数组
export function getMapDeptList() {
    return request({
        url: '/backend/search/mapDeptList',
        method: 'post'
    })
}

// 获取气泡详情
export function getPopDetail(deviceType, deviceNo) {
    return request({
        url: '/backend/workbench/getDetail',
        method: 'post',
        data: {
            deviceType: deviceType,
            deviceNo: deviceNo
        }
    })
}

// 获取影像详情
export function getImageDetail(mapId) {
    return request({
        url: '/backend/workbench/mapDataDetail',
        method: 'get',
        params: {
            mapId: mapId
        }
    })
}

// 获取气泡中的曲线
export function getPopChart({ deviceType, deviceNo, startTime, endTime, timeGranularity, subDeviceType }) {
    return request({
        url: '/backend/workbench/getChart',
        method: 'post',
        data: {
            "deviceNo": deviceNo,
            "deviceType": deviceType,
            "endTime": endTime,
            "startTime": startTime,
            "timeGranularity": timeGranularity,
            "subDeviceType": subDeviceType,
        }
    })
}
