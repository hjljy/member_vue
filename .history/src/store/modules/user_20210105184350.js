import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    nickName: '',
    avatar: '',
    userName: '',
    userId: '',
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
        commit('SET_AVATAR', 'https://www.hjljy.cn/favicon.png')
        setToken(data.access_token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data, code } = response
        console.log(code)
        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const { menus, nickName, avatarUrl } = data

        // roles must be a non-empty array
        if (!menus || menus.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }
        commit('SET_ROLES', menus)
        commit('SET_NAME', nickName)
        commit('SET_AVATAR', avatarUrl)
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

