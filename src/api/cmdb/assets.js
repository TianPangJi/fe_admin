import request from '@/utils/request'

// 获取资产状态列表
export function getStatus() {
  return request({
    url: '/cmdb/assets/status/',
    method: 'get'
  })
}
