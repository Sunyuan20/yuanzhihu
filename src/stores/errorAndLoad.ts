import { defineStore } from 'pinia'

interface GlobalErrorProps {
  status: boolean
  message?: string
}

interface State {
  error: GlobalErrorProps
  loading: boolean
}

export const useErrorAndLoadStore = defineStore('errorAndLoad', {
  state: (): State => ({
    error: { status: false },
    loading: false
  }),
  actions: {
    setLoading (status: boolean) {
      this.loading = status
    },
    setError (e: GlobalErrorProps) {
      this.error = e
    }
  }
})
