import request from '@/utils/request'

// 查询授时服务器列表
export function listTimeServer(query) {
  return request({
    url: '/backend/timeServer/list',
    method: 'get',
    params: query
  })
}

// 查询授时服务器详细
export function getTimeServer(id) {
  return request({
    url: '/backend/timeServer/' + id,
    method: 'get'
  })
}

// 新增授时服务器
export function addTimeServer(data) {
  return request({
    url: '/backend/timeServer',
    method: 'post',
    data: data
  })
}

// 修改授时服务器
export function updateTimeServer(data) {
  return request({
    url: '/backend/timeServer',
    method: 'put',
    data: data
  })
}

// 删除授时服务器
export function delTimeServer(id) {
  return request({
    url: '/backend/timeServer/' + id,
    method: 'delete'
  })
}
