import request from '@/utils/request'

export function getMemberLevelList(data) {
  return request({
    url: '/v1/member/level/list',
    method: 'post',
    data
  })
}
