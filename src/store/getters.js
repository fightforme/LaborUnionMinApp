const getters = {
  openId: state => {
    return state.openId
  },
  city: state => {
    let stat = state
    if (stat.city) {
      return stat.city
    }
    stat.city = uni.getStorageSync('city')
    return stat.city
  },
  baike: state => {
    return state.baikeParams
  },
  weburl: state => {
    return state.weburl
  }
}
export default getters
