<template>
  <div class="column-detail-page w-75 mx-auto">
    <div class="column-info row mb-4 border-bottom pb-4 align-items-center">
      <div class="col-3">
        <img
          :src="columnAvatar"
          :alt="column?.title"
          class="rounded-circle w-50"
        />
      </div>
      <div class="col-9">
        <h4 class="text-start">{{ column && column.title }}</h4>
        <p class="text-muted text-start">{{ column && column.description }}</p>
      </div>
    </div>
    <post-list :list="list"></post-list>
    <button
      class="btn btn-outline-primary mt-2 mb-5 mx-auto w-25"
      @click="loadMorePage"
      v-if="!isLastPage"
    >
      加载更多
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
// import store from '../store'
import { useColumnsStore } from '../stores/colums'
import { usePostsStore } from '../stores/posts'
import PostList from '../components/PostList.vue'
import useLoadMore from '../hooks/useLoadMore'
export default defineComponent({
  components: { PostList },
  setup () {
    const route = useRoute()
    const currentId = route.params.id as string
    const storeColums = useColumnsStore()
    const storePosts = usePostsStore()
    onMounted(() => {
      storeColums.fetchColumn(currentId)
      storePosts.fetchPosts({ cid: currentId, params: { pageSize: 4 } })
    })
    const total = computed(() => {
      if (storePosts.posts.loadedColumns[currentId]) {
        return storePosts.posts.loadedColumns[currentId].total
      } else {
        return 0
      }
    })
    const currentPage = computed(() => {
      if (storePosts.posts.loadedColumns[currentId]) {
        return storePosts.posts.loadedColumns[currentId].currentPage
      } else {
        return 0
      }
    })
    const { loadMorePage, isLastPage } = useLoadMore(
      'fetchPosts',
      total,
      {
        pageSize: 4,
        currentPage: currentPage.value ? currentPage.value + 1 : 2
      },
      currentId
    )
    const column = computed(() => storeColums.getColumnById(currentId))
    const list = computed(() => storePosts.getPostsByCid(currentId))
    const columnAvatar = computed(() => {
      if (column.value?.avatar) {
        if (
          !column.value.avatar.url?.includes(
            '?x-oss-process=image/resize,m_fixed'
          )
        ) {
          return (
            column.value.avatar.url +
            '?x-oss-process=image/resize,m_fixed,h_100,w_100'
          )
        } else {
          return column.value.avatar.url
        }
      } else {
        return undefined
      }
    })
    return {
      column,
      list,
      columnAvatar,
      loadMorePage,
      isLastPage
    }
  }
})
</script>
