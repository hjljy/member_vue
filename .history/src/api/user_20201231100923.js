import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/oauth/token',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/v1/sys/user/info',
    method: 'POST',
    data:token 
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}

export function page(data) {
  return request({
    url: 'v1/sys/user/page',
    method: 'post',
    data
  })
}

export function roleList(data) {
  return request({
    url: 'v1/sys/role/list',
    method: 'post',
    data
  })
}
