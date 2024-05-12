import {BaseURL} from './api'
import axios from 'axios'
// const BaseURL = window.location.protocol + "//" + window.location.hostname + ":9000/"
// const BaseURL = 'http://127.0.0.1:8000'

// let loadingInstance = null //这里是loading
//使用create方法创建axios实例
export const Service = axios.create({
  // timeout: 7000, // 请求超时时间
  baseURL: BaseURL,
  method: 'post',
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  },

})
// 添加请求拦截器
Service.interceptors.request.use(config => {
  return config
})
// 添加响应拦截器
Service.interceptors.response.use(response => {
  //判断code码，查看当时状态
  return response
}, (error) => {
  return Promise.reject(error)
})
