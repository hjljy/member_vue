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

export function getRoleInfo() {
  return Cookies.get(UserInfo)
}

export function settRoleInfo(user) {
  return Cookies.set(UserInfo, user)
}

export function removetRoleInfo() {
  return Cookies.remove(UserInfo)
}
