import { useStore } from 'vuex'
import { ref, computed, ComputedRef } from 'vue'

interface LoadParams {
  currentPage: number
  pageSize: number
}
const useLoadMore = (
  actionName: string,
  total: ComputedRef<number>,
  params: LoadParams = { currentPage: 2, pageSize: 5 },
  extraData?: any
) => {
  const store = useStore()
  const currentPage = ref(params.currentPage)
  const pageSize = ref(params.pageSize)
  const requestParams = computed(() => ({
    currentPage: currentPage.value,
    pageSize: pageSize.value
  }))
  const loadMorePage = () => {
    if (extraData) {
      store
        .dispatch(actionName, { cid: extraData, params: requestParams.value })
        .then(() => {
          currentPage.value++
        })
    } else {
      store.dispatch(actionName, requestParams.value).then(() => {
        currentPage.value++
      })
    }
  }
  const isLastPage = computed(() => {
    return Math.ceil(total.value / params.pageSize) < currentPage.value
  })
  return {
    loadMorePage,
    isLastPage,
    currentPage
  }
}

export default useLoadMore
