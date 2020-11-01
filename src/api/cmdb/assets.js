import request from '@/utils/request'

// 获取资产状态列表
export function getAssetsStatus() {
  return request({
    url: '/cmdb/assets/status/',
    method: 'get'
  })
}

// 获取资产管理员
export function getAssetsAdmin(data) {
  return request({
    url: `/cmdb/assets/admin/?search=${data}`,
    method: 'get'
  })
}

// 获取机房机柜Tree结构数据
export function getIDCCabinetsTree() {
  return request({
    url: '/cmdb/assets/cabinets/',
    method: 'get'
  })
}
