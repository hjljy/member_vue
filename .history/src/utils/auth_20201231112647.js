import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'

const roleKey = 'roles'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getRole() {
  return Cookies.get(roleKey)
}

export function setRole(roles) {
  return Cookies.set(roleKey, roles)
}

export function removeRole() {
  return Cookies.remove(roleKey)
}
