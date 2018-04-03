<template>
  <div>
    <header class="header flex">
      <nav class="phone-nav flex" id="phone-nav" @click="_showSidebar">
        <i class="iconfont icon-gengduo"></i>
      </nav>
      <div class="logo flex">
        <img src="../../assets/logo.png" class="logo-class">
      </div>
      <nav class="pc-nav flex" id="pc-nav">
        <div class="nav-ul flex">
          <el-menu :default-active="$route.path" class="el-menu-demo" mode="horizontal" @select="handleSelect" text-color="#000" active-text-color="#ff9430">
            <el-menu-item index="/index">提交订单</el-menu-item>
            <el-menu-item index="/order" v-show="user">我的订单</el-menu-item>
            <el-menu-item index="/score-record" v-show="user">积分记录</el-menu-item>
            <el-menu-item index="/none/1" v-show="user" class="disable">
              <div class="log-out" @click="_showPopup($event)">充值积分</div>
            </el-menu-item>
            <el-submenu index="/none" v-show="user">
              <template slot="title">我的账户</template>
              <el-menu-item index="/none" class='phone-item disable'>{{user.phone}}</el-menu-item>
              <el-menu-item index="/none" class='phone-item disable'>我的积分<span class="green-text">{{user.score}}</span></el-menu-item>
              <el-menu-item index="/modify-password">修改密码</el-menu-item>
              <el-menu-item index="/none" class='disable'>
                <div class="log-out" @click="_logout($event)">注销</div>
              </el-menu-item>
            </el-submenu>
            <el-menu-item index="/login" v-show="!user">登录帐号</el-menu-item>
          </el-menu>
        </div>
      </nav>
    </header>
    <sidebar ref="sidebar">
      <el-row class="tac">
        <el-col>
          <el-menu :default-active="$route.path" class="el-menu-vertical-demo" @select="handleSelect" text-color="#000" active-text-color="#ff9430">
            <el-menu-item index="/index">
              <i class="iconfont icon-tijiaodingdan"></i> 提交订单
            </el-menu-item>
            <el-menu-item index="/order" v-show="user">
              <i class="iconfont icon-unie64a"></i> 我的订单
            </el-menu-item>
            <!--            <el-submenu index="/order">
              <template slot="title">
                <i class="iconfont icon-unie64a"></i> 我的订单
              </template>
              <el-menu-item index="/order/1">选项1</el-menu-item>
              <el-menu-item index="/order/2">选项2</el-menu-item>
              <el-menu-item index="/order/3">选项3</el-menu-item>
            </el-submenu> -->
            <el-menu-item index="/score-record" v-show="user">
              <i class="iconfont icon-jilu"></i> 积分记录
            </el-menu-item>
            <el-menu-item index="/none/1" v-show="user" class='disable'>
              <i class="iconfont icon-jifen"></i>
              <div class="log-out" @click="_showPopup($event)">充值积分</div>
            </el-menu-item>
            <el-submenu v-show="user" index="5">
              <template slot="title">
                <i class="iconfont icon-zhanghu"></i> 我的账户
              </template>
              <el-menu-item index="/none" class='phone-item disable'>{{user.phone}}</el-menu-item>
              <el-menu-item index="/none" class='phone-item disable'><i class="iconfont icon-jifen"></i>我的积分<span class="green-text">{{user.score}}</span></el-menu-item>
              <el-menu-item index="/modify-password">修改密码</el-menu-item>
              <el-menu-item index="/none" class='disable'>
                <div class="log-out" @click="_logout($event)">注销</div>
              </el-menu-item>
            </el-submenu>
            <el-menu-item index="/login" v-show="!user">
              <i class="iconfont icon-msnui-user"></i> 登录帐号
            </el-menu-item>
          </el-menu>
        </el-col>
      </el-row>
    </sidebar>
    <interlayer ref="interlayer" @close="_hiddenSidebar"></interlayer>
    <popup ref="popup">
      <div class="recharge-box flex">
        <div class="recharge-box-title flex" v-show="!payUrl">积分充值</div>
        <div class="recharge-box-title flex" v-show="payUrl">微信扫码支付</div>
        <div class="content-qr flex" v-if="payUrl">
          <div class="code-div flex">订单编号:{{code}} 充值金额: {{money}}元</div>
          <div class="qrcode-box flex">
            <qrcode-vue :value="payUrl" :size="size" level="H"></qrcode-vue>
          </div>
          <div class="showWX flex">请用微信扫描二维码支付</div>
          <div class="qrcode-box flex">
            <div class="sureBtn flex" @click="_sureCompletionPayment">确定已完成支付</div>
          </div>
        </div>
        <!-- <div class="net-item flex" v-show="!payUrl">微信支付</div> -->
        <img src="../../assets/weixin.jpg" v-show="!payUrl" class="pay-img">
        <div class="flex input-defult" v-show="!payUrl">
          <!-- onkeyup="value=value.replace(/[^\d]/g,'') " ng-pattern="/[^a-zA-Z]/" -->
          <input type="text" placeholder="请输入充值金额（1元）" class="i-ipnput" v-model="money">
        </div>
        <div class="min-tips-text flex" v-show="!payUrl&&money">充值{{money|| 0}}元等于<span class="course-btn">{{money*100}}</span>积分</div>
        <div class="min-tips-text flex" v-show="!payUrl&&!money">如果支付异常，请联系客服进行充值。</div>
        <div class="recharge-btn-box flex" v-show="!payUrl">
          <div class="recharge-btn-sure flex" @click="_addOrder">确认</div>
          <div class="recharge-btn-sure flex" @click='_hiddenSidebar'>取消</div>
        </div>
      </div>
    </popup>
  </div>
