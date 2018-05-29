import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/index'
    },
    {
      path: '/index',
      name: 'index',
      component: () => import('components/index/index')
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
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('components/register/register')
    },
    {
      path: '/retrieve-password',
      name: 'retrieve-password',
      component: () => import('components/retrieve-password/retrieve-password')
    },
    {
      path: '/score-record',
      name: 'score-record',
      component: () => import('components/score-record/score-record')
    },
    {
      path: '/agent',
      name: 'agent',
      component: () => import('components/agent/agent')
    },
    {
      path: '/order',
      name: 'order',
      component: () => import('components/order/order'),
      children: [{
        path: ':id',
        component: () => import('components/order/order')
      }]
    },
    {
      path: '/management',
      name: 'management',
      component: () => import('components/management/management')
    },
    {
      path: '/edit',
      name: 'management',
      component: () => import('components/edit/edit')
    },
    {
      path: '/goodsManage',
      name: 'management',
      component: () => import('components/goodsManage/goodsManage')
    },
    {
      path: '/reflect',
      name: 'management',
      component: () => import('components/reflect/reflect')
    }
    // Reflect
  ]
})
