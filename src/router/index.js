import Vue from 'vue'
import Router from 'vue-router'
import {
  getuser,
  setuser
} from '../main.js'
Vue.use(Router);

// const config = NOWCONFIG

const routerconst = new Router({
  routes: [{
    path: '/',
    redirect: '/index'
  }, {
    path: '/index',
    name: 'index',
    component: () =>
      import (`components/index/index`),
    children: [{
      path: '/banner',
      name: 'index-banner',
      component: () =>
        import (`components/detail/banner`),
    }]
  }, {
    path: '/course',
    name: 'course',
    component: () =>
      import (`components/index/course`)
  }, {
    path: '/trainingSet',
    redirect: '/trainingSet/index',
    component: () =>
      import (`components/index/trainingSet`),
    children: [{
      path: '/trainingSet/cardSet',
      name: 'cardSet',
      meta: {login: true},
      component: () =>
        import (`components/detail/cardSet`),
    },{
      path: '/trainingSet/card',
      name: 'card',
      meta: {login: true},
      component: () =>
        import (`components/detail/card`),
    },{
      path: '/trainingSet/card-detail',
      name: 'card-detail',
      meta: {login: true},
      component: () =>
        import (`components/detail/card-detail`),
    },{
      path: '/trainingSet/index',
      name: 'train-index',
      component: () =>
        import (`components/detail/train-index`),
      children: [{
          path: '/banner',
          name: 'tr-banner',
          component: () =>
            import (`components/detail/banner`),
      }]
    }]
  }, {
    path: '/vip',
    name: 'vip',
    component: () =>
      import (`components/index/vip`),
    children: [{
      path: '/vip/buy',
      meta: {login: true},
      component: () =>
        import (`components/detail/vip-buy`),
    }]
  }, {
    path: '/user',
    name: 'user',
    meta: {login: true},
    component: () =>
      import (`components/index/user`)
  }, {
    path: '/login',
    redirect: '/login/index',
    component: () =>
      import (`components/index/login`),
    children: [{
      path: '/login/index',
      name: 'login-index',
      component: () =>
        import (`components/detail/login`),
    },{
      path: '/login/register',
      name: 'login-register',
      component: () =>
        import (`components/detail/register`),
    }]
  }]
});

routerconst.beforeEach((to, from, next) => {
  if (!getuser()) {
    try {
      const userinfo = localStorage.getItem('user-info');
      if (userinfo) {
        let time = setTimeout(() => {
          setuser(JSON.parse(decodeURIComponent(userinfo)));
          clearTimeout(time);
          time = null;
        }, 200);
      }
    } catch(e) {
      next()
    }
  }
  if (!getuser() && to.meta.login) {
    let time = setTimeout(() => {
      if (!getuser()) {
        next('/login/index');
      }
      clearTimeout(time);
      time = null;
    }, 250);
    next();
    return false
  }
  next()
});
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
