import { Commit, createStore } from 'vuex'
import axios from 'axios'

export interface UserProps {
  isLogin: boolean
  nickName?: string
  _id?: number
  column?: number
  email?: string
}

export interface ImageProps {
  _id?: string
  url?: string
  createAt?: string
}

export interface ColumnProps {
  _id: string
  title: string // 标题
  avatar?: ImageProps // 头图链接
  description: string // 描述
}

export interface PostProps {
  _id: string
  title: string
  excerpt?: string
  content?: string
  image?: ImageProps
  createdAt: string
  column: string
}

// 通用错误解决方法
export interface GlobalErrorProps {
  status: boolean
  message?: string
}

export interface GlobalDataProps {
  error: GlobalErrorProps
  token: string
  loading: boolean
  columns: ColumnProps[]
  posts: PostProps[]
  user: UserProps
}

const getAndCommit = async (
  url: string,
  mutationName: string,
  commit: Commit
) => {
  // 添加 loading
  const { data } = await axios.get(url)
  commit(mutationName, data)
}

const postAndCommit = async (
  url: string,
  mutationName: string,
  commit: Commit,
  payload: any
) => {
  const { data } = await axios.post(url, payload)
  commit(mutationName, data)
}

const store = createStore<GlobalDataProps>({
  state: {
    error: { status: false },
    token: localStorage.getItem('token') || '',
    loading: false,
    columns: [],
    posts: [],
    user: { isLogin: false }
  },
  mutations: {
    login (state, rawData) {
      const { token } = rawData.data
      state.token = token
      // 在 localStorage 中存储 token
      localStorage.setItem('token', token)
      // 设置每次发送请求时默认加上 token
      axios.defaults.headers.common.Authorization = `Bearer ${token}`
    },
    logOut (state) {
      state.user = { isLogin: false }
      state.token = ''
      localStorage.setItem('token', '')
    },
    createPost (state, newPost) {
      state.posts.push(newPost)
    },
    fetchColumns (state, rawData) {
      state.columns = rawData.data.list
    },
    fetchColumn (state, rawData) {
      state.columns = [rawData.data]
    },
    fetchPost (state, rawData) {
      state.posts = rawData.data.list
    },
    fetchCurrentUser (state, rawData) {
      state.user = { isLogin: true, ...rawData.data }
    },
    setLoading (state, status) {
      state.loading = status
    },
    setError (state, e: GlobalErrorProps) {
      state.error = e
    }
  },
  actions: {
    fetchColumns ({ commit }) {
      getAndCommit('/columns', 'fetchColumns', commit)
    },
    fetchColumn ({ commit }, cid) {
      getAndCommit(`/columns/${cid}`, 'fetchColumn', commit)
    },
    fetchPost ({ commit }, cid) {
      getAndCommit(`/columns/${cid}/posts`, 'fetchPost', commit)
    },
    fetchCurrentUser ({ commit }) {
      getAndCommit('/user/current', 'fetchCurrentUser', commit)
    },
    login ({ commit }, payload) {
      return postAndCommit('/user/login', 'login', commit, payload)
    },
    loginAndFetch ({ dispatch }, loginData) {
      return dispatch('login', loginData).then(() => {
        return dispatch('fetchCurrentUser')
      })
    }
  },
  getters: {
    getColumnsById: (state) => (id: string) => {
      return state.columns.find((c) => c._id === id)
    },
    getPostsByCid: (state) => (cid: string) => {
      return state.posts.filter((post) => post.column === cid)
    }
  }
})

export default store
