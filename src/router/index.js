import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// const config = NOWCONFIG

const routerconst = new Router({
  routes: [{
    path: '/',
    redirect: '/index'
  }, {
    path: '/index',
    name: 'index',
    component: () =>
      import (`components/index/index`)
  }, {
    path: '/course',
    name: 'course',
    component: () =>
      import (`components/index/course`)
  }, {
    path: '/trainingSet',
    name: 'trainingSet',
    component: () =>
      import (`components/index/trainingSet`)
  }, {
    path: '/vip',
    name: 'vip',
    component: () =>
      import (`components/index/vip`)
  }, {
    path: '/login',
    name: 'login',
    component: () =>
      import (`components/index/login`)
  }]
})

// routerconst.beforeEach((to, from, next) => {
//   // 主页跳转逻辑
//   console.log(to)
//   if (to.matched.some(record => record.meta.index)) {
//     const index = pcOrphone()
//     if (to.path !== index) {
//       next({
//         path: index
//       })
//     } else {
//       next()
//     }
//   } else {
//     next() // 确保一定要调用 next()
//   }
// })
// routerconst.afterEach((to, from) => {
//   // console.log(this)
//   if (to.matched.some(record => record.meta.management)) {
//     if (to.matched.some(record => record.meta.managementbg)) {
//       setpageData(1)
//     }
//     if (to.matched.some(record => record.meta.managementag)) {
//       setpageData(2)
//     }
//   } else {
//     setpageData(null)
//   }
// })
export default routerconst
