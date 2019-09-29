let kHost = ''
let environment = false //编译环境
let logValue = false //是否显示日志
let os = 'weixin' //operating system 什么系统

const productHostURL = 'https://intf.mijwed.com/mijwed'
const developHostURL = 'https://intf.mijwed.com/zyz'

//正常编译的时候，dev 对应测试地址 build对应的测试环境 npm run dev/build
//如果想 dev 对应正式环境 或者 build 对应测试环境

//alwaysDevelopment 设置为 true,默认是 undefine 或者 false
//优先级最高，如果设置，测试环境，正式环境永远是测试地址
let alwaysDevelopment
// alwaysDevelopment = true

//isReversed 设置为 true,默认是 undefine 或者 false
//如果设置为true, dev 为正式环境 build 为测试环境
let isReversed
isReversed = true

console.log('process', process.env)
console.log('uni.getSystemInfoSync()', uni.getSystemInfoSync())

// 环境切换 flase 测试  true 正式
if (process.env.NODE_ENV === 'development') {
  if (alwaysDevelopment) {
    kHost = developHostURL
    environment = false
  } else if (isReversed) {
    kHost = productHostURL
    environment = true
  } else {
    kHost = developHostURL
    environment = false
  }
  logValue = true
} else if (process.env.NODE_ENV === 'production') {
  if (alwaysDevelopment || isReversed) {
    kHost = developHostURL
    logValue = true
    environment = false
  } else {
    kHost = productHostURL
    logValue = false
    environment = true
  }
}

//#ifdef MP-WEIXIN
os = 'baidu'
//#endif

//#ifdef MP-BAIDU
os = 'baidu'
//#endif

const Config = {
  appid: 'wxdcb4ce629c431f02',
  host: kHost,
  OS: os,
  ver_name: '4.8.0',
  env: environment,
  log: logValue
}

if (!Config.env) {
  // eslint-disable-next-line no-console
  console.log('当前为测试环境.')
}
export default Config
