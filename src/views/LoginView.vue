<template>
  <div class="login-page mx-auto p-3 w-50">
    <validate-form @form-submit="onFormSubmit">
      <div class="mb-1">
        <div class="form-label text-start fw-bold fs-4">邮箱地址</div>
        <validate-input
          :rules="emailRules"
          v-model="emailVal"
          placeholder="请输入邮箱地址"
          type="text"
        ></validate-input>
      </div>
      <div class="mb-1">
        <div class="form-label text-start fw-bold fs-4">密码</div>
        <validate-input
          type="password"
          class="form-control"
          :rules="passwordRules"
          v-model="passwordVal"
          placeholder="请输入密码"
        />
      </div>
      <div class="mb-3 form-check">
        <input type="checkbox" class="form-check-input" />
        <div class="form-check-label text-start">记住密码</div>
      </div>
      <template #submit>
        <button type="submit" class="btn btn-primary col-12" >登录</button>
      </template>
    </validate-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import ValidateInput, { RulesProp } from '../components/ValidateInput.vue'
import ValidateForm from '../components/ValidataForm.vue'
import creatrMessage from '../components/createMessage'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { GlobalDataProps } from '@/store'

export default defineComponent({
  name: 'LoginView',
  setup () {
    const store = useStore<GlobalDataProps>()
    const router = useRouter()
    const emailVal = ref('')
    const passwordVal = ref('')
    const emailRules: RulesProp = [
      { type: 'required', message: '邮箱地址不能为空' },
      { type: 'email', message: '请输入正确的邮箱地址格式' }
    ]
    const passwordRules: RulesProp = [
      { type: 'required', message: '密码不能为空' },
      {
        type: 'password',
        message: '密码长度在6-15位之间'
      }
    ]
    const onFormSubmit = (result: boolean) => {
      if (result) {
        const payload = {
          email: emailVal.value,
          password: passwordVal.value
        }
        store
          .dispatch('loginAndFetch', payload)
          .then(() => {
            creatrMessage('登陆成功！2秒后跳转首页', 'success')
            setTimeout(() => {
              router.push('/')
            }, 2000)
          })
          .catch((e) => {
            console.log(e)
          })
      }
    }
    return {
      emailRules,
      emailVal,
      passwordRules,
      passwordVal,
      onFormSubmit
    }
  },
  components: {
    ValidateInput,
    ValidateForm
  }
})
</script>
