import request from '@/utils/request'

// 新增服务器
export function createServer(data) {
  return request({
    url: '/cmdb/servers/',
    method: 'post',
    data
  })
}

// 删除服务器
export function deleteServer(id) {
  return request({
    url: `/cmdb/servers/${id}/`,
    method: 'delete'
  })
}

// 批量删除服务器
export function deleteServers(ids) {
  return request({
    url: '/cmdb/servers/',
    method: 'delete',
    data: { 'ids': ids }
  })
}

// 修改服务器
export function updateServer(id, data) {
  return request({
    url: `/cmdb/servers/${id}/`,
    method: 'put',
    data
  })
}

// 获取服务器列表
export function getServers(data) {
  return request({
    url: '/cmdb/servers/',
    method: 'get',
    params: data
  })
}

// 获取服务器详情
export function getServer(id) {
  return request({
    url: `/cmdb/servers/${id}/`,
    method: 'get'
  })
}

// 获取服务器类型列表
export function getServerType() {
  return request({
    url: '/cmdb/servers/type/',
    method: 'get'
  })
}

// 获取服务器系统类型列表
export function getServerSystemType() {
  return request({
    url: '/cmdb/servers/system-type/',
    method: 'get'
  })
}
