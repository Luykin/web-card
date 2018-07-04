<template>
  <div id="main-body" ref='mainbody'>
    <div class="login-box flex" id="login-box">
      <div class="login-box-title flex">
        <div class="login-title">登录</div>
        <div class="min-font flex">登录后开始下单</div>
      </div>
      <div class="input-box flex">
        <i class="iconfont icon-msnui-user"></i>
        <input type="text" placeholder="用户名" class="i-ipnput" v-model="phone" autocorrect="off" autocapitalize="off" @keyup.enter="_login" autofocus="autofocus" name="loginId">
      </div>
      <div class="input-box flex">
        <i class="iconfont icon-mima"></i>
        <input type="password" placeholder="密码" class="i-ipnput" v-model="password" autocorrect="off" autocapitalize="off" @keyup.enter="_login" name="password">
      </div>
      <div class="btn flex modifybtn" @click="_login">登录</div>
      <div class="flex login-item">
        <router-link tag="span" class="forget cursor flex" to="/retrieve-password">忘记密码?</router-link>
      </div>
      <div class="flex login-item">
        <router-link tag="span" class="to-register ellipsis cursor flex" to="/register">没有帐号？现在注册，免费获得积分</router-link>
      </div>
    </div>
  </div>
</template>
<script type="text/javascript">
import { login } from 'api/login'
// import { getUserInfo } from 'api/public'
import { normalMixin } from 'common/js/mixin'
import { mapMutations } from 'vuex'
import { SUCCESS_CODE } from 'api/config'
import { Judge } from 'common/js/judge'
export default {
  mixins: [normalMixin, Judge],
  data() {
    return {
      phone: this.$route.query.phone || '',
      password: ''
    }
  },
  created() {
    this.$root.eventHub.$emit('canvas')
    const that = this
    // setTimeout(()=>{
    // },1000)
  },
  methods: {
    _changePssword(str) {
      return this._repeatStringNumTimes('*', str.length)
    },
    _repeatStringNumTimes(string, times) {
      return times > 0 ? string.repeat(times) : ""
    },
    _login() {
      if (!this._verifyPhone(this.phone) || !this._verifyPassword(this.password)) {
        return false
      }
      const that = this
      login(this.phone, this.password).then((res) => {
        if (res.data.err_code === SUCCESS_CODE) {
          if (res.data.data.user) {
            that.setUser(res.data.data.user)
            this.$parent._open('登录成功')
            this.password = ''
            that.$router.replace({
              path: '/'
            })
          }
          if (res.data.data.token) {
            let tokenTime = +new Date() + 60 * 58 * 1000
            that.setTokenTime(tokenTime)
            that.setToken(res.data.data.token)
          } else {
            that.password = ''
            this.$parent._open('token错误')
          }
          return true
        } else {
          if (res.data.err_msg) {
            that.password = ''
            this.$parent._open(res.data.err_code === 404 ? '该用户不存在' : this.$root.errorCode[res.data.err_code])
          } else {
            that.password = ''
            this.$parent._open('似乎出错了')
          }
        }
      })
    },
    ...mapMutations({
      setToken: 'SET_TOKEN',
      setUser: 'SET_USER',
      setTokenTime: 'SET_TOKENTIME'
    })
  },
  components: {},
  watch: {
    $route() {
      this.phone = this.$route.query.phone
    }
  }
}

</script>
<style type="text/css" scoped>
.i-ipnput{
  background-color: #fff !important;
}
.forget {
  color: #333;
}

.forget:hover {
  color: #000;
}

.to-register {
  flex-grow: 1;
  flex-shrink: 0;
  min-width: 30%;
  color: #ff9430;
  margin: 0 20px;
}

.to-register:hover {
  color: #ff9480;
}

.iconfont {
  font-size: 20px;
  margin: 0 10px;
}

</style>
