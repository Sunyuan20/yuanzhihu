<template>
  <div class="post-list">
    <article v-for="post in posts" :key="post._id" class="card mb-3 shadow-sm">
      <div class="card-body text-start">
        <router-link class="fw-bold fs-3 text-decoration-none" :to="`/post/${post._id}`">{{
          post.title
        }}</router-link>
        <div class="row my-3 align-items-center">
          <div v-if="post.image" class="col-2">
            <img
              :src="post.image.url"
              :alt="post.title"
              class="rounded w-100"
            />
          </div>
          <p class="text-muted text-start" :class="{ 'col-10': post.image }">
            {{ post.excerpt }}
          </p>
        </div>
        <span class="text-muted">{{ post.createdAt }}</span>
      </div>
    </article>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
// import { PostProps } from '../store'
import { PostProps } from '../stores/posts'
export default defineComponent({
  props: {
    list: {
      required: true,
      type: Array as PropType<PostProps>
    }
  },
  setup (props) {
    const posts = computed(() => props.list)
    return {
      posts
    }
  }
})
</script>
