import request from '@/utils/request'

// 查询终端设备列表
export function listTerminalDevice(query) {
  return request({
    url: '/backend/terminalDevice/list',
    method: 'get',
    params: query
  })
}

// 查询终端设备详细
export function getTerminalDevice(id) {
  return request({
    url: '/backend/terminalDevice/' + id,
    method: 'get'
  })
}

// 新增终端设备
export function addTerminalDevice(data) {
  return request({
    url: '/backend/terminalDevice',
    method: 'post',
    data: data
  })
}

// 修改终端设备
export function updateTerminalDevice(data) {
  return request({
    url: '/backend/terminalDevice',
    method: 'put',
    data: data
  })
}

// 删除终端设备
export function delTerminalDevice(id) {
  return request({
    url: '/backend/terminalDevice/' + id,
    method: 'delete'
  })
}
