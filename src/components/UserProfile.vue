<template>
  <div class="user-profile-container row">
    <div class="col-2">
      <img :src="userAvatar" alt="" class="rounded-circle w-100" />
    </div>
      <div class="col-10">
        <div class="text-start fw-bold">
          {{ user.nickName }}
        </div>
        <div class="text-start text-secondary">
          {{ user.description }}
        </div>
      </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
// import { UserProps } from '../store'
import { UserProps } from '../stores/user'
export default defineComponent({
  props: {
    user: {
      type: Object as PropType<UserProps>,
      required: true
    }
  },
  setup (props) {
    const userAvatar = computed(() => {
      if (!props.user.avatar?.url) {
        return require('@/assets/column.jpg')
      } else {
        if (!props.user.avatar?.url.includes('?x-oss-process=image/resize,m_fixed')) {
          return props.user.avatar?.url + '?x-oss-process=image/resize,m_fixed,h_50,w_50'
        } else return props.user.avatar?.url
      }
    })
    return {
      userAvatar
    }
  }
})
</script>
