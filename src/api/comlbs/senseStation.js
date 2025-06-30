import request from '@/utils/request'

// 查询感知站信息列表
export function listStation(query) {
  return request({
    url: '/backend/senseStation/list',
    method: 'get',
    params: query
  })
}

// 查询感知站信息详细
export function getStation(id) {
  return request({
    url: '/backend/senseStation/' + id,
    method: 'get'
  })
}

// 新增感知站信息
export function addStation(data) {
  return request({
    url: '/backend/senseStation',
    method: 'post',
    data: data
  })
}

// 修改感知站信息
export function updateStation(data) {
  return request({
    url: '/backend/senseStation',
    method: 'put',
    data: data
  })
}

// 删除感知站信息
export function delStation(id) {
  return request({
    url: '/backend/senseStation/' + id,
    method: 'delete'
  })
}
