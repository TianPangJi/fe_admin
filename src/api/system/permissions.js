import request from '@/utils/request'

// 新增权限
export function createPermission(data) {
  return request({
    url: '/system/permissions/',
    method: 'post',
    data
  })
}

// 删除权限
export function deletePermission(id) {
  return request({
    url: `/system/permissions/${id}/`,
    method: 'delete'
  })
}

// 批量删除权限
export function deletePermissions(ids) {
  return request({
    url: '/system/permissions/',
    method: 'delete',
    data: { 'ids': ids }
  })
}

// 修改权限
export function updatePermission(id, data) {
  return request({
    url: `/system/permissions/${id}/`,
    method: 'put',
    data
  })
}

// 获取权限列表
export function getPermissions(data) {
  return request({
    url: '/system/permissions/',
    method: 'get',
    params: data
  })
}

// 获取权限详情
export function getPermission(id) {
  return request({
    url: `/system/permissions/${id}/`,
    method: 'get'
  })
}

// 获取请求方法列表
export function getPermissionMethods() {
  return request({
    url: '/system/permissions/methods/',
    method: 'get'
  })
}
