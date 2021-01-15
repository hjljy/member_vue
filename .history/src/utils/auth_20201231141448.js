import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'

const UserInfo = 'userInfo'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getUserInfo() {
  const data = localStorage.getItem(UserInfo)
  return JSON.parse(data)
}

export function setUserInfo(user) {
  const data = JSON.stringify(user)
  console.log('存', data)
  return localStorage.setItem(UserInfo, data)
}

export function removetRoleInfo() {
  return Cookies.remove(UserInfo)
}
