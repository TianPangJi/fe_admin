import request from '@/utils/request'

// 新增用户
export function createUser(data) {
  return request({
    url: '/oauth/login/',
    method: 'post',
    data
  })
}

// 删除用户
export function deleteUser(id) {
  return request({
    url: `/system/users/${id}/`,
    method: 'delete'
  })
}

// 批量删除用户
export function deleteUsers(ids) {
  return request({
    url: '/system/users/',
    method: 'delete',
    data: ids
  })
}

// 修改用户
export function updateUser(data) {
  return request({
    url: 'api/users/',
    method: 'put',
    data
  })
}

// 修改用户状态
export function updateUserActive(id, data) {
  return request({
    url: `/system/users/${id}/`,
    method: 'patch',
    data
  })
}

// 获取用户列表
export function getUsers(data) {
  return request({
    url: '/system/users/',
    method: 'get',
    params: data
  })
}

// 获取用户详情
export function getUser(id) {
  return request({
    url: `/system/users/${id}/`,
    method: 'get'
  })
}
