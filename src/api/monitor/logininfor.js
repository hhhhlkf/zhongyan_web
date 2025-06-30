/*
 * @Author: pmy
 * @Date: 2023-08-11 09:10:42
 * @LastEditors: pmy
 * @LastEditTime: 2023-10-10 09:37:12
 * @FilePath: \bdcar-net\src\api\monitor\logininfor.js
 * @Description: 
 * Copyright (c) 2023 by pmy/exsun, All Rights Reserved. 
 */
import request from '@/utils/request'

// 查询登录日志列表
export function list(query) {
  return request({
    url: '/monitor/logininfor/list',
    method: 'get',
    params: {
      ...query,
      orderByColumn: "loginTime",
    }
  })
}

// 删除登录日志
export function delLogininfor(infoId) {
  return request({
    url: '/monitor/logininfor/' + infoId,
    method: 'delete'
  })
}

// 解锁用户登录状态
export function unlockLogininfor(userName) {
  return request({
    url: '/monitor/logininfor/unlock/' + userName,
    method: 'get'
  })
}

// 清空登录日志
export function cleanLogininfor() {
  return request({
    url: '/monitor/logininfor/clean',
    method: 'delete'
  })
}
