import request from '@/utils/request'

// 个人中心修改密码
export function changePassword(data) {
  return request({
    url: '/information/change-password/',
    method: 'put',
    data
  })
}

// 个人中心修改头像
export function changeAvatar(data) {
  return request({
    url: '/information/change-avatar/',
    method: 'put',
    data
  })
}

// 个人中心修改个人信息
export function changeInformation(data) {
  return request({
    url: '/information/change-information/',
    method: 'put',
    data
  })
}
