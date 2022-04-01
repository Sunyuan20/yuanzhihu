<template>
  <div class="create-post-page">
    <h4 class="fw-bold text-start">新建文章</h4>
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
        <button class="btn btn-primary btn-lg d-grid col-2">发表文章</button>
      </template>
    </validata-form>
  </div>
</template>

<script lang="ts">
import ValidataForm from '@/components/ValidataForm.vue'
import ValidateInput, { RulesProp } from '@/components/ValidateInput.vue'
import { defineComponent, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { GlobalDataProps, PostProps } from '../store'
export default defineComponent({
  components: { ValidataForm, ValidateInput },
  setup () {
    const router = useRouter()
    const titleVal = ref()
    const contentVal = ref()
    const store = useStore<GlobalDataProps>()
    const titleRules: RulesProp = [
      { type: 'required', message: '文章标题不能为空' }
    ]
    const contentRules: RulesProp = [
      { type: 'required', message: '文章内容不能为空' }
    ]
    const onFormSubmit = (result: boolean) => {
      // const { columnId } = store.state.user
      // if (columnId && result) {
      //   const newPost: PostProps = {
      //     _id: '1',
      //     title: titleVal.value,
      //     content: contentVal.value,
      //     columnId,
      //     createdAt: new Date().toLocaleString()
      //   }
      //   store.commit('createPost', newPost)
      //   router.push({ name: 'column', params: { id: columnId } })
      // }
    }
    return {
      onFormSubmit,
      titleRules,
      contentRules,
      titleVal,
      contentVal
    }
  }
})
</script>
