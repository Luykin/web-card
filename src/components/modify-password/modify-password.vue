<template>
  <div id="main-body">
    <div class="login-box" id="login-box">
      <div class="login-box-title flex">
        <div>修改密码</div>
        <div class="min-font flex">修改当前密码</div>
      </div>
      <div class="input-box flex">
        <input type="password" placeholder="旧密码" class="i-ipnput" v-model="password">
        <i class="iconfont icon-mima"></i>
      </div>
      <div class="input-box flex">
        <input type="password" placeholder="设置新的密码" class="i-ipnput" v-model="newPassword">
        <i class="iconfont icon-mima"></i>
      </div>
      <div class="input-box flex">
        <input type="password" placeholder="再次输入新的密码" class="i-ipnput" v-model="reNewPassword">
        <i class="iconfont icon-mima"></i>
      </div>
      <div class="btn flex" @click="_sublime">修改密码</div>
    </div>
  </div>
</template>
<script type="text/javascript">
import { updatePassword } from 'api/login'
import { normalMixin } from 'common/js/mixin'
import { testToken } from 'common/js/util'
import { mapGetters, mapMutations } from 'vuex'
export default {
  mixins: [normalMixin],
  data() {
    return {
      password: '',
      newPassword: '',
      reNewPassword: ''
    }
  },
  computed: {
    ...mapGetters([
      'user',
      'token'
    ])
  },
  methods: {
    checkTock() {
      if (!this.user) {
        this.$message({
          showClose: true,
          message: '请登录',
          type: 'warning'
        })
        this.$router.replace({
          path: '/login'
        })
        return false
      }
      if (!testToken()) {
        this.setUser(false)
        this.setToken(false)
        localStorage['tokenTime'] = false
        this.$message({
          showClose: true,
          message: '登录已失效',
          type: 'warning'
        })
        this.$router.replace({
          path: '/login'
        })
        return false
      }
      return true
    },
    _sublime() {
      if (!this.checkTock()) {
        return false
      }
      if (!this._verifyOldPassword(this.password) || !this._verifyPassword(this.newPassword) || !this._verifyRePassword(this.newPassword, this.reNewPassword)) {
        return false
      }
      updatePassword(this.password, this.newPassword, this.reNewPassword, this.token).then((res) => {
        if (res.data.err_code === 0) {
          this.setUser(false)
          this.setToken(false)
          this.$message({
            showClose: true,
            message: '设置成功，请重新登录',
            type: 'success'
          })
          this.$router.replace({
            path: '/login'
          })
        } else {
          this.password = ''
          if (res.data.err_msg) {
            this.$message({
              showClose: true,
              message: res.data.err_msg,
              type: 'error'
            })
          } else {
            this.$message({
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
      setUser: 'SET_USER',
      setScorerate: 'SET_SCORERATE'
    })
  }
}

</script>
<style type="text/css" scoped>
.login-box-title {
  width: 100%;
  height: 105px;
  font-size: 18px;
  flex-wrap: wrap;
  align-content: center;
}

.min-font {
  width: 100%;
  font-size: 13px;
  color: #bdbdbd;
  margin: 10px auto;
}

.iconfont {
  margin: 0 10px;
}

</style>
