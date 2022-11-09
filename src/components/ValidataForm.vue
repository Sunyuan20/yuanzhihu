<template>
  <div>
    <slot name="default"></slot>
    <div class="submit-area" @click.prevent="submitForm">
      <slot name="submit">
        <button type="submit" class="btn btn-primary" >提交</button>
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onUnmounted } from 'vue'
import mitt from 'mitt'
type ValidateFunc = () => boolean
type Event = {
  'form-item-created': ValidateFunc
  'form-items-claer': ValidateFunc
}
export const emitter = mitt<Event>()
export default defineComponent({
  emits: ['form-submit'],
  setup (props, context) {
    let funcArr: ValidateFunc[] = []
    const submitForm = () => {
      const result = funcArr.map((func) => func()).every((result) => result)
      context.emit('form-submit', result)
    }
    const callback = (func: ValidateFunc) => {
      funcArr.push(func)
    }
    emitter.on('form-item-created', callback)
    emitter.on('form-items-claer', callback)
    onUnmounted(() => {
      emitter.off('form-item-created', callback)
      funcArr = []
    })
    return { submitForm }
  }
})
</script>
