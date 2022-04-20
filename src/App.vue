<template>
  <div class="container-fluid px-0 flex-shrink-0">
    <global-header :user="currentUser"></global-header>
    <loader-item v-if="isLoading"></loader-item>
    <router-view></router-view>
    <global-footer></global-footer>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, watch } from 'vue'
// import { useStore } from 'vuex'
import 'bootstrap/dist/css/bootstrap.min.css'
import GlobalHeader from './components/GlobalHeader.vue'
import GlobalFooter from './components/GlobalFooter.vue'
import LoaderItem from './components/LoaderItem.vue'
import creatrMessage from './components/createMessage'
// import { GlobalDataProps } from './store'
import { useUserStore } from './stores/user'
import { useErrorAndLoadStore } from './stores/errorAndLoad'

export default defineComponent({
  name: 'App',
  setup () {
    // const store = useStore<GlobalDataProps>()
    const storeUser = useUserStore()
    const storeErrorAndLoad = useErrorAndLoadStore()
    const currentUser = computed(() => storeUser.user)
    const isLoading = computed(() => storeErrorAndLoad.loading)
    const error = computed(() => storeErrorAndLoad.error)
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
}
</style>
