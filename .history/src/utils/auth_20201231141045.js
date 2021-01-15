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
  return localStorage.getItem(UserInfo)
}

export function setUserInfo(user) {
  console.log('存', user)
  return localStorage.setItem(UserInfo, user)
}

export function removetRoleInfo() {
  return Cookies.remove(UserInfo)
}
