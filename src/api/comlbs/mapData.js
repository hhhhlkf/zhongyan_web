import request from '@/utils/request'

// 查询地图数据列表
export function listMapData(query) {
  return request({
    url: '/backend/mapData/list',
    method: 'get',
    params: query
  })
}

// 查询地图数据详细
export function getMapData(id) {
  return request({
    url: '/backend/mapData/' + id,
    method: 'get'
  })
}

// 新增地图数据
export function addMapData(data) {
  return request({
    url: '/backend/mapData',
    method: 'post',
    data: data
  })
}

// 修改地图数据
export function updateMapData(data) {
  return request({
    url: '/backend/mapData',
    method: 'put',
    data: data
  })
}

// 删除地图数据
export function delMapData(id) {
  return request({
    url: '/backend/mapData/' + id,
    method: 'delete'
  })
}
