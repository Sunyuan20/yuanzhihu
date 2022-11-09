import { defineStore } from 'pinia'
import { arrToObj, objToArr, asyncAxios } from '../helper'
import { UserProps } from './user'
import { ListProps, ImageProps } from './colums'

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

export interface ResponseType<P> {
  code: number
  msg: string
  data: P
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

interface State {
  posts: GlobalPosts
}

export const usePostsStore = defineStore('posts', {
  state: (): State => ({
    posts: { data: {}, loadedColumns: {} }
  }),
  actions: {
    async fetchPosts ({ cid, params }: any) {
      const { currentPage = 1, pageSize = 6 } = params
      if (!this.posts.loadedColumns[cid]) {
        const rawData = await asyncAxios(
          `/columns/${cid}/posts?currentPage=${currentPage}&pageSize=${pageSize}`,
          { method: 'get' }
        )
        const { data, loadedColumns } = this.posts
        const { list, count } = rawData.data
        this.posts = {
          data: { ...data, ...arrToObj(list) },
          loadedColumns: {
            ...loadedColumns,
            [cid]: {
              currentPage: rawData.data.currentPage * 1,
              total: count
            }
          }
        }
      } else if (this.posts.loadedColumns[cid].currentPage < currentPage) {
        const rawData = await asyncAxios(
          `/columns/${cid}/posts?currentPage=${currentPage}&pageSize=${pageSize}`,
          { method: 'get' }
        )
        const { data, loadedColumns } = this.posts
        const { list, count } = rawData.data
        this.posts = {
          data: { ...data, ...arrToObj(list) },
          loadedColumns: {
            ...loadedColumns,
            [cid]: {
              currentPage: rawData.data.currentPage * 1,
              total: count
            }
          }
        }
      }
    },
    async fetchPost (pid: string) {
      const currentPost = this.posts.data[pid]
      if (!currentPost || !currentPost.content) {
        const rawData = await asyncAxios(`/posts/${pid}`)
        this.posts.data[rawData.data._id] = rawData.data
        return rawData
      } else {
        return Promise.resolve({ data: currentPost })
      }
    },
    async createPost (payload: any) {
      const newPost = await asyncAxios('/posts', {
        method: 'post',
        data: payload
      })
      this.posts.data[newPost.data._id] = newPost.data
      return newPost
    },
    async updatePost ({ id, payload }: any) {
      const rawData = await asyncAxios(`/posts/${id}`, {
        method: 'patch',
        data: payload
      })
      this.posts.data[rawData.data._id] = rawData.data
      return rawData
    },
    async deletePost (id: string) {
      const rawData = await asyncAxios(`/posts/${id}`, {
        method: 'delete'
      })
      delete this.posts.data[rawData.data._id]
      return rawData
    }
  },
  getters: {
    getPostsByCid: (state) => (cid: string) => {
      return objToArr(state.posts.data).filter((post) => post.column === cid)
    },
    getCurrentPost: (state) => (id: string) => {
      return state.posts.data[id]
    }
  }
})
