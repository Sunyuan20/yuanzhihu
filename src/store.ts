import { Commit, createStore } from 'vuex'
import axios, { AxiosRequestConfig } from 'axios'
import { arrToObj, objToArr } from './helper'

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
  _id?: string
  title?: string
  excerpt?: string
  content?: string
  column?: string
  author?: string | UserProps
  image?: ImageProps
  createdAt?: string
  isHTML?: boolean
}

// 通用错误解决方法
export interface GlobalErrorProps {
  status: boolean
  message?: string
}

interface ListProps<P> {
  [id: string]: P
}

interface GlobalColumns {
  data: ListProps<ColumnProps>
  // isLoaded: boolean
  currentPage: number
  total: number
}

interface GlobalPosts {
  data: ListProps<PostProps>
  loadedColumns: {
    [id: string]: {
      currentPage: number
      total: number
    }
  }
}

export interface GlobalDataProps {
  error: GlobalErrorProps
  token: string
  loading: boolean
  // columns: ColumnProps[] // 需要将数组修改为对象，id 为键
  // posts: PostProps[] // 需要将数组修改为对象，id 为键
  columns: GlobalColumns
  posts: GlobalPosts
  user: UserProps
}

export interface ResponseType<P> {
  code: number
  msg: string
  data: P
}

// const getAndCommit = async (
//   url: string,
//   mutationName: string,
//   commit: Commit
// ) => {
//   // 添加 loading
//   const { data } = await axios.get(url)
//   commit(mutationName, data)
//   return data
// }

// const postAndCommit = async (
//   url: string,
//   mutationName: string,
//   commit: Commit,
//   payload: any
// ) => {
//   const { data } = await axios.post(url, payload)
//   commit(mutationName, data)
//   return data
// }

// 将 getAndCommit 和 postAndCommit 合并到一起
const asyncAndCommit = async (
  url: string,
  mutationName: string,
  commit: Commit,
  config: AxiosRequestConfig = { method: 'get' },
  extraData?: any
) => {
  const { data } = await axios(url, config)
  if (extraData) {
    commit(mutationName, { data, extraData })
  } else {
    commit(mutationName, data)
  }
  return data
}

const store = createStore<GlobalDataProps>({
  state: {
    error: { status: false },
    token: localStorage.getItem('token') || '',
    loading: false,
    columns: { data: {}, currentPage: 0, total: 0 },
    posts: { data: {}, loadedColumns: {} },
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
      state.token = ''
      localStorage.setItem('token', '')
      delete axios.defaults.headers.common.Authorization
    },
    fetchColumns (state, rawData) {
      const { data } = state.columns
      const { list, count, currentPage } = rawData.data
      state.columns = {
        data: { ...data, ...arrToObj(list) },
        currentPage: currentPage * 1,
        total: count
      }
      // state.columns.data = arrToObj(rawData.data.list)
      // state.columns.isLoaded = true
    },
    fetchColumn (state, rawData) {
      state.columns.data[rawData.data._id] = rawData.data
    },
    fetchPosts (state, { data: rawData, extraData: columnId }) {
      const { data } = state.posts
      const { list, count, currentPage } = rawData.data
      state.posts = {
        data: { ...data, ...arrToObj(list) },
        loadedColumns: {
          [columnId]: {
            currentPage: currentPage * 1,
            total: count
          }
        }
      }
    },
    fetchPost (state, rawData) {
      state.posts.data[rawData.data._id] = rawData.data
    },
    createPost (state, newPost) {
      state.posts.data[newPost._id] = newPost
    },
    updatePost (state, { data }) {
      state.posts.data[data._id] = data
    },
    deletePost (state, { data }) {
      delete state.posts.data[data._id]
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
    fetchColumns ({ state, commit }, params) {
      const { currentPage = 1, pageSize = 6 } = params
      if (state.columns.currentPage < currentPage) {
        return asyncAndCommit(
          `/columns?currentPage=${currentPage}&pageSize=${pageSize}`,
          'fetchColumns',
          commit
        )
      }
    },
    fetchColumn ({ state, commit }, cid) {
      if (!state.columns.data[cid]) {
        return asyncAndCommit(`/columns/${cid}`, 'fetchColumn', commit)
      }
    },
    fetchPosts ({ state, commit }, { cid, params }) {
      const { currentPage = 1, pageSize = 6 } = params
      if (!state.posts.loadedColumns[cid]) {
        return asyncAndCommit(
          `/columns/${cid}/posts?currentPage=${currentPage}&pageSize=${pageSize}`,
          'fetchPosts',
          commit,
          { method: 'get' },
          cid
        )
      } else if (state.posts.loadedColumns[cid].currentPage < currentPage) {
        return asyncAndCommit(
          `/columns/${cid}/posts?currentPage=${currentPage}&pageSize=${pageSize}`,
          'fetchPosts',
          commit,
          { method: 'get' },
          cid
        )
      }
    },
    fetchPost ({ state, commit }, pid) {
      const currentPost = state.posts.data[pid]
      if (!currentPost || !currentPost.content) {
        return asyncAndCommit(`/posts/${pid}`, 'fetchPost', commit)
      } else {
        return Promise.resolve({ data: currentPost })
      }
    },
    createPost ({ commit }, payload) {
      return asyncAndCommit('/posts', 'createPost', commit, {
        method: 'post',
        data: payload
      })
    },
    updatePost ({ commit }, { id, payload }) {
      return asyncAndCommit(`/posts/${id}`, 'updatePost', commit, {
        method: 'patch',
        data: payload
      })
    },
    deletePost ({ commit }, id) {
      return asyncAndCommit(`/posts/${id}`, 'deletePost', commit, {
        method: 'delete'
      })
    },
    fetchCurrentUser ({ commit }) {
      return asyncAndCommit('/user/current', 'fetchCurrentUser', commit)
    },
    login ({ commit }, payload) {
      return asyncAndCommit('/user/login', 'login', commit, {
        method: 'post',
        data: payload
      })
    },
    loginAndFetch ({ dispatch }, loginData) {
      return dispatch('login', loginData).then(() => {
        return dispatch('fetchCurrentUser')
      })
    }
  },
  getters: {
    getColumns: (state) => {
      return objToArr(state.columns.data)
    },
    getColumnById: (state) => (id: string) => {
      return state.columns.data[id]
    },
    getPostsByCid: (state) => (cid: string) => {
      return objToArr(state.posts.data).filter((post) => post.column === cid)
    },
    getCurrentPost: (state) => (id: string) => {
      return state.posts.data[id]
    }
  }
})

export default store
