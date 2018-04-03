import * as types from './mutation-types'

const mutations = {
  [types.SET_TOKEN](state, token) {
    state.token = token
    localStorage['token'] = JSON.stringify(token)
  },
  [types.SET_USER](state, user) {
    state.user = user
    localStorage['user'] = JSON.stringify(user)
  },
  [types.SET_SCORERATE](state, scorerate) {
    state.scorerate = scorerate
    localStorage['scorerate'] = JSON.stringify(scorerate)
  }
}

export default mutations
