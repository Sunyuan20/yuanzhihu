<template>
  <div class="create-post-page container mx-auto">
    <h4 class="fw-bold text-start mb-3">
      {{ isEditMode ? '编辑文章' : '新建文章' }}
    </h4>
    <up-loader
      action="/upload"
      :beforeUpload="beforeUpload"
      :uploaded="uploadedData"
      @file-uploaded="onFileUploaded"
      class="file-uploader-contaier mb-3 d-flex align-items-center justify-content-center bg-light text-secondary w-100 my-4"
    >
      <template #uploaded="dataProps">
        <img :src="dataProps.uploadedData.data.url" />
      </template>
      <template #loading>
        <div class="d-flex">
          <div class="spinner-border text-secondary" role="status">
            <span class="visually-hidden">正在上传... </span>
          </div>
          <h2>正在上传...</h2>
        </div>
      </template>
      <template #default>
        <h2>点击上传头图</h2>
      </template>
    </up-loader>
    <validata-form @form-submit="onFormSubmit">
      <div class="mb-3">
        <div class="form-label text-start">文章标题：</div>
        <validate-input
          :rules="titleRules"
          v-model="titleVal"
          placeholder="请输入文章标题"
          type="text"
        ></validate-input>
      </div>
      <div class="mb-3">
        <div class="form-label text-start">文章详情：</div>
        <validate-input
          :rules="contentRules"
          v-model="contentVal"
          placeholder="请输入文章内容"
          type="text"
          tag="textarea"
          rows="10"
        ></validate-input>
      </div>
      <template #submit>
        <button class="btn btn-primary col-12">发表文章</button>
      </template>
    </validata-form>
  </div>
</template>

<script lang="ts">
import ValidataForm from '@/components/ValidataForm.vue'
import ValidateInput, { RulesProp } from '@/components/ValidateInput.vue'
import UpLoader from '../components/UpLoader.vue'
import createMessage from '../components/createMessage'
// import { ResponseType, ImageProps, GlobalDataProps, PostProps } from '../store'
import { defineComponent, ref, onMounted } from 'vue'
// import { useStore } from 'vuex'
import { usePostsStore, ResponseType, PostProps } from '../stores/posts'
import { useUserStore } from '../stores/user'
import { ImageProps } from '../stores/colums'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
export default defineComponent({
  components: { ValidataForm, ValidateInput, UpLoader },
  setup () {
    const uploadedData = ref()
    const router = useRouter()
    const route = useRoute()
    const isEditMode = !!route.query.id
    const titleVal = ref()
    const contentVal = ref()
    // TODO
    // const store = useStore<GlobalDataProps>()
    const storePosts = usePostsStore()
    const storeUsers = useUserStore()
    let imageId = ''
    onMounted(() => {
      if (isEditMode) {
        storePosts
          .fetchPost(route.query.id as string)
          .then((rawDate: ResponseType<PostProps>) => {
            const postDetail = rawDate.data
            if (postDetail.image) {
              uploadedData.value = { data: postDetail.image }
            }
            titleVal.value = postDetail.title
            contentVal.value = postDetail.content
          })
      }
    })
    const titleRules: RulesProp = [
      { type: 'required', message: '文章标题不能为空' }
    ]
    const contentRules: RulesProp = [
      { type: 'required', message: '文章内容不能为空' }
    ]
    const onFileUploaded = (rawData: ResponseType<ImageProps>) => {
      if (rawData.data._id) {
        imageId = rawData.data._id
      }
    }
    const onFormSubmit = (result: boolean) => {
      const { column, _id } = storeUsers.user
      if (column && result) {
        const newPost: PostProps = {
          title: titleVal.value,
          content: contentVal.value,
          column,
          author: _id
        }
        if (newPost.image && imageId) {
          newPost.image._id = imageId
        }
        const actionName = isEditMode ? 'updatePost' : 'createPost'
        const sendDate = isEditMode
          ? {
              id: route.query.id,
              payload: newPost
            }
          : newPost
        storePosts[actionName](sendDate).then(({ data }) => {
          createMessage('发表成功，2秒后跳转到文章', 'success')
          setTimeout(() => {
            router.push({ name: 'post', params: { id: data._id } })
          }, 2000)
        })
      }
    }
    const handleFileChange = (e: Event) => {
      const target = e.target as HTMLInputElement
      const files = target.files
      if (files) {
        const uploadedFile = files[0]
        const formData = new FormData()
        formData.append(uploadedFile.name, uploadedFile)
        axios
          .post('/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          .then((res) => {
            console.log(res)
          })
      }
    }
    const beforeUpload = (file: File) => {
      const isValidFormat = ['image/jpeg', 'image/png'].includes(file.type)
      const isValidSize = file.size / 1024 / 1024 <= 1
      if (!isValidFormat) {
        createMessage('上传的图片只能是 JPG/PNG 格式！', 'error')
        if (!isValidSize) {
          createMessage('上传的图片大小不能超过 1M ！', 'error')
        }
      }
      return isValidFormat && isValidSize
    }

    return {
      onFormSubmit,
      titleRules,
      contentRules,
      titleVal,
      contentVal,
      handleFileChange,
      beforeUpload,
      onFileUploaded,
      uploadedData,
      isEditMode
    }
  }
})
</script>

<style>
.create-post-page .file-uploader-contaier {
  height: 200px;
  cursor: pointer;
}
.create-post-page .file-uploader-contaier img {
  height: 100%;
  width: 100%;
  object-fit: contain;
  /* 可替换元素的内容应该如何适应到其高度和宽度确定的框（是响应式的） */
}
</style>
