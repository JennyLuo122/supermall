import axios from 'axios'

export function request(config) {
  // 1.创建axios实例
  const instance = axios.create({
    baseURL: 'http://152.136.185.210:7878/api/hy66',
    timeout: 5000
  })

  // 2.axios拦截器
  //  2.1 请求拦截的作用
  instance.interceptors.response.use(config => {
    return config
  }), err => {

  }

  //  2.2响应拦截器
  instance.interceptors.response.use(res => {
    return res.data
  }), err => {

  }

  // 3.发送真正的网络请求
  return instance(config)

}
