import request from '@/utils/request'

// 查询用户列表
export function listuser(query) {
  return request({
    url: '/overhaul/dailyPlanStatistics/userList',
    method: 'get',
    params: query
  })
}


// 查询用户数据
export function listuserrep(query) {
  return request({
    url: '/overhaul/dailyPlanStatistics/planHistoryReportForm',
    method: 'get',
    params: query
  })
}

export function listallrep(query) {
  return request({
    url: '/overhaul/dailyPlanStatistics/userPlanHistoryReport',
    method: 'get',
    params: query
  })
}


export function listair(query) {
  return request({
    url: '/overhaul/dailyPlanStatistics/sourceList',
    method: 'get',
    params: query
  })
}

export function listallair(query) {
  return request({
    url: '/overhaul/dailyPlanStatistics/sourcePlanHistoryReport',
    method: 'get',
    params: query
  })
}