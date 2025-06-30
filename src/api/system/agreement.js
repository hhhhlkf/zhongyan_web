import request from '@/utils/request'

// 查询设备接入协议列表
export function listAgreement(query) {
  return request({
    url: '/system/agreement/list',
    method: 'get',
    params: query
  })
}

// 查询设备接入协议详细
export function getAgreement(id) {
  return request({
    url: '/system/agreement/' + id,
    method: 'get'
  })
}

// 新增设备接入协议
export function addAgreement(data) {
  return request({
    url: '/system/agreement',
    method: 'post',
    data: data
  })
}

// 修改设备接入协议
export function updateAgreement(data) {
  return request({
    url: '/system/agreement',
    method: 'put',
    data: data
  })
}

// 删除设备接入协议
export function delAgreement(id) {
  return request({
    url: '/system/agreement/' + id,
    method: 'delete'
  })
}