</template>
<script type="text/javascript" scoped>
import sidebar from 'components/sidebar/sidebar'
import { mapGetters, mapMutations } from 'vuex'
import interlayer from 'base/interlayer/interlayer'
import popup from 'base/popup/popup'
import { addOrder } from 'api/header'
import { testToken } from 'common/js/util'
import QrcodeVue from 'qrcode.vue'
import { getUserInfo, getScoreRate } from 'api/index'

export default {
  data() {
    return {
      money: 0,
      sidebar: false,
      popup: false,
      payUrl: false,
      size: 120,
      code: false
    }
  },
  created() {
    this.$root.eventHub.$on('user', () => {
      // console.log('更新用户')
      this._updataUser()
    })
    this._getScoreRate()
  },
  computed: {
    ...mapGetters([
      'user',
      'token',
      'scorerate'
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
    _updataUser() {
      if (!this.checkTock()) {
        return false
      }
      getUserInfo(this.token).then((res) => {
        if (res.data.err_code === 0) {
          this.setUser(res.data.data)
          // this.$root.eventHub.$emit('user')
        } else {
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
    _addOrder() {
      if (!isNaN(this.money)) {
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
          this._hiddenSidebar()
          return false
        }
        console.log(this.scorerate)
        if (!this.scorerate) {
          this._getScoreRate()
          this.$message({
            showClose: true,
            message: '网络错误',
            type: 'warning'
          })
          this._hiddenSidebar()
          return
        }
        if (this.money < 0.01) {
          this.$message({
            showClose: true,
            message: '最小充值0.01元',
            type: 'warning'
          })
          return
        }
        addOrder(this.token, this.scorerate * this.money, 'wx', this.money).then((res) => {
          console.log(res.data.data.pay_url)
          if (res.data.err_code === 0) {
            // new QRCode(document.getElementById("qrcode"), res.data.data.pay_url)
            this.code = res.data.data.code
            this.payUrl = res.data.data.pay_url
          } else {
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
      } else {
        this.$message({
          showClose: true,
          message: '请输入数字',
          type: 'error'
        })
      }
    },
    _sureCompletionPayment() {
      this._hiddenSidebar()
      this.$root.eventHub.$emit('user')
      this.$root.eventHub.$emit('updateScoreRecord')
      this.$router.replace({
        path: '/score-record'
      })
    },
    _getScoreRate(that) {
      getScoreRate().then((res) => {
        if (res.data.err_code === 0) {
          this.setScorerate(res.data.data[0].value)
        } else {
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
    _logout(e) {
      e.stopPropagation()
      this.setUser(false)
      this.setToken(false)
      localStorage['tokenTime'] = false
      this.$message({
        showClose: true,
        message: '已注销',
        type: 'success'
      })
      this.$router.replace({
        path: '/login'
      })
    },
    _buy() {
      console.log('buy')
    },
    _showSidebar() {
      this.sidebar = true
      this.$nextTick(() => {
        this.$refs.sidebar._showSidebar()
        this.$refs.interlayer._setZIndex(1500)
        this.$refs.interlayer._showLayer()
      })
    },
    _showPopup(e) {
      e.stopPropagation()
      this.$nextTick(() => {
        this.popup = true
        this.$refs.popup._showPopup()
        this.$refs.interlayer._setZIndex(9999)
        this.$refs.interlayer._showLayer()
      })
    },
    _hiddenSidebar() {
      console.log('11')
      this.payUrl = false
      if (this.sidebar && !this.popup) {
        this.sidebar = false
        this.$refs.sidebar._hiddenSidebar()
        this.$refs.interlayer._hiddenLayer()
      }
      if (this.popup && !this.sidebar) {
        this.popup = false
        this.$refs.popup._hiddenPopup()
        this.$refs.interlayer._hiddenLayer()
      }
      if (this.popup && this.sidebar) {
        this.popup = false
        this.$refs.popup._hiddenPopup()
        this.$refs.interlayer._setZIndex(1500)
      }
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath)
      if (key.indexOf('/none') > -1) {
        return false
      }
      this.$router.replace({
        path: key
      })
      if (this.sidebar) {
        this._hiddenSidebar()
      }
    },
    ...mapMutations({
      setToken: 'SET_TOKEN',
      setUser: 'SET_USER',
      setScorerate: 'SET_SCORERATE'
    })
  },
  components: {
    sidebar,
    interlayer,
    popup,
    QrcodeVue
  }
}

</script>
<style type="text/css" scoped>
.input-defult:hover {
  animation: gradientIndex .5s ease 1 forwards;
}

@keyframes gradientIndex {
  0% {
    border-bottom: 1px solid rgba(0, 0, 0, .1);
  }
  100% {
    border-bottom: 1px solid #ff9430;
  }
}

.iconfont {
  font-size: 20px;
  margin: 0 10px 0 0;
}

.header {
  height: auto;
  min-height: 65px;
  width: 100%;
  flex-wrap: wrap;
  background: #fff;
  box-shadow: 0px 1px 10px rgba(0, 0, 0, .1);
  overflow: hidden;
}

.phone-nav {
  width: 50px;
  height: 65px;
  flex-shrink: 0;
}

.pc-nav {
  height: 65px;
  flex-grow: 1;
  min-width: 30%;
  max-width: 100%;
  flex-shrink: 0;
}

.logo {
  height: 65px;
  max-width: 100%;
  min-width: 240px;
  flex-shrink: 0;
  flex-grow: 1;
}

.phone-item {
  color: #777 !important;
  font-size: 13px;
}

.phone-item:hover {
  color: #777 !important;
}

.icon-jifen {
  color: #777 !important;
}

.disable {
  cursor: default;
  pointer-events: none;
}

.iconfont {
  color: #000;
}

.log-out {
  display: inline-block;
  height: 100%;
  width: 100%;
  line-height: 55px;
  pointer-events: auto;
  cursor: pointer;
}

.green-text {
  display: inline-block;
  font-size: 15px;
  color: #4CAF50;
  margin: -5px 10px 0;
}

.recharge-box {
  width: 100%;
  height: 100%;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-content: center;
  position: relative;
}

.input-defult {
  width: 90%;
  height: 45px;
  margin: 10px auto;
  border-bottom: 1px solid rgba(0, 0, 0, .1);
}

.recharge-box-title {
  justify-content: flex-start;
  width: 100%;
  height: 22%;
  margin: 0 auto;
  font-size: 18px;
  font-weight: 600;
  color: #666;
  text-indent: 5%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  border-bottom: 1px solid rgba(0, 0, 0, .1);
}

.content-qr {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 77%;
  flex-wrap: wrap;
}

.net-item {
  width: 40%;
  height: 40px;
  background: #eee;
  color: #333;
  margin: 20px 5% 0;
  border: 1px solid rgba(0, 0, 0, .1);
}

.net-item:hover {
  cursor: pointer;
  /* color: #ff9430;*/
}

.recharge-btn-box {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 70px;
  justify-content: flex-end;
}

.recharge-btn-sure {
  width: 70px;
  height: 40px;
  border-radius: 10px;
  color: #343434;
  margin: 0 10px;
}

.recharge-btn-sure:hover {
  background: #eee;
  color: #ff9430;
  cursor: pointer;
}

.min-tips-text {
  width: 100%;
  height: 20px;
  text-indent: 30px;
  font-size: 13px;
  color: #999;
  justify-content: flex-start;
}

.course-btn {
  color: #42A5F5;
  text-indent: 0px;
}

.code-div {
  width: 100%;
  height: 40px;
}

.showWX {
  background-color: #E8F8FF;
  border: 1px solid #D9F3FF;
  border-radius: 20px;
  color: #55C2F5;
  padding: 10px;
  height: 10px;
  min-width: 120px;
  margin: 10px 0;
}

.sureBtn {
  /*background-color: #BCEE68;*/
  border: 1px solid #ff9430;
  border-radius: 20px;
  color: #ff9430;
  padding: 10px;
  height: 10px;
  min-width: 120px;
  margin-bottom: 10px;
}

.sureBtn:hover {
  background: #ff9430;
  color: #fff;
  cursor: pointer;
}

.qrcode-box {
  width: 100%;
  flex-shrink: 0;
  height: auto;
}

.logo-class {
  width: 155px;
  height: 47px;
  /*  margin-left: -50px;*/
}

.pay-img {
  width: 144px;
  height: 44px;
  margin: 0 30px;
}

</style>
