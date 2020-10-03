import request from '@/utils/request'

// 获取错误日志列表
export function getErrorLogs(data) {
  return request({
    url: '/monitor/error/',
    method: 'get',
    params: data
  })
}

// 清空错误日志
export function deleteErrorLogs() {
  return request({
    url: '/monitor/error/',
    method: 'delete'
  })
}
