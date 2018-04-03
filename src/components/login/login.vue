<template>
  <div id="main-body">
    <div class="login-box flex" id="login-box">
      <div class="login-box-title flex">
        <div>登录</div>
        <div class="min-font flex">登录后开始下单</div>
      </div>
      <div class="input-box flex">
        <i class="hover-out"></i>
        <input type="text" placeholder="用户名" class="i-ipnput" v-model="phone" autocomplete='on' @keyup.enter="_login">
        <i class="iconfont icon-msnui-user"></i>
      </div>
      <div class="input-box flex">
        <i class="hover-out"></i>
        <input type="password" placeholder="密码" class="i-ipnput" v-model="password" autocomplete='on' @keyup.enter="_login">
        <i class="iconfont icon-mima"></i>
      </div>
      <!--       <div class="input-box flex">
        <i class="hover-out"></i>
        <input type="text" placeholder="验证码" class="i-ipnput">
        <i class="iconfont icon-duanxin"></i>
      </div> -->
      <div class="btn flex" @click="_login">登录</div>
      <router-link tag="div" class="forget cursor" to="/retrieve-password">忘记密码</router-link>
      <router-link tag="div" class="to-register ellipsis cursor" to="/register">没有帐号？现在注册，免费获得积分</router-link>
    </div>
  </div>
</template>
<script type="text/javascript">
import { login } from 'api/login'
// import { getUserInfo } from 'api/public'
import { normalMixin } from 'common/js/mixin'
import { mapMutations } from 'vuex'
export default {
  mixins: [normalMixin],
  data() {
    return {
      phone: this.$route.query.phone || '',
      password: ''
    }
  },
  created() {

  },
  methods: {
    _login() {
      if (!this._verifyPhone(this.phone) || !this._verifyPassword(this.password)) {
        return false
      }
      const that = this
      login(this.phone, this.password).then((res) => {
        if (res.data.err_code === 0) {
          if (res.data.data.user) {
            that.setUser(res.data.data.user)
            // that.$root.eventHub.$emit('user')
            that.$message({
              showClose: true,
              message: '登录成功',
              type: 'success'
            })
            that.$router.replace({
              path: '/'
            })
          }
          console.log(res.data)
          if (res.data.data.token) {
            let tokenTime = +new Date() + 60 * 55 * 1000
            localStorage.setItem('tokenTime', tokenTime)
            that.setToken(res.data.data.token)
          } else {
            that.password = ''
            that.$message({
              showClose: true,
              message: 'token错误',
              type: 'error'
            })
          }
          return true
        } else {
          if (res.data.err_msg) {
            that.password = ''
            that.$message({
              showClose: true,
              message: res.data.err_msg,
              type: 'error'
            })
          } else {
            that.password = ''
            that.$message({
              showClose: true,
              message: '似乎出错了',
              type: 'error'
            })
          }
        }
      })
    },
    ...mapMutations({
      setToken: 'SET_TOKEN',
      setUser: 'SET_USER'
    })
  },
  watch: {
    $route() {
      this.phone = this.$route.query.phone
    }
  }
}

</script>
<style type="text/css" scoped>
.min-font {
  width: 100%;
  font-size: 13px;
  color: #bdbdbd;
  margin: 10px auto;
}

.forget {
  color: #666;
}

.forget:hover {
  color: #333;
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
  margin: 0 10px;
}

</style>
