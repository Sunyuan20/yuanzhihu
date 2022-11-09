<template>
  <teleport to="#loading">
    <div
      class="d-flex justify-content-center align-items-center h-100 loading-container"
      :style="{ backgroundColor: background || '' }"
    >
      <div class="loading-content">
        <div class="spinner-border text-primary" role="status"></div>
        <span class="visually-hidden">{{ text || '正在加载中' }}</span>
        <div v-if="text" class="text-primary small">{{ text }}</div>
      </div>
    </div>
  </teleport>
</template>

<script lang="ts">
import useDOMCreate from '@/hooks/useDOMCreate'
import { defineComponent } from 'vue'
export default defineComponent({
  props: {
    text: {
      type: String
    },
    background: {
      type: String
    }
  },
  setup () {
    useDOMCreate('loading')
  }
})
</script>

<style>
.loading-container {
  background: rgba(255, 255, 255, 0.5);
  z-index: 100;
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  text-align: center;
}
</style>
