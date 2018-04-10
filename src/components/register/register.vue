<template>
  <div id="main-body">
    <div class="login-box flex" id="login-box">
      <div class="login-box-title flex">
        <div class="login-title">注册</div>
        <div class="min-font flex">注册帐号开始下单</div>
      </div>
      <div class="input-box flex">
        <i class="iconfont icon-msnui-user"></i>
        <input type="text" placeholder="手机号" class="i-ipnput" v-model="phone" @keyup.enter="_register" autofocus="autofocus">
      </div>
      <div class="input-box flex">
        <i class="iconfont icon-mima"></i>
        <input type="password" placeholder="密码" class="i-ipnput" v-model="password" @keyup.enter="_register">
      </div>
      <div class="input-box flex">
        <i class="iconfont icon-mima"></i>
        <input type="password" placeholder="再次输入密码" class="i-ipnput" v-model="rePassword" @keyup.enter="_register">
      </div>
      <label class="input-box flex" foe='code-input'>
        <div class="flex getcode">
          <i class="iconfont icon-duanxin"></i>
          <div class="flex getcode-btn cursor" @click="_getcode">{{time}}
            <span v-if="time > 0">s后重新获取</span>
          </div>
        </div>
        <input type="text" placeholder="验证码" class="i-ipnput code" id="code-input" v-model="code" @keyup.enter="_register">
      </label>
      <div class="btn flex modifybtn" @click="_register">注册</div>
      <div class="flex login-item">
        <router-link tag="div" class="to-register ellipsis cursor flex" to="/login">已有帐号？立即登录</router-link>
      </div>
    </div>
  </div>
</template>
<script type="text/javascript">
import { sendVerify, register } from 'api/login'
import { normalMixin } from 'common/js/mixin'
import { SUCCESS_CODE } from 'api/config'
export default {
  mixins: [normalMixin],
  data() {
    return {
      time: '获取验证码',
      phone: '',
      rePassword: '',
      password: '',
      code: ''
    }
  },
  created() {
    this._setTime()
    this.$root.eventHub.$emit('canvas')
  },
  methods: {
    _register() {
      if (!this._verifyPhone(this.phone) || !this._verifyPassword(this.password) || !this._verifyRePassword(this.password, this.rePassword) || !this._verifyCode(this.code)) {
        return false
      }
      register(this.phone, this.password, this.rePassword, this.code).then((res) => {
        if (res.data.err_code === SUCCESS_CODE) {
          this.$message({
            showClose: true,
            message: '注册成功',
            type: 'success'
          })
          this.$router.replace({
            path: '/login',
            query: {
              phone: this.phone
            }
          })
          return true
        } else {
          if (res.data.err_msg) {
            this.code = ''
            this.$message({
              showClose: true,
              message: this.$root.errorCode[res.data.err_code],
              type: 'error'
            })
          } else {
            this.password = ''
            this.rePassword = ''
            this.code = ''
            this.$message({
              showClose: true,
              message: '似乎出错了',
              type: 'error'
            })
          }
        }
      })
    },
    _setTime() {
      let nowTime = +new Date()
      let lastTime = localStorage.getItem('codeTime') || 0
      console.log(nowTime)
      console.log(lastTime)
      if (nowTime < lastTime) {
        this._countdown(parseInt((lastTime - nowTime) / 1000))
      }
    },
    _getcode() {
      if (typeof this.time === 'string') {
        if (!this._verifyPhone(this.phone)) {
          return false
        }
        let lastTime = +new Date() + 60 * 1000
        localStorage.setItem('codeTime', lastTime)
        this._countdown(60)
        this.netSendCode()
      } else {
        this.$message({
          showClose: true,
          message: '请稍后再试哦',
          type: 'warning'
        })
      }
    },
    _countdown(time) {
      this.time = time
      let timer = setInterval(() => {
        if (this.time > 1) {
          this.time = this.time - 1
        } else {
          this.time = '重新获取验证码'
          clearInterval(timer)
          timer = null
        }
      }, 1000)
    },
    netSendCode() {
      sendVerify(this.phone).then((res) => {
        if (res.data.err_code === SUCCESS_CODE) {
          this.$message({
            showClose: true,
            message: '验证码已发送',
            type: 'success'
          })
        } else {
          if (res.data.err_msg) {
            this.$message({
              showClose: true,
              message: this.$root.errorCode[res.data.err_code],
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
    }
  }
}

</script>
<style type="text/css" scoped>
.code {
  width: 40%;
}

.getcode {
  width: auto;
  min-width: 25%;
  height: 100%;
  justify-content: flex-start;
  overflow: hidden;
}

.getcode-btn {
  width: auto;
  height: 100%;
  margin-right: 5px;
  color: #ff9430;
}

.to-register {
  flex-grow: 1;
  flex-shrink: 0;
  min-width: 30%;
  color: #ff9430;
  margin: 0 20px;
}

.iconfont {
  font-size: 20px;
  margin: 0 10px;
}
.input-box{
  margin-bottom: 20px !important;
}

</style>
