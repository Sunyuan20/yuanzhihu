<template>
  <div class="validate-inout-container pb-3">
    <input
      v-if="tag !== 'textarea'"
      class="form-control"
      :class="{ 'is-invalid': inputRef.error }"
      @blur="validateInput"
      v-bind="$attrs"
      v-model="inputRef.val"
    />
    <textarea
      v-else
      class="form-control"
      :class="{ 'is-invalid': inputRef.error }"
      @blur="validateInput"
      v-bind="$attrs"
      v-model="inputRef.val"
    ></textarea>
    <span v-if="inputRef.error" class="invalid-feedback text-start">{{
      inputRef.message
    }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive, onMounted, computed } from 'vue'
import { emitter } from './ValidataForm.vue'
const emailReg =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
const passwordReg = /[0-9A-Za-z]{6,15}$/
interface RuleProp {
  type: 'required' | 'email' | 'password' | 'custom' // 此处可以扩展以适应不同的验证需求
  message: string
  validator?: () => boolean
}
export type RulesProp = RuleProp[]
export type TagType = 'input' | 'textarea'
export default defineComponent({
  props: {
    rules: Array as PropType<RulesProp>,
    modelValue: String,
    tag: {
      type: String as PropType<TagType>,
      default: 'input'
    }
  },
  inheritAttrs: false, // 组件的根元素不继承属性组件的属性
  setup (props, context) {
    const inputRef = reactive({
      val: computed({
        get: () => props.modelValue || '',
        set: (val) => {
          context.emit('update:modelValue', val)
        }
      }),
      error: false,
      message: ''
    })
    const validateInput = () => {
      if (props.rules) {
        const allPassed = props.rules.every((rule) => {
          let passed = true
          inputRef.message = rule.message
          switch (rule.type) {
            case 'required':
              passed = inputRef.val.trim() !== ''
              break
            case 'email':
              passed = emailReg.test(inputRef.val)
              break
            case 'password':
              passed = passwordReg.test(inputRef.val)
              break
            case 'custom': // 用户自定义规则
              passed = rule.validator ? rule.validator() : true
              break
            default:
              break
          }
          return passed
        })
        inputRef.error = !allPassed
        return allPassed
      }
      return true
    }
    const clearInputs = () => {
      const pass: boolean = validateInput()
      if (!pass) {
        inputRef.val = ''
        return false
      }
      return true
    }
    onMounted(() => {
      emitter.emit('form-item-created', validateInput)
      emitter.emit('form-items-claer', clearInputs)
    })
    return {
      inputRef,
      validateInput,
      clearInputs
    }
  }
})
</script>
