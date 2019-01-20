// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueAwesomeSwiper from 'vue-awesome-swiper'
Vue.use(VueAwesomeSwiper);
Vue.use(ElementUI);

Vue.config.productionTip = false;

const app = new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>',
  data: {
    eventHub: new Vue(),
    user: null,
    app_info: null,
    exercise_group: [],
    errorCode: {
      '404': '资源不存在',
      '405': '系统繁忙',
    }
  }
});

export function getuser() {
  if (!app) {
    return false
  }
  return app.user
}
export function setuser(user) {
  if (!app) {
    return false
  }
  if (user) {
    app.user = user
  }
}
