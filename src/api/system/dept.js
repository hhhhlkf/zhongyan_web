/*
 * @Author: pmy
 * @Date: 2023-08-11 09:10:42
 * @LastEditors: pmy
 * @LastEditTime: 2023-10-13 08:47:00
 * @FilePath: \bdcar-net\src\api\system\dept.js
 * @Description: 
 * Copyright (c) 2023 by pmy/exsun, All Rights Reserved. 
 */
import request from '@/utils/request'

// 查询部门列表
export function listDept(query) {
  return request({
    url: '/system/dept/list',
    method: 'get',
    params: query
  })
}

// 查询部门树
export function treeDept() {
  return request({
    url: '/system/dept/treeList',
    method: 'get'
  })
}

// 查询部门列表（排除节点）
export function listDeptExcludeChild(deptId) {
  return request({
    url: '/system/dept/list/exclude/' + deptId,
    method: 'get'
  })
}

// 查询部门详细
export function getDept(deptId) {
  return request({
    url: '/system/dept/' + deptId,
    method: 'get'
  })
}

// 新增部门
export function addDept(data) {
  return request({
    url: '/system/dept',
    method: 'post',
    data: data
  })
}

// 修改部门
export function updateDept(data) {
  return request({
    url: '/system/dept',
    method: 'put',
    data: data
  })
}

// 删除部门
export function delDept(deptId) {
  return request({
    url: '/system/dept/' + deptId,
    method: 'delete'
  })
}