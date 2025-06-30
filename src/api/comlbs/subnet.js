import request from '@/utils/request'

// 查询子网列表
export function listSubnet(query) {
  return request({
    url: '/backend/subnet/list',
    method: 'get',
    params: query
  })
}

// 查询子网详细
export function getSubnet(id) {
  return request({
    url: '/backend/subnet/' + id,
    method: 'get'
  })
}

// 新增子网
export function addSubnet(data) {
  return request({
    url: '/backend/subnet',
    method: 'post',
    data: data
  })
}

// 修改子网
export function updateSubnet(data) {
  return request({
    url: '/backend/subnet',
    method: 'put',
    data: data
  })
}

// 删除子网
export function delSubnet(id) {
  return request({
    url: '/backend/subnet/' + id,
    method: 'delete'
  })
}
