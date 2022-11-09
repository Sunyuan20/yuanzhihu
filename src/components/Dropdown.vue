<template>
  <div class="dropdown" ref="dropdownRef">
    <a
      class="btn btn-outline-light dropdown-toggle"
      href="#"
      role="button"
      @click.prevent="toggleOpen"
    >
      {{ title }}
    </a>
    <ul class="dropdown-menu" :style="{ display: 'block' }" v-if="isOpen">
      <slot></slot>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import useClickOutside from '../hooks/useClickOutside'
export default defineComponent({
  name: 'DropDown',
  props: {
    title: {
      type: String,
      required: true // 是否是必传项
    }
  },
  setup () {
    const isOpen = ref(false)
    const dropdownRef = ref<null | HTMLElement>(null) // 这个变量的设置要和 dom 节点中的 ref 一致，这样在调用这个变量的 value 时，就可以获取 dom 节点了
    const toggleOpen = () => {
      isOpen.value = !isOpen.value
    }
    const isClickOutside = useClickOutside(dropdownRef)
    watch(isClickOutside, () => {
      if (isOpen.value && isClickOutside.value) isOpen.value = false
    })
    return {
      isOpen,
      toggleOpen,
      dropdownRef
    }
  }
})
</script>
