/*
 * @Author: Linexus && likefan2002@gmail.com
 * @Date: 2024-08-08 19:12:35
 * @LastEditors: hhhhlkf 153648356@qq.com
 * @LastEditTime: 2025-06-23 12:48:15
 * @FilePath: \web\src\api\zhongyan\api.js
 * @Description: 
 * 
 * Copyright (c) 2025 by Linexus, All Rights Reserved. 
 */

import request from '@/utils/request'

export function startControl(ctrlInst, isOpen, folderName, isTest = false) {
    return request({
        url: '/v2/process1/control',
        method: 'get',
        params: {
            ctrlInst: ctrlInst,
            isOpen: isOpen,
            folderName: folderName,
            isTest: isTest
        }
    })
}

export function processResult(pathList = ["gansu_uav", "gansu"], isAll = false) {
    return request({
        url: '/v2/process1/result',
        method: 'get',
        params: {
            fileList: pathList.join(','),
            isAll: isAll
        }
    })
}

export function getServerIp() {
    return request({
        url: '/v2/server/ip',
        method: 'get'
    })
}

export function process2List(pathList = ['gansu']) {
    return request({
        url: '/v1/process2/list',
        method: 'get',
        params: {
            fileList: pathList
        }
    })
}

export function getProcess2Result(path, flag) {
    return request({
        url: '/v2/process2/result',
        method: 'get',
        params: {
            path, flag
        }
    })
}

export function changePath(path) {
    return request({
        url: '/v1/emergencydata/path',
        method: 'get',
        params: {
            path
        }
    })
}

export function delSelectedData(dataList) {
    return request({
        url: '/v2/emergencydata/del',
        method: 'delete',
        data: dataList
    })
}

export function addFile(name) {
    return request({
        url: '/v2/emergencydata/add',
        method: 'get',
        params: {
            name
        }
    })
}

export function getDeviceStatus(deviceList = []) {
    return request({
        url: '/v2/device/info',
        method: 'get',
        timeout: 20000,
        silentError: true,
        headers: {
            isToken: false
        },
        params: {
            deviceList: deviceList.join(',')
        }
    })
}

export function getLogInfo() {
    return request({
        url: '/v2/log/info',
        method: 'get'
    })
}

export function getTransSchedule() {
    return request({
        url: '/v2/transport/schedule',
        method: 'get'
    })
}

export function getTransRate() {
    return request({
        url: '/v1/transport/rate',
        method: 'get',
        silentError: true
    })
}

export function getSourceUse(isSim = true) {
    return request({
        url: '/v2/source/percentage',
        method: 'get',
        params: {
            isSim: isSim
        }
    })
}

export function getAreaAxis(areaName) {
    return request({
        url: '/v2/area/axis',
        method: 'get',
        params: {
            folderName: areaName
        }
    })
}

export function getPointData(areaName) {
    return request({
        url: '/v2/area/point',
        method: 'get',
        params: {
            folderName: areaName
        }
    })
}

export function getAreaData(areaName) {
    return request({
        url: '/v2/area/carousel',
        method: 'get',
        params: {
            folderName: areaName
        }
    })
}

export function getCurrentUavMission() {
    return request({
        url: '/v2/uav/mission/current',
        method: 'get',
        silentError: true
    })
}

export function getRealtimeUavState(missionId, since) {
    return request({
        url: '/v2/uav/realtime/state',
        method: 'get',
        silentError: true,
        params: {
            missionId,
            since
        }
    })
}

export function getRealtimeUavInfo() {
    return request({
        url: '/v2/uav/info/realtime',
        method: 'get',
        silentError: true
    })
}
