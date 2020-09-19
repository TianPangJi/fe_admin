import request from '@/utils/request'

// 新增部门
export function createDepartment(data) {
  return request({
    url: '/system/departments/',
    method: 'post',
    data
  })
}

// 删除部门
export function deleteDepartment(id) {
  return request({
    url: `/system/departments/${id}/`,
    method: 'delete'
  })
}

// 批量删除部门
export function deleteDepartments(ids) {
  return request({
    url: '/system/departments/',
    method: 'delete',
    data: { 'ids': ids }
  })
}

// 修改部门
export function updateDepartment(id, data) {
  return request({
    url: `/system/departments/${id}/`,
    method: 'put',
    data
  })
}

// 获取部门列表
export function getDepartments(data) {
  return request({
    url: '/system/departments/',
    method: 'get',
    params: data
  })
}

// 获取部门详情
export function getDepartment(id) {
  return request({
    url: `/system/departments/${id}/`,
    method: 'get'
  })
}
