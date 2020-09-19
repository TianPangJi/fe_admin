import request from '@/utils/request'

// 新增角色
export function createRole(data) {
  return request({
    url: '/system/roles/',
    method: 'post',
    data
  })
}

// 删除角色
export function deleteRole(id) {
  return request({
    url: `/system/roles/${id}/`,
    method: 'delete'
  })
}

// 批量删除角色
export function deleteRoles(ids) {
  return request({
    url: '/system/roles/',
    method: 'delete',
    data: { 'ids': ids }
  })
}

// 修改角色
export function updateRole(id, data) {
  return request({
    url: `/system/roles/${id}/`,
    method: 'put',
    data
  })
}

// 修改角色权限
export function updateRolePermissions(id, permissions) {
  return request({
    url: `/system/roles/${id}/`,
    method: 'patch',
    data: { 'permissions': permissions }
  })
}

// 获取角色列表
export function getRoles(data) {
  return request({
    url: '/system/roles/',
    method: 'get',
    params: data
  })
}

// 获取角色详情
export function getRole(id) {
  return request({
    url: `/system/roles/${id}/`,
    method: 'get'
  })
}
