<template>
  <div class="home-page container-md">
    <section class="text-center container">
      <div class="row mb-4">
        <div class="col-lg-6 col-md-8 mx-auto">
          <img src="../assets/callout.svg" alt="callout" class="w-50" />
          <h2 class="font-weight-light">随心写作，自由表达</h2>
          <p>
            <router-link to="/createpost" class="btn btn-primary my-2">开始写文章</router-link>
          </p>
        </div>
      </div>
    </section>
    <h4 class="font-weight-bold text-center">发现精彩</h4>
    <column-list :list="list"></column-list>
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
import { computed, defineComponent, onMounted } from 'vue'
// import { useStore } from 'vuex'
// import { GlobalDataProps } from '../store'
import { useColumnsStore } from '../stores/colums'
import useLoadMore from '../hooks/useLoadMore'
import ColumnList from '../components/ColumnList.vue'

export default defineComponent({
  name: 'HomeView',
  components: {
    ColumnList
  },
  setup () {
    // const store = useStore<GlobalDataProps>()
    const store = useColumnsStore()
    const total = computed(() => store.columns.total)
    const currentPage = computed(() => store.columns.currentPage)
    onMounted(() => {
      store.fetchColumns({ pageSize: 3 })
    })
    const list = computed(() => store.getColumns)
    const { loadMorePage, isLastPage } = useLoadMore('fetchColumns', total, {
      pageSize: 3,
      currentPage: currentPage.value ? currentPage.value + 1 : 2
    })
    return {
      list,
      loadMorePage,
      isLastPage
    }
  }
})
</script>
