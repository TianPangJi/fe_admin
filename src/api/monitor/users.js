import request from '@/utils/request'

// 获取在线用户列表
export function getUsers(data) {
  return request({
    url: '/monitor/users/',
    method: 'get',
    params: data
  })
}
