import Vue from 'vue'
import Router from 'vue-router'
// import { NOWCONFIG } from 'api/appConfig'

Vue.use(Router)

// const config = NOWCONFIG

const routerconst = new Router({
  routes: [{
      path: '/',
      redirect: '/index'
    },
    {
      path: '/old-index',
      meta: { index: true },
      name: 'index',
      component: () =>
        import (`components/index/index`)
    },
    {
      path: '/index',
      name: 'index',
      meta: { index: true },
      component: () =>
        import (`components/index/new-index`)
    },
    {
      path: '/modify-password',
      name: 'modify-password',
      component: () =>
        import ('components/modify-password/modify-password')
    },
    {
      path: '/login',
      name: 'login',
      component: () =>
        import ('components/login/login')
    },
    {
      path: '/register',
      name: 'register',
      component: () =>
        import ('components/register/register')
    },
    {
      path: '/retrieve-password',
      name: 'retrieve-password',
      component: () =>
        import ('components/retrieve-password/retrieve-password')
    },
    {
      path: '/score-record',
      name: 'score-record',
      component: () =>
        import ('components/score-record/score-record')
    },
    {
      path: '/agent',
      name: 'agent',
      component: () =>
        import ('components/agent/agent')
    },
    {
      path: '/order',
      name: 'order',
      component: () =>
        import ('components/order/order'),
      children: [{
        path: ':id',
        component: () =>
          import ('components/order/order')
      }]
    },
    {
      path: '/management',
      name: 'management',
      meta: { managementag: true, management: true },
      component: () =>
        import ('components/management/management')
    },
    {
      path: '/edit',
      name: 'management',
      meta: { managementbg: true, management: true },
      component: () =>
        import ('components/edit/edit')
    },
    {
      path: '/goodsManage',
      name: 'management',
      meta: { managementag: true, management: true },
      component: () =>
        import ('components/goodsManage/goodsManage')
    },
    {
      path: '/reflect',
      name: 'management',
      meta: { managementag: true, management: true },
      component: () =>
        import ('components/reflect/reflect')
    },
    {
      path: '/reflectforbk',
      name: 'management',
      meta: { managementbg: true, management: true },
      component: () =>
        import ('components/reflect/reflectforbk')
    },
    {
      path: '/task',
      name: 'management',
      meta: { managementag: true, management: true },
      component: () =>
        import ('components/task/task')
    },
    {
      path: '/backstage',
      name: 'management',
      meta: { managementbg: true, management: true },
      component: () =>
        import ('components/backstage/backstage')
    },
    {
      path: '/recharge',
      name: 'management',
      meta: { managementbg: true, management: true },
      component: () =>
        import ('components/recharge/recharge')
    },
    {
      path: '/rechargeforag',
      name: 'management',
      meta: { managementag: true, management: true },
      component: () =>
        import ('components/recharge/rechargeforag')
    },
    {
      path: '/bg-money-record',
      name: 'management',
      meta: { managementbg: true, management: true },
      component: () =>
        import ('components/bg-money-record/bg-money-record')
    },
    {
      path: '/bg-task-record',
      name: 'management',
      meta: { managementbg: true, management: true },
      component: () =>
        import ('components/bg-task-record/bg-task-record')
    },
    {
      path: '/bar',
      name: 'bar',
      component: () =>
        import ('components/bar/bar')
    }
  ]
})

function pcOrphone() {
  if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
    return '/old-index'
  } else {
    return '/index'
  }
}
routerconst.beforeEach((to, from, next) => {
  // 主页跳转逻辑
  if (to.matched.some(record => record.meta.index)) {
    const index = pcOrphone()
    if (to.path !== index) {
      next({
        path: index
      })
    } else {
      next()
    }
  } else {
    next() // 确保一定要调用 next()
  }
})
routerconst.afterEach((to, from) => {
  if (to.matched.some(record => record.meta.management)) {
    if (to.matched.some(record => record.meta.managementbg)) {
      if (this.a) {
        this.a.app.pageData = 1
      }
    }
    if (to.matched.some(record => record.meta.managementag)) {
      if (this.a) {
        this.a.app.pageData = 2
      }
    }
  } else {
    if (this.a) {
      this.a.app.pageData = null
    }
  }
})
export default routerconst
