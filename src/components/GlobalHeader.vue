<template>
  <nav
    class="navbar navbar-expand-lg navbar-dark bg-primary justify-content-between mb-4 px-4"
  >
    <router-link class="navbar-brand" to="/" name="top">源知乎专栏</router-link>
    <ul v-if="!isLogin" class="list-inline mb-0">
      <li class="list-inline-item">
        <router-link class="btn btn-primary my-2" to="/login" role="button"
          >登录</router-link
        >
      </li>
      <li class="list-inline-item">
        <router-link class="btn btn-primary my-2" to="/signup" role="button"
          >注册</router-link
        >
      </li>
    </ul>
    <ul v-else class="list-inline mb-0">
      <li class="list-inline-item">
        <dropdown :title="`你好 ${user.nickName}`" class="my-2">
          <dropdown-items>
            <router-link to="/createpost" class="dropdown-item"
              >新建文章</router-link
            >
          </dropdown-items>
          <dropdown-items>
            <router-link :to="`/column/${user.column}`" class="dropdown-item"
              >我的专栏</router-link
            >
          </dropdown-items>
          <dropdown-items>
            <router-link :to="`/edit/${user._id}`" class="dropdown-item"
              >编辑资料</router-link
            >
          </dropdown-items>
          <dropdown-items>
            <a href="#" class="dropdown-item" @click.prevent="clickLogOut"
              >退出登录</a
            >
          </dropdown-items>
        </dropdown>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import Dropdown from './Dropdown.vue'
import DropdownItems from './DropdownItems.vue'
// import store, { UserProps } from '../store'
import { useUserStore, UserProps } from '../stores/user'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'GlobalHeader',
  components: {
    Dropdown,
    DropdownItems
  },
  props: {
    user: {
      type: Object as PropType<UserProps>,
      required: true
    }
  },
  setup () {
    const router = useRouter()
    const store = useUserStore()
    const isLogin = computed(() => store.user.isLogin)
    const clickLogOut = () => {
      store.logOut()
      router.push('/')
    }
    return {
      clickLogOut,
      isLogin
    }
  }
})
</script>
