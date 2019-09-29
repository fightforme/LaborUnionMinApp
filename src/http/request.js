import Fly from 'flyio/dist/npm/wx'
import Config from './config'
import store from '../store'

const fly = new Fly()

fly.config.baseURL = Config.host
fly.config.timeout = 10000
// eslint-disable-next-line no-console
console.log('mini app Config', Config)

const handleResult = response => {
  if (response.error && response.error != 0) {
    return {
      code: response.error,
      msg: response.message ? response.message : '未知错误,请重试'
    }
  }
  return null
}

const handleError = error => {
  // 解析后台错误
  return {
    code: error.status,
    msg: error.message
  }
}

// 添加请求拦截器
fly.interceptors.request.use(request => {
  // 给所有请求添加自定义header

  request.headers = {
    ...request.headers,
    'X-Tag': 'flyio',
    'Content-Type': 'application/json',
    Accept: 'application/json',
    timeout: 10000,
    ver_name: Config.ver_name,
    os: Config.OS,
    city_id: store.getters.city.city_id
  }
  request.body = {
    ...request.body
    // openid:'ou1xO5axDsaUv9x2-CpQAitD_u60',
    // adminId:'244'
  }
  // 打印出请求体
  if (Config.log) {
    // eslint-disable-next-line no-console
    // console.log('fly request = ', request)
  }
  // 可以显式返回request, 也可以不返回，没有返回值时拦截器中默认返回request
  return request
})

// 添加响应拦截器，响应拦截器会在then/catch处理之前执行
fly.interceptors.response.use(
  response => {
    // 只将请求结果的data字段返回
    // 打印出请求体
    if (Config.log) {
      // eslint-disable-next-line no-console
      console.log('fly response success = ', response)
    }
    return response.data
  },
  err => {
    // eslint-disable-next-line no-console
    console.log('fly response error = ', err)
    // 发生网络错误后会走到这里
    // return Promise.resolve("ssss")
    let error = handleError(err)
    return error
  }
)

const HTTP = {
  /*
 Requestable {
  baseURL, //host optional
  url, // require
  headers, //  optional
  method, //  optional ,default GET\POST
  body, //  optional
  params, //  optional
  responseType, /  optional
  timeout, //  optional, default 20000
  withCredentials, /  optional
}
*/
  request: requestable => {
    const promise = new Promise((resolve, reject) => {
      fly
        .request(requestable)
        .then(response => {
          let result = handleResult(response)

          if (result === null) {
            // eslint-disable-next-line no-undefined
            resolve(response.data === undefined ? {} : response.data)
          } else {
            reject(result)
          }
        })
        .catch(error => {
          reject(error)
        })
    })
    return promise
  },

  get: requestable => {
    let able = {
      ...requestable,
      ...{
        method: 'GET'
      }
    }
    const promise = HTTP.request(able)
    return promise
  },

  post: requestable => {
    let able = {
      ...requestable,
      ...{
        method: 'POST'
      }
    }
    const promise = HTTP.request(able)
    return promise
  }
}
export default HTTP
