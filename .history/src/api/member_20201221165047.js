import request from '@/utils/request'


export function getMemberLevelList() {
    return request({
      url: '/v1/member/level/list',
      method: 'post'
    })
  }
