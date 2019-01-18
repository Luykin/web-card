<template>
  <transition name="layer">
    <div class="index">
      <div class="index-main">
        <div class="kxk-box flex fw">
          <div class="main-title flex">
            【科学考-注册】
          </div>
          <div class="flex kxk-input">
            <el-input v-model="phone" placeholder="请填写手机号"></el-input>
          </div>
          <el-alert
            title="请填写正确的手机号"
            type="error" class="el-alert" v-show="phone_err" :closable="false">
          </el-alert>
          <div class="flex kxk-input">
            <el-input v-model="code" placeholder="请填写验证码"></el-input>
            <el-button type="primary" plain @click="_sendCode">{{tips}}</el-button>
          </div>
          <div class="login-btn flex cur" @click="_register">注册</div>
          <router-link tag='div' to='/login/index' class="login-btn flex cur" replace>
            已有账号？去登录
          </router-link>
          <!--<img src="http://cdn.jiangzhifan.com/Connect_logo_4.png" class="cur"/>-->
          <div class="other-login flex">
            <span>第三方登录：</span>
            <img src="http://cdn.jiangzhifan.com/Connect_logo_3.png" class="cur" @click="TXLogin()"/>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  const REG_PHONE = /^(((13[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}|(19[0-9]{1})))+\d{8})$/
  const QQ_URL = 'https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=101542054&redirect_uri=http%3a%2f%2fwww.jiangzhifan.com%2f%23%2ftxLogin&state=text';
  import {send_message, register} from 'api/index'
  import {encrypt} from 'api/util'
  export default {
    name: "login",
    data() {
      return {
        time: 0,
        phone: '',
        code: ''
      }
    },
    computed: {
      tips() {
        return this.time <= 0 ? '发送验证码' : `${this.time}s`
      },
      phone_err() {
        if (!this.phone) {
          return false
        }
        return !REG_PHONE.test(this.phone)
      }
    },
    methods: {
      TXLogin() {
        window.location.href = QQ_URL
      },
      async _register() {
        if (!this._verifyPhone(this.phone)) {
          this.$message({
            message: '请正确填写手机号',
            type: 'warning'
          });
          return false
        }
        if (!this.code) {
          this.$message({
            message: '请填写验证码',
            type: 'warning'
          });
          return false
        }
        this.$root.eventHub.$emit('loading', true);
        const ret = await register(this.phone, this.code);
        this.$root.eventHub.$emit('loading', null);
        if (ret.status === 200 && ret.data.state === 200) {
          this.$message({
            message: '恭喜你，注册成功',
            type: 'success'
          });
          this.$router.replace({
            path: '/index'
          });
          this.phone = '';
          this.code = '';
          this.$root.user = ret.data;
          localStorage.setItem('user-info', encodeURIComponent(JSON.stringify(ret.data)));
          return false
        }
        if (ret.data.state === 430) {
          this.code = '';
          this.$message.error('验证码错误');
          return false
        }
        if (ret.data.state === 432) {
          this.$router.replace({
            path: '/login/index'
          });
          this.code = '';
          this.$message.error('您已注册过了');
          return false
        }
        this.$message.error('出错啦');
      },
      setTime(time) {
        this.time = time;
        let timer = setInterval(() => {
          if (this.time <= 0) {
            clearInterval(timer);
            this.time = 0;
            timer = null
          } else {
            this.time -= 1
          }
        },1000)
      },
      async _sendCode() {
        if (this.time) {
          this.$message({
            message: '请等待倒计时结束',
            type: 'warning'
          });
          return false
        }
        if (!this._verifyPhone(this.phone)) {
          this.$message({
            message: '请正确填写手机号',
            type: 'warning'
          });
          return false
        }
        this.$root.eventHub.$emit('loading', true);
        const ret = await send_message(this.phone);
        this.$root.eventHub.$emit('loading', null);
        if (ret.status === 200 && ret.data.state === 200) {
          this.$message({
            message: '验证码发送成功',
            type: 'success'
          });
          this.setTime(60);
        }
      },
      _verifyPhone(phone) {
        if (!phone) {
          return false
        }
        let myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}|(19[0-9]{1})))+\d{8})$/;
        return myreg.test(phone)
      },
    }
  }
</script>

<style scoped>
  .main-title {
    color: #367abd;
    font-size: 18px;
    height: 68px;
  }
  .other-login{
    margin-top: 18px;
    color: #666;
  }
  .other-login img{
    width: 120px;
    height: auto;
  }
  .el-alert{
    width: 80%;
  }
</style>
