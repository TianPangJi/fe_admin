import request from '@/utils/request'

// 获取CRUD日志列表
export function getCRUD(data) {
  return request({
    url: '/monitor/crud/',
    method: 'get',
    params: data
  })
}
