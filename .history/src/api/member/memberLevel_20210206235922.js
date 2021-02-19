import request from '@/utils/request'

export function getMemberLevelList(data) {
  return request({
    url: '/v1/member/level/list',
    method: 'post',
    data
  })
}
export function addMemberLevel(data) {
  return request({
    url: '/v1/member/level/add',
    method: 'post',
    data
  })
}
export function delMemberLevel(data) {
  return request({
    url: '/v1/member/level/del',
    method: 'post',
    data
  })
}
