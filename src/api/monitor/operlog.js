/*
 * @Author: pmy
 * @Date: 2023-08-11 09:10:42
 * @LastEditors: pmy
 * @LastEditTime: 2023-10-10 09:36:23
 * @FilePath: \bdcar-net\src\api\monitor\operlog.js
 * @Description: 
 * Copyright (c) 2023 by pmy/exsun, All Rights Reserved. 
 */
import request from '@/utils/request'

// 查询操作日志列表
export function list(query) {
  return request({
    url: '/monitor/operlog/list',
    method: 'get',
    params: {
      ...query,
      orderByColumn: "operTime"
    }
  })
}

// 删除操作日志
export function delOperlog(operId) {
  return request({
    url: '/monitor/operlog/' + operId,
    method: 'delete'
  })
}

// 清空操作日志
export function cleanOperlog() {
  return request({
    url: '/monitor/operlog/clean',
    method: 'delete'
  })
}
