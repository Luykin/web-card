// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'
import VueScroller from 'vue-scroller'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  data: {
    eventHub: new Vue(),
    judge: null,
    errorCode: {
      '404': '资源不存在',
      '405': '系统繁忙',
      '406': '系统繁忙',
      '408': '系统繁忙',
      '409': '系统繁忙',
      '412': '请检查本地设备时间',
      '420': '系统繁忙',
      '421': '参数类型错误',
      '422': '价格或积分错误',
      '423': '创建错误',
      '424': '获取说说错误',
      '425': '空间没有权限',
      '426': '获取日志错误',
      '428': '参数不在取值范围内',
      '429': '已存在',
      '430': '用户异常',
      '431': '验证码错误',
      '432': '密码错误',
      '433': '用户积分不足',
      '434': '资源无法被修改',
      '435': '请重新登陆',
      '500': '系统繁忙',
      '-1': '未知错误'
    }
  }
})
