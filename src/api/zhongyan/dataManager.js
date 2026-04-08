/*
 * @Author: Linexus && likefan2002@gmail.com
 * @Date: 2025-06-16 15:34:26
 * @LastEditors: hhhhlkf 153648356@qq.com
 * @LastEditTime: 2025-06-24 15:05:10
 * @FilePath: \web\src\api\zhongyan\dataManager.js
 * @Description: 
 * 
 * Copyright (c) 2025 by Linexus, All Rights Reserved. 
 */

import request from '@/utils/request'


/**
 * @description:  获取数据列表
 * @param {*} type
 * @param {*} task
 * @return {*}
 */
export function getRecentData(type = 'rgb', task = 'collect', page = 1, snapshotTime) {
    return request({
        url: '/v2/data/recent',
        method: 'get',
        params: {
            type: type,
            task: task,
            page: page,
            snapshotTime: snapshotTime
        }
    })
}

/**
 * @description: 控制摄像头开关
 * @param {*} type
 * @param {*} status
 * @param {*} camSpeed
 * @return {*}
 */
export function cameraControl(type = 'rgb', status = true, camSpeed = 100) {
    return request({
        url: '/v2/camera/control',
        method: 'get',
        params: {
            type: type,
            status: status,
            camSpeed: camSpeed
        }
    })
}

export function startRgbTimelapseForever(interval, mac) {
    return request({
        url: '/v2/camera/rgb/timelapse/forever',
        method: 'get',
        params: {
            interval: interval,
            mac: mac
        }
    })
}

export function startRgbTimelapse(interval, count, mac) {
    return request({
        url: '/v2/camera/rgb/timelapse',
        method: 'get',
        params: {
            interval: interval,
            count: count,
            mac: mac
        }
    })
}

export function restartRgbTimelapseForever(interval, mac) {
    return request({
        url: '/v2/camera/rgb/timelapse/forever/restart',
        method: 'get',
        params: {
            interval: interval,
            mac: mac
        }
    })
}

export function restartRgbTimelapse(interval, count, mac) {
    return request({
        url: '/v2/camera/rgb/timelapse/restart',
        method: 'get',
        params: {
            interval: interval,
            count: count,
            mac: mac
        }
    })
}

export function stopRgbCamera(mac) {
    return request({
        url: '/v2/camera/rgb/stop',
        method: 'get',
        params: {
            mac: mac
        }
    })
}

/**
 * @description: 选择处理方法
 * @param {*} type
 * @param {*} status
 * @return {*}
 */
export function selectMethod(type = 'rgb', status = true) {
    return request({
        url: '/v2/data/select',
        method: 'get',
        params: {
            type: type,
            status: status
        }
    })
}

/**
 * @description: 获取历史数据列表
 * @param {*} type
 * @param {*} page
 * @return {*}
 */
export function getHistoryList(type = 'rgb', page = 1) {
    return request({
        url: '/v2/data/history',
        method: 'get',
        params: {
            type: type,
            page: page
        }
    })
}

/**
 * @description: 转移采集和处理的数据到历史数据
 * @param {*} modal
 * @param {*} task
 * @return {*}
 */
export function deleteDataItems(type = 'rgb', task = 'collect', names = []) {
    return request({
        url: '/v2/data/items',
        method: 'delete',
        data: {
            type,
            task,
            names
        }
    })
}

export function clearDataItems(type = 'rgb', task = 'collect') {
    return request({
        url: '/v2/data/items/all',
        method: 'delete',
        data: {
            type,
            task
        }
    })
}

export function transferData(modal = 'rgb', task = 'collect') {
    return request({
        url: '/v2/data/transfer',
        method: 'get',
        params: {
            modal: modal,
            task: task
        }
    })
}

export function resetClock(){
    return request({
        url: '/v2/device/clock',
        method: 'get'
    })
}

export function transferControl(status = true){
    return request({
        url: '/v2/data/transfer/control',
        method: 'get',
        params: {
            status: status
        }
    })
}
