<template>
  <div class="row">
    <div v-for="column in columnList" :key="column._id" class="col-4 mb-5">
      <div class="card h-100 shadow-sm">
        <div class="card-body text-center">
          <img
            :src="column.avatar && column.avatar.url"
            :alt="column.title"
            class="rounded-circle my-3"
          />
          <h5 class="card-title">{{ column.title }}</h5>
          <p class="card-text text-start">
            {{ column.description }}
          </p>
          <!-- <router-link :to="{name: 'column', params: {id: column.id}}" class="btn btn-outline-primary">进入专栏</router-link> -->
          <router-link
            :to="`/column/${column._id}`"
            class="btn btn-outline-primary"
            >进入专栏</router-link
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue'
import { ColumnProps } from '../store'
export default defineComponent({
  name: 'ColumnList',
  props: {
    list: {
      type: Array as PropType<ColumnProps[]>, // 想要把一个构造函数断言成一个类型, 需要使用到 PropType 这个方法
      required: true
    }
  },
  setup (props) {
    const columnList = computed(() => {
      return props.list.map((column) => {
        if (!column.avatar?.url) {
          column.avatar = {
            url: require('@/assets/column.jpg')
          }
        } else {
          if (
            !column.avatar.url.includes(
              '?x-oss-process=image/resize,m_fixed,h_80,w_80'
            )
          ) {
            column.avatar.url =
              column.avatar.url +
              '?x-oss-process=image/resize,m_fixed,h_80,w_80' // 将图片强制缩放到 50px * 50px
          }
        }
        return column
      })
    })
    return {
      columnList
    }
  }
})
</script>

<style scoped>
.card-body img {
  width: 80px;
  height: 80px;
}
</style>
