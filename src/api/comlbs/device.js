import request from '@/utils/request'

// 查询终端设备列表
export function listDevice(query) {
  return request({
    url: '/backend/device/list',
    method: 'get',
    params: query
  })
}

// 查询终端设备详细
export function getDevice(id) {
  return request({
    url: '/backend/device/' + id,
    method: 'get'
  })
}

// 新增终端设备
export function addDevice(data) {
  return request({
    url: '/backend/device',
    method: 'post',
    data: data
  })
}

// 修改终端设备
export function updateDevice(data) {
  return request({
    url: '/backend/device',
    method: 'put',
    data: data
  })
}

// 删除终端设备
export function delDevice(id) {
  return request({
    url: '/backend/device/' + id,
    method: 'delete'
  })
}
