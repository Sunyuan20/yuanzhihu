import { defineStore } from 'pinia'
import { arrToObj, objToArr, asyncAxios } from '../helper'

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

export interface ListProps<P> {
  [id: string]: P
}

interface GlobalColumns {
  data: ListProps<ColumnProps>
  // isLoaded: boolean
  currentPage: number
  total: number
}

interface State {
  columns: GlobalColumns
}

export const useColumnsStore = defineStore('colums', {
  state: (): State => ({
    columns: { data: {}, currentPage: 0, total: 0 }
  }),
  actions: {
    async fetchColumns (params: any) {
      const { currentPage = 1, pageSize = 6 } = params
      if (this.columns.currentPage < currentPage) {
        const rawData = await asyncAxios(
          `/columns?currentPage=${currentPage}&pageSize=${pageSize}`
        )
        const { data } = this.columns
        const { list, count } = rawData.data
        this.columns = {
          data: { ...data, ...arrToObj(list) },
          currentPage: rawData.data.currentPage * 1,
          total: count
        }
      }
    },
    async fetchColumn (cid: string) {
      if (!this.columns.data[cid]) {
        const rawData = await asyncAxios(`/columns/${cid}`)
        this.columns.data[rawData.data._id] = rawData.data
      }
    }
  },
  getters: {
    getColumns: (state) => {
      return objToArr(state.columns.data)
    },
    getColumnById: (state) => (id: string) => {
      return state.columns.data[id]
    }
  }
})
