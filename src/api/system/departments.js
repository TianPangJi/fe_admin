import request from '@/utils/request'

// 部门--获取列表
export function getDepartments() {
  return request({
    url: '/system/departments/',
    method: 'get'
  })
}

