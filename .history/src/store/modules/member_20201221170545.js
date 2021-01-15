import { getMemberLevelList } from '@/api/member'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'


const actions = {
    // user login
    getMemberLevelList({ commit }, data) {
      return new Promise((resolve, reject) => {
        getMemberLevelList(data).then(response => {
          const { data } = response
          commit('SET_TOKEN', data.access_token)
          commit('SET_NAME', data.nickName)
          commit('SET_ROLES', data.authorities)
          commit('SET_AVATAR', 'https://www.hjljy.cn/favicon.png')
          setToken(data.access_token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
  }