// pinia 全局配置文件
import { App } from 'vue'
import { createPinia } from 'pinia'

const pinia = createPinia()

export const setupStore = (app: App<Element>) => {
  app.use(pinia)
}
