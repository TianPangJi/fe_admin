import request from '@/utils/request'

// 获取服务器信息
export function getService() {
  return request({
    url: '/monitor/service/',
    method: 'get'
  })
}
