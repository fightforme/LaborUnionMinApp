import Vue from 'vue'

let util = {}
Vue.prototype.environment = true // 环境切换 false 测试  true 正式
const ajaxUrl = Vue.prototype.environment ? 'https://intf.mijwed.com/mijwed' : 'https://intf.mijwed.com/zyz'
// const ajaxUrl = Vue.prototype.environment ? 'https://intf.mijwed.com/mijwed' : 'http://192.168.0.194:8080/mijwed'

if (!Vue.prototype.environment) {
  console.log('当前为测试环境.')
}

util.API = ajaxUrl

export default {
  util
}
