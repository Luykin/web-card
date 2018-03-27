import Vue from 'vue'
import Router from 'vue-router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import index from '@/components/index'

Vue.use(Router)
Vue.use(ElementUI)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: index
    },
    {
      path: '/modify-password',
      name: 'modify-password',
      component: () => import('components/modify-password/modify-password')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('components/login/login')
    }
  ]
})
