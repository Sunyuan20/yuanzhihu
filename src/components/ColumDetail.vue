<template>
  <div class="column-detail-page w-75 mx-auto">
    <div class="column-info row mb-4 border-bottom pb-4 align-items-center">
      <div class="col-3">
        <img
          :src="column && column.avatar && column.avatar.url"
          :alt="column && column.title"
          class="rounded-circle w-50"
        />
      </div>
      <div class="col-9">
        <h4 class="text-start">{{ column && column.title }}</h4>
        <p class="text-muted text-start">{{ column && column.description }}</p>
      </div>
    </div>
    <post-list :list="list"></post-list>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import store from '../store'
import PostList from './PostList.vue'
export default defineComponent({
  components: { PostList },
  setup () {
    const route = useRoute()
    const currentId = route.params.id
    onMounted(() => {
      store.dispatch('fetchColumn', currentId)
      store.dispatch('fetchPost', currentId)
    })
    const column = computed(() => store.getters.getColumnsById(currentId))
    const list = computed(() => store.getters.getPostsByCid(currentId))
    return {
      column,
      list
    }
  }
})
</script>
