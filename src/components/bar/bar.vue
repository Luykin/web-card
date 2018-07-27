<template>
  <div id="main-body">
    <!-- <img src="http://pbfntaxkx.bkt.clouddn.com/%E5%AD%97.png" alt="免费刷赞" class="title-img"> -->
    <div class="free-title-img"></div>
    <div class="login-box-bar flex" v-show="step === 1">
      <div class="free-good flex">
        <img src="http://pbfntaxkx.bkt.clouddn.com/%E7%A4%BC%E5%93%81%E5%88%B8001.png" alt="免费刷赞刷粉丝" class="free-img">
        <div class="gift-name flex ellipsis">+{{giftName}}</div>
      </div>
      <div class="free-input flex">
        <input placeholder="请输入需要刷的QQ号码" v-model="adtion" @keyup.enter="_nextStep" @keyup="_checkAdtion">
      </div>
      <div class="free-tips flex">
        <span>填写QQ号码立即领取{{giftName}}</span>
      </div>
      <div class="free-btn-warp flex">
        <div class="free-btn flex cursor" @click="_nextStep">下一步</div>
      </div>
    </div>
    <div class="login-box-bar flex" v-show="step === 2">
      <div class="free-good flex">
        <img src="http://pbfntaxkx.bkt.clouddn.com/%E7%A4%BC%E5%93%81%E5%88%B8001.png" alt="免费刷赞刷粉丝" class="free-img">
        <div class="gift-name flex ellipsis">{{giftName}}</div>
      </div>
      <div class="free-input flex">
        <input placeholder="请输入您的手机号" v-model="phone">
      </div>
      <div class="free-input flex">
        <!-- <label class="pass-word-warp" for='password'>{{password}}</label> -->
        <input placeholder="请输入您的密码" v-model="password" type="password">
      </div>
      <div class="free-input flex">
        <div class="clone-input flex ellipsis">QQ号码:{{adtion}}</div>
        <div class="free-code-btn flex cursor" @click="_back()">修改</div>
      </div>
      <div class="free-input flex">
        <input placeholder="请输入验证码" v-model="code">
        <div class="free-code-btn flex cursor" @click="_getcode">{{time}}<span v-if="time > 0">s后获取</span></div>
      </div>
      <div class="height10"></div>
      <!--       <label class="input-box flex" foe='code-input'>
        <i class="iconfont icon-fasongyoujian"></i>
        <input type="text" placeholder="验证码" class="i-ipnput code" id="code-input" v-model="code" @keyup.enter="_register">
        <div class="flex getcode">
          <div class="flex getcode-btn cursor" @click="_getcode">{{time}}
            <span v-if="time > 0">s后重新获取</span>
          </div>
        </div>
      </label> -->
      <div class="free-btn-warp flex">
        <div class="free-btn flex cursor" @click='_register' v-loading='loading'>提交</div>
      </div>
    </div>
    <div class="sucess-popup flex" v-if="showPop">
      <div class="gif-box"></div>
      <div class="sp-info">注：提交后，请打开您的手机QQ，进入我的名片界面就可以名片赞飞速上涨了！</div>
      <div class="free-btn flex cursor" @click='_toDingdan'>好的</div>
    </div>
    <interlayer ref="interlayer"></interlayer>
  </div>
