<template>
  <div class="post-detail-container w-75 mx-auto">
    <modal
      title="删除文章"
      :visible="modalIsVisible"
      @modal-on-close="modalIsVisible = false"
      @modal-on-confirm="hideAndDelete"
    >
      <p>确定要删除这篇文章？</p>
    </modal>
    <img
      :src="postImage"
      class="header-image-container mb-3 d-flex align-items-center justify-content-center bg-light text-secondary w-100 my-4"
    />
    <h4 class="fw-bold text-start mb-3">{{ postDetail?.title }}</h4>
    <div
      class="user-profile-component border-top border-bottom py-3 mb-5 align-items-center row g-0"
    >
      <div class="col">
        <user-profile
          :user="postDetail?.author"
          v-if="typeof postDetail?.author === 'object'"
        ></user-profile>
      </div>
      <span class="text-muted col text-end font-italic"
        >发表于：{{ postDetail?.createdAt }}</span
      >
    </div>
    <div class="my-4 text-start" v-html="postContent"></div>
    <div v-if="showEditArea" class="btn-group mt-5">
      <router-link
        :to="{ name: 'createpost', query: { id: postDetail?._id } }"
        type="button"
        class="btn btn-success"
        >编辑</router-link
      >
      <button
        type="button"
        class="btn btn-danger"
        @click.prevent="modalIsVisible = true"
      >
        删除
      </button>
    </div>
  </div>
</template>

<script lang="ts">
// import store, { UserProps, ResponseType, PostProps } from '@/store'
import { usePostsStore, PostProps, ResponseType } from '../stores/posts'
import { useUserStore, UserProps } from '../stores/user'
import { computed, defineComponent, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MarkDownIt from 'markdown-it'
import UserProfile from '../components/UserProfile.vue'
import Modal from '../components/Modal.vue'
import createMessage from '@/components/createMessage'
export default defineComponent({
  components: { UserProfile, Modal },
  setup () {
    const route = useRoute()
    const router = useRouter()
    const currentPostId = route.params.id as string
    const storePosts = usePostsStore()
    const storeUser = useUserStore()
    const modalIsVisible = ref(false)
    const md = new MarkDownIt()
    onMounted(() => {
      storePosts.fetchPost(currentPostId)
    })
    const postDetail = computed(() => storePosts.getCurrentPost(currentPostId))
    const postImage = computed(() => {
      if (!postDetail.value?.image) {
        return require('@/assets/EldenRing.jpeg')
      } else {
        return postDetail.value.image.url as string
      }
    })
    const postContent = computed(() => {
      if (postDetail.value?.content) {
        return postDetail.value.isHTML
          ? postDetail.value.content
          : md.render(postDetail.value.content)
      } else {
        return null
      }
    })
    const showEditArea = computed(() => {
      const { isLogin, _id } = storeUser.user
      if (postDetail.value?.author && isLogin) {
        const postAuthor = postDetail.value.author as UserProps
        return postAuthor._id === _id
      } else {
        return false
      }
    })
    const hideAndDelete = () => {
      modalIsVisible.value = false
      storePosts
        .deletePost(currentPostId)
        .then((rawData: ResponseType<PostProps>) => {
          createMessage('删除成功，两秒之后跳转到专栏首页', 'success', 2000)
          setTimeout(() => {
            router.push({ name: 'column', params: { id: rawData.data.column } })
          }, 2000)
        })
    }
    return {
      postDetail,
      postImage,
      postContent,
      showEditArea,
      modalIsVisible,
      hideAndDelete
    }
  }
})
</script>

<style>
.post-detail-container .header-image-container {
  height: 400px;
  object-fit: contain;
}
</style>
