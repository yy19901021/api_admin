import Axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { notification } from 'antd';
import { store } from '../router';
const baseURL = process.env.NODE_ENV === 'development' ? '/api': '/api'

// const codes = {
//   403: '登录失效'
// }
const AXIOSINS = Axios.create({
  timeout: 5000,
  baseURL: baseURL
})

AXIOSINS.interceptors.request.use(function(config: AxiosRequestConfig) {
  if (config.url && config.url === baseURL + '/login') {
    return config
  }
  const auth = store.getState().userInfor.auth;
  if (auth) {
    config.headers.Authorization = auth
  }
  return config
})

AXIOSINS.interceptors.response.use(function(res: AxiosResponse) {
  if (res.status === 200 && res.data.code === 200 && !res.data.msg) {
    return res.data
  } else if (res.data.code && res.data.code !== 200) {
    notification.error({
      message: res.data.msg,
      description: ''
    })
    if (res.data.code === 403) {
      sessionStorage.removeItem('userInfor')
      window.location.href = '/login'
    } 
    return res.data
  } else if (res.data.code && res.data.code === 200 && res.data.msg) {
    notification.success({
      message: res.data.msg,
      description: ''
    })
    return res
  } else {
    return res
  }
})

export default {
  get: function(url: string, query: any = {} ):Promise<any> {
    return AXIOSINS.get(url, {params: query})
  },
  post: function(url: string, data: any):Promise<any> {
    return AXIOSINS.post(url, data)
  },
  export: function(url: string, data: any):Promise<any>{
    return AXIOSINS.post(url, data, {headers: {'responseType': 'blob'}})
  }
}