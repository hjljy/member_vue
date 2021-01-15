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
  return Cookies.get(UserInfo)
}

export function setUserInfo(user) {
  const data = JSON.stringify(user)
  return Cookies.set(UserInfo, data)
}

export function removetRoleInfo() {
  return Cookies.remove(UserInfo)
}
