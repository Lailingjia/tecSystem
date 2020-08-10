import request from '@/utils/request'

// 查询检修详情列表
export function listOverhaulInfo(query) {
  return request({
    url: '/overhaul/overhaulInfo/list',
    method: 'get',
    params: query
  })
}

// 查询检修详情详细
export function getOverhaulInfo(id) {
  return request({
    url: '/overhaul/overhaulInfo/' + id,
    method: 'get'
  })
}

// 新增检修详情
export function addOverhaulInfo(data) {
  return request({
    url: '/overhaul/overhaulInfo',
    method: 'post',
    data: data
  })
}

// 修改检修详情
export function updateOverhaulInfo(data) {
  return request({
    url: '/overhaul/overhaulInfo',
    method: 'put',
    data: data
  })
}

// 删除检修详情
export function delOverhaulInfo(id) {
  return request({
    url: '/overhaul/overhaulInfo/' + id,
    method: 'delete'
  })
}

// 检修流程
export function history(data) {
  return request({
    url: '/overhaul/overhaulInfo/history',
    method: 'post',
    data:data
  })
}

//检修审批信息
export function realTimeStatusList(data) {
  return request({
    url: '/overhaul/overhaulInfo/realTimeStatusList',
    method: 'post',
    data:data
  })
}

// 检修审核
export function receiveApproval(data) {
  return request({
    url: '/overhaul/overhaulInfo/receiveApproval',
    method: 'post',
    data: data
  })
}
// 检修撤销
export function revokeApproval(data) {
  return request({
    url: '/overhaul/overhaulInfo/revokeApproval',
    method: 'post',
    data: data
  })
}
// 上传附件
export function upload(data) {
  return request({
    url: '/overhaul/common/upload',
    method: 'post',
    params: data
  })
}

// 检修反馈列表
export function feedbackList(data) {
  return request({
    url: '/overhaul/overhaulInfo/feedbackList',
    method: 'post',
    data:data
  })
}

// 检修反馈添加/更新
export function feedbackSave(data) {
  return request({
    url: '/overhaul/overhaulInfo/save',
    method: 'post',
    data:data
  })
}

// 检修反馈删除
export function feedbackRemove(data) {
  return request({
    url: '/overhaul/overhaulInfo/feedbackRemove',
    method: 'post',
    data:data
  })
}
