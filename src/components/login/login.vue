<template>
  <div id="main-body">
    <div class="login-box flex" id="login-box">
      <div class="login-box-title flex">
        <div class="login-title">登录</div>
        <div class="min-font flex">登录后开始下单</div>
      </div>
      <div class="input-box flex">
        <i class="iconfont icon-msnui-user"></i>
        <input type="text" placeholder="用户名" class="i-ipnput" v-model="phone" autocomplete='on' @keyup.enter="_login" autofocus="autofocus">
      </div>
      <div class="input-box flex">
        <i class="iconfont icon-mima"></i>
        <input type="password" placeholder="密码" class="i-ipnput" v-model="password" autocomplete='on' @keyup.enter="_login">
      </div>
      <!--       <div class="input-box flex">
        <i class="hover-out"></i>
        <input type="text" placeholder="验证码" class="i-ipnput">
        <i class="iconfont icon-duanxin"></i>
      </div> -->
      <div class="btn flex modifybtn" @click="_login">登录</div>
      <div class="flex login-item">
        <router-link tag="span" class="forget cursor flex" to="/retrieve-password">忘记密码?</router-link>
      </div>
      <div class="flex login-item">
        <router-link tag="span" class="to-register ellipsis cursor flex" to="/register">没有帐号？现在注册，免费获得积分</router-link>
      </div>
    </div>
    <centerTips ref='centerTips'>
      <div class="tips-class flex ellipsis">{{centerTips}}</div>
    </centerTips>
  </div>
</template>
<script type="text/javascript">
import { login } from 'api/login'
// import { getUserInfo } from 'api/public'
import { normalMixin } from 'common/js/mixin'
import { mapMutations } from 'vuex'
import { SUCCESS_CODE } from 'api/config'
import centerTips from 'base/centerTips/centerTips'
export default {
  mixins: [normalMixin],
  data() {
    return {
      phone: this.$route.query.phone || '',
      password: ''
    }
  },
  created() {
    this.$root.eventHub.$emit('canvas')
  },
  methods: {
    _login() {
      if (!this._verifyPhone(this.phone) || !this._verifyPassword(this.password)) {
        return false
      }
      const that = this
      login(this.phone, this.password).then((res) => {
        if (res.data.err_code === SUCCESS_CODE) {
          if (res.data.data.user) {
            that.setUser(res.data.data.user)
            // that.$root.eventHub.$emit('user')
            this.centerTips = '登录成功'
            this.$refs.centerTips._open()
            this.$message({
              showClose: true,
              message: '登录成功',
              type: 'success'
            })
            that.$router.replace({
              path: '/'
            })
          }
          if (res.data.data.token) {
            let tokenTime = +new Date() + 60 * 58 * 1000
            // localStorage.setItem('tokenTime', tokenTime)
            that.setTokenTime(tokenTime)
            that.setToken(res.data.data.token)
          } else {
            that.password = ''
            this.centerTips = 'token错误'
            this.$refs.centerTips._open()
          }
          return true
        } else {
          if (res.data.err_msg) {
            that.password = ''
            this.centerTips = res.data.err_code === 404 ? '该用户不存在' : this.$root.errorCode[res.data.err_code]
            this.$refs.centerTips._open()
          } else {
            that.password = ''
            this.centerTips = '似乎出错了'
            this.$refs.centerTips._open()
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
  components: {
    centerTips
  },
  watch: {
    $route() {
      this.phone = this.$route.query.phone
    }
  }
}

</script>
<style type="text/css" scoped>
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
