import request from '@/utils/request'

// 查询基站列表
export function listStation(query) {
  return request({
    url: '/backend/station/list',
    method: 'get',
    params: query
  })
}

export function listAllStation(query) {
  return request({
    url: '/backend/station/listAll',
    method: 'get',
    params: query
  })
}

// 查询基站详细
export function getStation(id) {
  return request({
    url: '/backend/station/' + id,
    method: 'get'
  })
}

// 新增基站
export function addStation(data) {
  return request({
    url: '/backend/station',
    method: 'post',
    data: data
  })
}

// 修改基站
export function updateStation(data) {
  return request({
    url: '/backend/station',
    method: 'put',
    data: data
  })
}

// 删除基站
export function delStation(id) {
  return request({
    url: '/backend/station/' + id,
    method: 'delete'
  })
}
