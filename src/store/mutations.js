import {
  OPEN_ID,
  USER_INFO,
  ADMIN_ID,
  CITY,
  BAIKE,
  WEBURL
} from './mutation-types'

import state from './state'

const mutations = {
  // [方法名](参数1,参数2...){方法}
  // eslint-disable-next-line no-shadow
  [OPEN_ID](state, v) {
    // eslint-disable-next-line no-param-reassign
    state.openId = v
  },
  // eslint-disable-next-line no-shadow
  [USER_INFO](state, v) {
    // eslint-disable-next-line no-param-reassign
    state.userInfo = v
  },
  // eslint-disable-next-line no-shadow
  [ADMIN_ID](state, v) {
    // eslint-disable-next-line no-param-reassign
    state.adminId = v
  },
  // eslint-disable-next-line no-shadow
  [CITY](state, v) {
    // eslint-disable-next-line no-param-reassign
    state.city = v
    uni.setStorageSync('city', v)
  },
  [BAIKE](state, v) {
    state.baikeParams = v
  },
  [WEBURL](state, v) {
    state.weburl = v
  }
}
export default mutations
