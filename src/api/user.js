import request from '@/utils/request'

// 用户登录
export function login(data) {
  return request({
    url: '/oauth/login/',
    method: 'post',
    data
  })
}

// 获取当前登录用户信息
export function getInfo() {
  return request({
    url: '/oauth/info/',
    method: 'get'
  })
}

// 用户登出
export function logout() {
  return request({
    url: '/oauth/logout/',
    method: 'post'
  })
}
