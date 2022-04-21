import { defineStore } from 'pinia'
import { asyncAxios } from '../helper'
import axios from 'axios'
export interface UserProps {
  isLogin: boolean
  nickName?: string
  _id?: string
  column?: string
  email?: string
  description?: string
  avatar?: {
    url?: string
    _id?: string
  }
}

interface State {
  token: string
  user: UserProps
}

export const useUserStore = defineStore('user', {
  state: (): State => ({
    token: localStorage.getItem('token') || '',
    user: { isLogin: false }
  }),
  actions: {
    logOut () {
      this.token = ''
      this.user = { isLogin: false }
      localStorage.setItem('token', '')
      delete axios.defaults.headers.common.Authorization
    },
    async login (payload: object) {
      const rawData = await asyncAxios('/user/login', {
        method: 'post',
        data: payload
      })
      const { token } = rawData.data
      this.token = token
      // 在 localStorage 中存储 token
      localStorage.setItem('token', token)
      // 设置每次发送请求时默认加上 token
      axios.defaults.headers.common.Authorization = `Bearer ${token}`
    },
    async fetchCurrentUser () {
      const rawData = await asyncAxios('/user/current')
      this.user = { isLogin: true, ...rawData.data }
    },
    async loginAndFetch (payload: object) {
      // 首先登录
      await this.login(payload)
      // 然后更新当前用户
      await this.fetchCurrentUser
    },
    async signUp (payload: object) {
      const rawData = await asyncAxios('/users', {
        method: 'post',
        data: payload
      })
    }
  }
})
