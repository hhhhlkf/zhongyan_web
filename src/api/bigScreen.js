/*
 * @Author: nxx
 * @Date: 2024-01-05 08:52:00
 * @LastEditors: nxx
 * @LastEditTime: 2024-01-09 15:16:38
 * @FilePath: \web\src\api\bigScreen.js
 * @Description: 
 * Copyright (c) 2024 by nxx/exsun, All Rights Reserved. 
 */
import request from '@/utils/request'

// 天气
export function getWeather(code) {
  return request({
    url: '/overview/weather/getWeatherByAdcode',
    method: 'get',
    params: {
      adCode: code || '420100',
    }
  })
}

// 基站列表
export const getFacilityList = () => {
  return request({
    url: '/overview/cloudPlatform/list',
    method: 'get'
  })
}

// 基站气泡详情
export const postDetail = (data) => {
  return request({
    url: '/overview/cloudPlatform/getDetail',
    method: 'post',
    data: data
  })
}

// 高分遥感信息服务
export const getSensingInformation = (params) => {
  return request({
    url: '/overview/cloudPlatform/sensingInformation',
    method: 'get',
    params: params
  })
}

// 高分遥感信息服务详情
export const getSensingInformationList = (params) => {
  return request({
    url: '/overview/cloudPlatform/sensingInformationList',
    method: 'get',
    params: params
  })
}

// 星地通信数量统计
export const getCommunicationSum = () => {
  return request({
    url: '/overview/cloudPlatform/airGroundCommunicationSum',
    method: 'get',
  })
}

// 星地通信详情
export const getCommunicationDetail = (params) => {
  return request({
    url: '/overview/cloudPlatform/airGroundCommunicationDetail',
    method: 'get',
    params: params
  })
}

// 星地精密定位服务
export const getEarthPrecision = (stationId) => {
  return request({
    url: `/overview/cloudPlatform/starEarthPrecision?stationId=${stationId}`,
    method: 'get',
  })
}

// 高精度授时服务
export const getPrecisionTiming = () => {
  return request({
    url: '/overview/cloudPlatform/highPrecisionTiming',
    method: 'get',
  })
}

// 平台服务态势分析
export const getPlatform = () => {
  return request({
    url: '/overview/cloudPlatform/analysisPlatform',
    method: 'get',
  })
}

// 星地精密定位服务-右侧下拉框
export const getStationList = () => {
  return request({
    url: '/overview/cloudPlatform/stationList',
    method: 'get',
  })
}