<template>
  <div class="singup-page mx-auto p-3 w-50">
    <validata-form @form-submit="onFormSubmit">
      <div class="mb-1">
        <div class="form-label text-start fw-bold fs-4">邮箱地址</div>
        <validate-input
          type="text"
          :rules="emailRules"
          v-model="formData.email"
          placeholder="请输入邮箱地址"
        ></validate-input>
      </div>
      <div class="mb-1">
        <div class="form-label text-start fw-bold fs-4">昵称</div>
        <validate-input
          type="text"
          class="form-control"
          :rules="nickNameRules"
          v-model="formData.nickName"
          placeholder="请输入昵称"
        />
      </div>
      <div class="mb-1">
        <div class="form-label text-start fw-bold fs-4">密码</div>
        <validate-input
          type="password"
          :rules="passwordRules"
          v-model="formData.password"
          placeholder="请输入密码"
        ></validate-input>
      </div>
      <div class="mb-1">
        <div class="form-label text-start fw-bold fs-4">再次输入密码</div>
        <validate-input
          type="password"
          class="form-control"
          :rules="repeatPasswordRules"
          v-model="formData.repeatPassword"
          placeholder="再次输入密码"
        />
      </div>
      <template #submit>
        <button type="submit" class="btn btn-primary col-12">注册</button>
      </template>
    </validata-form>
  </div>
</template>

<script lang="ts">
import ValidataForm from '../components/ValidataForm.vue'
import ValidateInput, { RulesProp } from '../components/ValidateInput.vue'
import createMessage from '../components/createMessage'
import { defineComponent, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
export interface formDataProps {
  email: string
  nickName: string
  password: string
  repeatPassword: string
}
export default defineComponent({
  setup () {
    const store = useUserStore()
    const formData = reactive<formDataProps>({
      email: '',
      nickName: '',
      password: '',
      repeatPassword: ''
    })
    const router = useRouter()
    const emailRules: RulesProp = [
      { type: 'required', message: '邮箱地址不能为空' },
      { type: 'email', message: '请输入正确的邮箱地址格式' }
    ]
    const nickNameRules: RulesProp = [
      { type: 'required', message: '昵称不能为空' }
    ]
    const passwordRules: RulesProp = [
      { type: 'required', message: '密码不能为空' },
      {
        type: 'password',
        message: '密码长度在6-15位之间,且只能是数字和字母的组合'
      }
    ]
    const repeatPasswordRules: RulesProp = [
      { type: 'required', message: '请再次输入密码' },
      {
        type: 'custom',
        message: '两次输入的密码不相同',
        validator: () => {
          return formData.password === formData.repeatPassword
        }
      }
    ]
    const onFormSubmit = (result: boolean) => {
      if (result) {
        const payload = {
          email: formData.email,
          password: formData.password,
          nickName: formData.nickName
        }
        store.signUp(payload)
        createMessage('注册成功！正在跳转登陆页面', 'success')
        setTimeout(() => {
          router.push('/login')
        }, 2000)
      }
    }
    return {
      onFormSubmit,
      formData,
      emailRules,
      nickNameRules,
      passwordRules,
      repeatPasswordRules
    }
  },
  components: {
    ValidataForm,
    ValidateInput
  }
})
</script>

ValidataForm
