import { login, logout, getTokenInfo } from '@/api/user'
import { getToken, setToken, removeToken, getUserId, setUserId, setOrgId, getOrgId } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    nickName: '',
    avatar: '',
    userName: '',
    orgId: '',
    userId: getUserId(),
    roles: []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USERNAME: (state, name) => {
    state.userName = name
  },
  SET_NICKNAME: (state, name) => {
    state.nickName = name
  },
  SET_USERID: (state, userId) => {
    state.userId = userId
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_ORGID: (state, orgId) => {
    state.orgId = orgId
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login('grant_type=password&username=' + username + '&password=' + password + '&client_id=client&client_secret=123456').then(response => {
        const { data } = response
        commit('SET_TOKEN', data.access_token)
        commit('SET_USERID', data.userId)
        commit('SET_NICKNAME', data.nickName)
        commit('SET_USERNAME', data.userName)
        commit('SET_ORGID', data.orgId)
        setToken(data.access_token)
        setUserId(data.userId)
        setOrgId(data.ogrId)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getTokenInfo(state.userId).then(response => {
        const { data, code } = response
        console.log(code)
        if (!data) {
          reject('用户信息验证失败，请重新登录')
        }
        const { menus, nickName, avatarUrl } = data
        // roles must be a non-empty array
        if (!menus || menus.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }
        commit('SET_ROLES', menus)
        commit('SET_NICKNAME', nickName)
        commit('SET_AVATAR', avatarUrl)
        getOrgId()
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

