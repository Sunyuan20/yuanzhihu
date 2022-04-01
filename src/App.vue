<template>
  <div class="container">
    <global-header :user="currentUser"></global-header>
    <loader-item v-if="isLoading"></loader-item>
    <router-view></router-view>
    <global-footer></global-footer>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import 'bootstrap/dist/css/bootstrap.min.css'
import GlobalHeader from './components/GlobalHeader.vue'
import GlobalFooter from './components/GlobalFooter.vue'
import LoaderItem from './components/LoaderItem.vue'
import creatrMessage from './components/createMessage'
import axios from 'axios'
import { GlobalDataProps } from './store'

export default defineComponent({
  name: 'App',
  setup () {
    const store = useStore<GlobalDataProps>()
    const currentUser = computed(() => store.state.user)
    const isLoading = computed(() => store.state.loading)
    const token = computed(() => store.state.token)
    const error = computed(() => store.state.error)
    onMounted(() => {
      if (!currentUser.value.isLogin) {
        if (store.state.token) {
          axios.defaults.headers.common.Authorization = `Bearer ${token.value}`
          store.dispatch('fetchCurrentUser')
        }
      }
    })
    watch(
      () => error.value.status,
      () => {
        const { status, message } = error.value
        if (status && message) {
          creatrMessage(message, 'error')
        }
      }
    )
    return {
      currentUser,
      isLoading,
      error
    }
  },
  components: {
    GlobalHeader,
    GlobalFooter,
    LoaderItem
  }
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-left: 60px;
  margin-right: 60px;
}
</style>
