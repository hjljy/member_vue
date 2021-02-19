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

export function getTokenInfo() {
  return request({
    url: '/v1/sys/user/token/info',
    method: 'get',
    params: {}
  })
}

export function logout() {
  return request({
    url: '/v1/sys/user/token/logout',
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

export function addUser(data) {
  return request({
    url: 'v1/sys/user/add',
    method: 'post',
    data
  })
}

export function updateUser(data) {
  return request({
    url: 'v1/sys/user/update',
    method: 'post',
    data
  })
}

export function disableUser(data) {
  return request({
    url: 'v1/sys/user/disable',
    method: 'post',
    data
  })
}

export function resetPassword(data) {
  return request({
    url: 'v1/sys/user/resetPassword',
    method: 'post',
    data
  })
}

export function delUser(data) {
  return request({
    url: 'v1/sys/user/del',
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
