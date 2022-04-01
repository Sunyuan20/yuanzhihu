<template>
  <div class="post-list">
    <article v-for="post in list" :key="post._id" class="card mb-3 shadow-sm">
      <div class="card-body text-start">
        <h4 class="fw-bold">{{ post.title }}</h4>
        <div class="row my-3 align-items-center">
          <div v-if="post.image" class="col-3">
            <img :src="post.image.url" :alt="post.title" class="rounded w-100" />
          </div>
          <p class="text-muted text-start" :class="{ 'col-9': post.image }">
            {{ post.excerpt }}
          </p>
        </div>
        <span class="text-muted">{{ post.createdAt }}</span>
      </div>
    </article>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'
import { GlobalDataProps } from '../store'
export default defineComponent({
  setup () {
    const store = useStore<GlobalDataProps>()
    const list = computed(() => store.state.posts)
    return {
      list
    }
  }
})
</script>
