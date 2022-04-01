import { createApp } from 'vue'
import router from './router'
import store from './store'
import axios from 'axios'
import App from './App.vue'

// 替换 baseURL
axios.defaults.baseURL = 'https://apis.imooc.com/api/'
axios.interceptors.request.use((config) => {
  // get 请求，添加到 url 中
  config.params = { ...config.params, icode: 'AA5BFD8263721C73' }
  // 其他请求，添加到 body 中
  // 如果是上传文件，添加到 FormData 中
  if (config.data instanceof FormData) {
    config.data.append('icode', 'AA5BFD8263721C73')
  } else {
    // 普通的 body 对象，添加到 data 中
    config.data = { ...config.data, icode: 'AA5BFD8263721C73' }
  }
  store.commit('setLoading', true) // 在拦截器中添加 loading
  store.commit('setError', { status: false, message: '' }) // 发送请求时把错误重置
  return config
})
axios.interceptors.response.use(
  (config) => {
    store.commit('setLoading', false) // 在拦截器中添加 loading
    return config
  },
  (e) => {
    // 在全局拦截器中处理请求错误
    const { error } = e.response.data
    store.commit('setError', { status: true, message: error })
    store.commit('setLoading', false)
    return Promise.reject(error) // 最后一定要返回 reject
  }
)
const app = createApp(App)
app.use(router)
app.use(store)
app.mount('#app')