</template>
<script type="text/javascript">
import { sendVerify, register, getFreeServices, login, addFreeTask } from 'api/login'
import { normalMixin } from 'common/js/mixin'
import { mapMutations } from 'vuex'
import { SUCCESS_CODE } from 'api/config'
import { Judge } from 'common/js/judge'
import { UAID } from 'api/config'
import interlayer from 'base/interlayer/interlayer'
export default {
  mixins: [normalMixin, Judge],
  data() {
    return {
      time: '获取验证码',
      phone: '',
      rePassword: '',
      password: '',
      code: '',
      adtion: '',
      step: 1,
      gift: null,
      giftName: null,
      loading: false,
      showPop: null,
    }
  },
  created() {
    this._getFreeTask()
    this._setTime()
    this.$root.eventHub.$emit('canvas')
  },
  mounted() {},
  methods: {
    _toDingdan() {
      this.$refs.interlayer._hiddenLayer()
      this.showPop = false
      this.$root.eventHub.$emit('updateOrder')
      this.$root.eventHub.$emit('canvas', true)
      this.$router.replace({
        path: '/order'
      })
    },
    _checkAdtion() {
      if (isNaN(this.adtion)) {
        this.adtion = ''
      }
    },
    _back() {
      this.step = 1
      this.password = ''
    },
    _nextStep() {
      if (!this.adtion) {
        this.$parent._open('请填写您的QQ号码')
        return false
      }
      if (this.adtion.length <= 4) {
        this.$parent._open('请正确填写您的QQ号码')
        return false
      }
      this.step = 2
    },
    _getFreeTask() {
      getFreeServices().then((res) => {
        if (res.data.err_code === SUCCESS_CODE && res.data.data) {
          this.gift = res.data.data
          if (!this.gift || this.gift.length <= 0) {
            this.$parent._open('活动暂未开启')
            this.$router.replace({
              path: '/'
            })
            return false
          }
          this.giftName = this.formatgift(this.gift)
        } else {
          this.$parent._open('活动暂未开启')
          this.$router.replace({
            path: '/index'
          })
        }
      })
    },
    _addFreeTask(token) {
      this.loading = true
      addFreeTask(this.gift[0].id, this.adtion, token).then((res) => {
        this.loading = false
        if (res.data.err_code === SUCCESS_CODE) {
          this.$refs.interlayer._showLayer()
          this.showPop = true
        } else {
          if (res.data.err_msg) {
            this.password = ''
            this.$parent._open(res.data.err_code === 404 ? '该用户不存在' : this.$root.errorCode[res.data.err_code])
          } else {
            this.password = ''
            this.$parent._open('似乎出错了')
          }
        }
      })
    },
    _logoin() {
      this.loading = true
      login(this.phone, this.password).then((res) => {
        this.loading = false
        if (res.data.err_code === SUCCESS_CODE) {
          if (res.data.data.user) {
            this.setUser(res.data.data.user)
          }
          if (res.data.data.token) {
            this._addFreeTask(res.data.data.token)
            let tokenTime = +new Date() + 60 * 58 * 1000
            this.setTokenTime(tokenTime)
            this.setToken(res.data.data.token)
          } else {
            that.password = ''
            this.$parent._open('token错误')
          }
          return true
        } else {
          if (res.data.err_msg) {
            this.password = ''
            this.$parent._open(res.data.err_code === 404 ? '该用户不存在' : this.$root.errorCode[res.data.err_code])
          } else {
            this.password = ''
            this.$parent._open('似乎出错了')
          }
        }
      })
    },
    formatgift(list) {
      let ret = ''
      list.forEach((item) => {
        ret += item.label
      })
      return ret
    },
    _register() {
      if (!this._verifyPhone(this.phone) || !this._verifyPassword(this.password) || !this._verifyRePassword(this.password, this.password) || !this._verifyCode(this.code)) {
        return false
      }
      this.loading = true
      register(this.phone, this.password, this.password, this.code).then((res) => {
        this.loading = false
        if (res.data.err_code === SUCCESS_CODE) {
          this._logoin()
          return true
        } else {
          if (res.data.err_msg) {
            this.code = ''
            this.$parent._open(this.$root.errorCode[res.data.err_code])
          } else {
            this.password = ''
            this.code = ''
            this.$parent._open('似乎出错了')
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
        this.$parent._open('请稍后再试哦')
      }
    },
    _countdown(time) {
      this.time = time
      let timer = setInterval(() => {
        if (this.time > 1) {
          this.time = this.time - 1
        } else {
          this.time = '重新获取'
          clearInterval(timer)
          timer = null
        }
      }, 1000)
    },
    netSendCode() {
      sendVerify(this.phone).then((res) => {
        if (res.data.err_code === SUCCESS_CODE) {
          this.$parent._open('验证码已发送')
        } else {
          if (res.data.err_msg) {
            this.$parent._open(this.$root.errorCode[res.data.err_code])
          } else {
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
  components: {
    interlayer
  }
}

</script>
<style type="text/css" scoped>
.free-title-img {
  width: 1000px;
  height: 285px;
  background: url('http://pbfntaxkx.bkt.clouddn.com/%E5%AD%97.png') no-repeat;
  background-size: cover;
  transform: translate(0, 50px);
  margin: 0px auto;
}

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

.input-box {
  margin-bottom: 20px !important;
}

.login-box-bar {
  transform: translate(0, 50px);
  margin: 0 auto;
  width: 480px;
  height: auto;
  min-height: 400px;
  background: rgba(35, 19, 78, .7);
  border-radius: 10px;
  flex-wrap: wrap;
  font-family: PingFangSC-Semibold;
  align-content: flex-start;
  justify-content: center;
  overflow: hidden;
}

.free-good {
  width: 70%;
  height: auto;
  margin: 35px 0 0;
  position: relative;
}

.free-input {
  width: 70%;
  height: 58px;
  margin: 25px 0 0;
  border-radius: 10px;
  overflow: hidden;
}

.clone-input {
  font-size: 18px;
  color: #f9f9f9;
  width: 0;
  flex-grow: 1;
  height: 100%;
  background: #B3B3B3;
  text-indent: 20px;
  border-radius: 10px;
  justify-content: flex-start;
}

.free-input input {
  font-size: 18px;
  color: #353535;
  width: 0;
  flex-grow: 1;
  height: 100%;
  background: #fff;
  text-indent: 20px;
  border-radius: 10px;
}

.free-code-btn {
  width: 35%;
  margin-left: 2%;
  height: 100%;
  background: linear-gradient(180deg, rgba(248, 46, 239, 1), rgba(74, 0, 156, 1));
  box-shadow: 0rem 0rem 0.71rem 0rem rgba(255, 255, 255, 0.38);
  border-radius: 10px;
  font-size: 16px;
  color: rgba(255, 255, 255, 1);
}

.free-input input::-webkit-input-placeholder {
  /*font-size: 20px;*/
  color: rgba(153, 153, 153, 1);
  /*text-indent: 20px;*/
}

.free-tips {
  width: 70%;
  height: 60px;
  justify-content: flex-start;
  color: #9196FF;
  font-size: 15px;
}

.free-btn-warp {
  border-top: 1px solid #741D8B;
  height: 120px;
  width: 100%;
}

.free-btn {
  width: 82%;
  height: 58px;
  background: linear-gradient(180deg, rgba(248, 46, 239, 1), rgba(74, 0, 156, 1));
  box-shadow: 0rem 0rem 0.71rem 0rem rgba(255, 255, 255, 0.38);
  border-radius: 0.29rem;
  font-size: 18px;
  letter-spacing: 18px;
  color: #fff;
}

.gift-name {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  color: #26154D;
  font-size: 20px;
  text-indent: -90px;
  font-weight: 600;
}

.height10 {
  width: 100%;
  height: 20px;
}

.pass-word-warp {
  font-size: 20px;
  color: #353535;
  width: 0;
  flex-grow: 1;
  height: 100%;
  background: #fff;
  text-indent: 20px;
}

#password {
  width: 0;
  height: 0;
  position: absolute;
  z-index: -1;
}

.sucess-popup {
  position: fixed;
  left: 50%;
  top: 50%;
  z-index: 999999;
  transform: translate(-50%, -50%);
  width: 34.5rem;
  height: 53.57rem;
  background: linear-gradient(180deg, rgba(141, 31, 224, 1), rgba(89, 53, 217, 1));
  border-radius: 1.93rem;
  border: 0.36rem solid rgba(193, 167, 255, 1);
  flex-wrap: wrap;
  align-content: center;
  transform-origin: 0% 0%;
  animation: popup .25s ease-in 1 forwards;
}

@keyframes popup {
  0% {
    transform: scale(.5, .5) translate(-50%, -50%);
  }
  100% {
    transform: scale(1, 1) translate(-50%, -50%);
  }
}

.gif-box {
  border-radius: 10px;
  background: url('http://pbfntaxkx.bkt.clouddn.com/%E5%88%B7%E8%B5%9E.gif') no-repeat;
  background-size: cover;
  width: 280px;
  height: 500px;
  overflow: hidden;
}

.sp-info {
  width: 90%;
  color: rgba(250, 206, 32, 1);
  font-size: 18px;
  line-height: 25px;
  margin: 20px auto;
}

</style>
