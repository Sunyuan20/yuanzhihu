import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './views/HomeView.vue'
import LoginView from './views/LoginView.vue'
import SignUpView from './views/SignUpView.vue'
import ColumDetail from './components/ColumDetail.vue'
import CreatePost from './views/CreatePost.vue'
import store from './store'

const routerHistory = createWebHistory()
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
      path: '/test/:id',
      name: 'test',
      component: ColumDetail
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
  if (to.meta.requiredLogin && !store.state.user.isLogin) {
    next('/login')
  } else if (to.meta.redirectAlreadyLogin && store.state.user.isLogin) {
    next('/')
  } else next()
})

export default router
