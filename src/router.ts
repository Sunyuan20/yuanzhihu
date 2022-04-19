import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './views/HomeView.vue'
import LoginView from './views/LoginView.vue'
import SignUpView from './views/SignUpView.vue'
import ColumDetail from './views/ColumDetail.vue'
import PostDetail from './views/PostDetail.vue'
import CreatePost from './views/CreatePost.vue'
import store from './store'
import axios from 'axios'

const routerHistory = createWebHistory('/yuanzhihu')
const router = createRouter({
  history: routerHistory,
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: {
        redirectAlreadyLogin: true
      }
    },
    {
      path: '/post/:id',
      name: 'post',
      component: PostDetail
    },
    {
      path: '/column/:id',
      name: 'column',
      component: ColumDetail
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignUpView
    },
    {
      path: '/createpost',
      name: 'createpost',
      component: CreatePost,
      meta: {
        requiredLogin: true
      }
    }
  ]
})
router.beforeEach((to, from, next) => {
  // 创建全局前置守卫
  const { user, token } = store.state
  const { requiredLogin, redirectAlreadyLogin } = to.meta
  if (!user.isLogin) {
    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`
      store.dispatch('fetchCurrentUser').then(() => {
        if (redirectAlreadyLogin) {
          next('/')
        } else {
          document.documentElement.scrollTop = 0 // 路由跳转回到页面顶部
          next()
        }
      }).catch(() => {
        store.commit('logOut')
        next('/login')
      })
    } else {
      if (requiredLogin) {
        next('/login')
      } else {
        document.documentElement.scrollTop = 0
        next()
      }
    }
  } else {
    if (redirectAlreadyLogin) {
      next('/')
    } else {
      document.documentElement.scrollTop = 0
      next()
    }
  }
})

export default router
