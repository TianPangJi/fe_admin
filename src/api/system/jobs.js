import request from '@/utils/request'

// 新增调度任务
export function createJob(data) {
  return request({
    url: '/system/jobs/',
    method: 'post',
    data
  })
}

// 删除调度任务
export function deleteJob(id) {
  return request({
    url: `/system/jobs/${id}/`,
    method: 'delete'
  })
}

// 清除所有调度任务
export function deleteJobs() {
  return request({
    url: '/system/jobs/',
    method: 'delete'
  })
}

// 启动/暂停调度任务
export function updateJob(id, data) {
  return request({
    url: `/system/jobs/${id}/`,
    method: 'patch',
    data
  })
}

// 获取调度任务列表
export function getJobs(data) {
  return request({
    url: '/system/jobs/',
    method: 'get',
    params: data
  })
}

// 获取调度任务-任务函数列表
export function getJobFunctions(data) {
  return request({
    url: '/system/jobs/functions/',
    method: 'get',
    params: data
  })
}

// 获取调度任务-执行过程列表
export function getJobExecutions(data) {
  return request({
    url: '/system/jobs/executions/',
    method: 'get',
    params: data
  })
}
