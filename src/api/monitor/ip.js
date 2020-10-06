import request from '@/utils/request'

// 新增黑名单IP
export function createIp(data) {
  return request({
    url: '/monitor/ip/',
    method: 'post',
    data
  })
}

// 删除黑名单IP
export function deleteIp(id) {
  return request({
    url: `/monitor/ip/${id}/`,
    method: 'delete'
  })
}

// 批量删除黑名单IP
export function deleteIps(ids) {
  return request({
    url: '/monitor/ip/',
    method: 'delete',
    data: { 'ids': ids }
  })
}

// 修改黑名单IP
export function updateIp(id, data) {
  return request({
    url: `/monitor/ip/${id}/`,
    method: 'put',
    data
  })
}

// 获取黑名单IP列表
export function getIps(data) {
  return request({
    url: '/monitor/ip/',
    method: 'get',
    params: data
  })
}

// 获取黑名单IP详情
export function getIp(id) {
  return request({
    url: `/monitor/ip/${id}/`,
    method: 'get'
  })
}
