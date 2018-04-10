<template>
  <div>
    <header class="header flex">
      <nav class="phone-nav flex" id="phone-nav" @click="_showSidebar">
        <i class="iconfont icon-gengduo"></i>
      </nav>
      <div class="logo flex">
        <img src="../../assets/logo.png" class="logo-class" @click="_toIndex">
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
              <el-menu-item index="/none" class='phone-item disable' v-show="user">{{user.phone}}</el-menu-item>
              <el-menu-item index="/none" class='phone-item disable' v-show="user">我的积分<span class="green-text">{{user.score}}</span></el-menu-item>
              <el-menu-item index="/modify-password" v-show="user">修改密码</el-menu-item>
              <el-menu-item index="/none" class='disable' v-show="user">
                <div class="log-out-min log-out" @click="_logout($event)">注销</div>
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
                <div class="log-out log-out-min" @click="_logout($event)">注销</div>
              </el-menu-item>
            </el-submenu>
            <el-menu-item index="/login" v-show="!user">
              <i class="iconfont icon-msnui-user"></i> 登录帐号
            </el-menu-item>
          </el-menu>
        </el-col>
      </el-row>
    </sidebar>
    <interlayer ref="interlayer" @close='_interlayerHide'></interlayer>
    <popup ref="popup">
      <div class="recharge-box flex">
        <div class="recharge-box-title flex" v-show="!payUrl">积分充值</div>
        <div class="recharge-box-title flex" v-show="payUrl">微信扫码支付</div>
        <div class="content-qr flex" v-if="payUrl">
          <div class="code-div flex">订单编号:{{code}} 充值金额: {{money||choseGood.price}}元</div>
          <div class="qrcode-box flex">
            <qrcode-vue :value="payUrl" :size="size" level="H"></qrcode-vue>
          </div>
          <div class="showWX flex">请用{{payType}}扫描二维码支付</div>
          <div class="qrcode-box flex">
            <div class="colseBtn flex" @click="_hiddenSidebar">我再考虑考虑</div>
            <div class="sureBtn flex" @click="_sureCompletionPayment">确定已完成支付</div>
            <!-- <div class="colseBtn flex" @click="_hiddenSidebar">我再考虑考虑</div> -->
          </div>
        </div>
        <!-- <div class="net-item flex" v-show="!payUrl">微信支付</div> -->
        <!-- app  支付方式 -->
        <div v-for="(value, key) in app.payments" v-if='value' @click="_chosePayType(key, value)" :class="{'active-pay-type':activePayType === key}" class="cursor">{{key}} : {{value}}</div>
        <!-- app  支付方式  end -->
        <img src="../../assets/weixin.jpg" v-show="!payUrl" class="pay-img">
        <div class="flex input-defult" v-show="!payUrl">
          <!-- onkeyup="value=value.replace(/[^\d]/g,'') " ng-pattern="/[^a-zA-Z]/" -->
          <input type="text" placeholder="请输入充值金额（元）" class="i-ipnput" v-model="money" ref='input' @keyup="_rectifyMoney" @focus='_inputFocus' @blur='_inputBlur' :class="{'inputFocus' : inputFocus}" onkeyup="value=value.replace(/[^\d]/g,'') " ng-pattern="/[^a-zA-Z]/" @keyup.enter="_addOrder">
        </div>
        <div class="min-tips-text flex" v-show="!payUrl&&((money&& money>=Math.ceil(app.min_recharge)) || choseGood)">充值<span class="my-money">{{money|| choseGood.price}}</span>元等于<span class="course-btn">{{Math.ceil(money*scorerate) || choseGood.score}}</span>积分</div>
        <div class="min-tips-text flex" v-show="!payUrl&&(!money || money<Math.ceil(app.min_recharge)) && !choseGood">最小充值金额为<span class="my-money">{{Math.ceil(app.min_recharge)}}</span>元。</div>
        <!-- app  商品 -->
        <div v-for="item in app.goods" :class="{'active-good': choseGoodId === item.id && !money}" @click="_choseGood(item.id)" class="good-item cursor">{{item.label}}</div>
        <!-- app  商品  end -->
        <div class="recharge-btn-box flex" v-show="!payUrl">
          <div class="recharge-btn-sure flex" @click="_addOrder">确认</div>
          <div class="recharge-btn-sure flex" @click='_hiddenSidebar'>取消</div>
        </div>
      </div>
    </popup>
    <centerTips ref='centerTips'>
      <div class="tips-class flex ellipsis">{{centerTips}}</div>
    </centerTips>
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
import { getUserInfo, getAppInfo } from 'api/index'
import { SUCCESS_CODE } from 'api/config'
import centerTips from 'base/centerTips/centerTips'

export default {
  data() {
    return {
      money: '',
      sidebar: false,
      popup: false,
      payUrl: false,
      size: 120,
      code: false,
      centerTips: '',
      choseGoodId: -1,
      inputFocus: true,
      activePayType: 'wx'
    }
  },
  created() {
    this.$root.eventHub.$on('user', () => {
      this._updataUser()
    })
    this.$root.eventHub.$on('showPopup', () => {
      this._showPopup()
    })
    this.$root.eventHub.$emit('canvas')
    this._getAppInfo(this)
  },
  computed: {
    choseGood() {
      if (this.choseGoodId > -1) {
        let ret = false
        for (let i = 0; i < this.app.goods.length; i++) {
          if (this.app.goods[i].id === this.choseGoodId) {
            ret = this.app.goods[i]
            break
          }
        }
        return ret
      } else {
        return false
      }
    },
    payType() {
      return this.activePayType === 'wx' ? '微信' : this.activePayType === 'ali' ? '支付宝' : this.activePayType === 'qq' ? '腾讯' : this.activePayType
    },
    ...mapGetters([
      'user',
      'token',
      'scorerate',
      'tokenTime',
      'app'
    ])
  },
  methods: {
    _inputFocus() {
      if (!this.inputFocus) {
        this.inputFocus = true
      }
    },
    _inputBlur() {
      if (this.inputFocus) {
        this.inputFocus = false
      }
    },
    _chosePayType(key, value) {
      if (value && this.activePayType !== key) {
        this.activePayType = key
      }
    },
    _choseGood(id) {
      this.choseGoodId = id
      this.money = ''
    },
    _rectifyMoney() {
      if (this.choseGoodId && this.money) {
        this.choseGoodId = -1
      }
      if (this.money.indexOf('.') > -1) {
        // console.log('有小数点')
        // console.log(this.money.indexOf('.'))
        const end = this.money.indexOf('.')
        this.money = this.money.slice(0, end + 3)
      }
    },
    // _moneyChange() {
    //   if (this.choseGoodId && this.money) {
    //     this.choseGoodId = -1
    //   }
    // },
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
      if (!testToken(this.tokenTime)) {
        // console.log('登录已失效 checkTock')
        this.setUser(false)
        this.setToken(false)
        this.setTokenTime(false)
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
        if (res.data.err_code === SUCCESS_CODE) {
          this.setUser(res.data.data)
          // this.$root.eventHub.$emit('user')
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
    },
    _addOrder() {
      if (!this.activePayType) {
        this.centerTips = '请选择支付方式'
        this.$refs.centerTips._open()
        return
      }
      if (this.choseGoodId >= 0 && this.choseGood && this.activePayType) {
        addOrder(this.token, this.choseGood.score, this.activePayType, this.choseGood.price, this.choseGood.id).then((res) => {
          this._afterAddOrder(res)
        })
      } else {
        if (!isNaN(this.money)) {
          if (!testToken(this.tokenTime)) {
            this.setUser(false)
            this.setToken(false)
            this.setTokenTime(false)
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
          if (!this.scorerate) {
            this._getAppInfo()
            this.centerTips = '网络错误，请刷新后重试'
            this.$refs.centerTips._open()
            this._hiddenSidebar()
            return
          }
          if (this.money < Math.ceil(this.app.min_recharge)) {
            this.centerTips = `最小充值${Math.ceil(this.app.min_recharge)}元`
            this.$refs.centerTips._open()
            return
          }
          if (!this.activePayType) {
            this.centerTips = '请选择支付方式'
            this.$refs.centerTips._open()
            return
          }
          addOrder(this.token, Math.ceil(this.scorerate * this.money), this.activePayType, this.money).then((res) => {
            this._afterAddOrder(res)
          })
        } else {
          this.$message({
            showClose: true,
            message: '请输入数字',
            type: 'error'
          })
        }
      }
    },
    _afterAddOrder(res) {
      if (res.data.err_code === SUCCESS_CODE) {
        // new QRCode(document.getElementById("qrcode"), res.data.data.pay_url)
        this.code = res.data.data.code
        this.payUrl = res.data.data.pay_url
      } else {
        this._hiddenSidebar()
        this.money = ''
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
    },
    _sureCompletionPayment() {
      this._hiddenSidebar()
      this.$router.replace({
        path: '/score-record'
      })
      this.$root.eventHub.$emit('canvas', true)
    },
    _getAppInfo(that) {
      getAppInfo().then((res) => {
        if (res.data.err_code === SUCCESS_CODE && res.data.data) {
          if (res.data.data.score_rate) {
            this.setScorerate(res.data.data.score_rate)
            this.setApp(res.data.data)
          }
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
    },
    _logout(e) {
      e.stopPropagation()
      this.setUser(false)
      this.setToken(false)
      this.setTokenTime(false)
      this.$message({
        showClose: true,
        message: '已注销',
        type: 'success'
      })
      this.$router.replace({
        path: '/login'
      })
      this.$root.eventHub.$emit('canvas', true)
    },
    _toIndex() {
      this.$root.eventHub.$emit('updateOrder')
      this.$root.eventHub.$emit('user')
      this.$root.eventHub.$emit('updateScoreRecord')
      this.$router.replace({
        path: '/index'
      })
      this.$root.eventHub.$emit('canvas', true)
    },
    _buy() {
      // console.log('buy')
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
      if (e) {
        e.stopPropagation()
      }
      this.$nextTick(() => {
        this.popup = true
        this.$refs.popup._showPopup()
        this.$refs.interlayer._setZIndex(9999)
        this.$refs.interlayer._showLayer()
        this.$refs.input.focus()
      })
    },
    _hiddenSidebar() {
      if (this.payUrl) {
        this.$root.eventHub.$emit('user')
        this.$root.eventHub.$emit('updateScoreRecord')
      }
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
    _interlayerHide() {
      if (this.sidebar && !this.popup) {
        this.sidebar = false
        this.$refs.sidebar._hiddenSidebar()
        this.$refs.interlayer._hiddenLayer()
      }
    },
    handleSelect(key, keyPath) {
      this.$root.eventHub.$emit('canvas')
      if (key.indexOf('/none') > -1) {
        return false
      }
      this.$router.replace({
        path: key
      })
      if (key === '/order') {
        this.$root.eventHub.$emit('updateOrder')
      }
      if (key === '/score-record') {
        this.$root.eventHub.$emit('updateScoreRecord')
      }
      if (this.sidebar) {
        this._hiddenSidebar()
      }
    },
    ...mapMutations({
      setToken: 'SET_TOKEN',
      setUser: 'SET_USER',
      setApp: 'SET_APP',
      setScorerate: 'SET_SCORERATE',
      setTokenTime: 'SET_TOKENTIME'
    })
  },
  components: {
    sidebar,
    interlayer,
    popup,
    QrcodeVue,
    centerTips
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

.log-out-min {
  line-height: 36px;
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
  color: #d94d37;
  cursor: pointer;
}

.min-tips-text {
  width: 100%;
  height: 20px;
  /*text-indent: 30px;*/
  padding-left: 30px;
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
  border: 1px solid #ff9430;
  border-radius: 20px;
  color: #ff9430;
  padding: 10px;
  height: 10px;
  min-width: 120px;
  margin: 0 15px 10px;
}

.colseBtn {
  border: 1px solid #999;
  border-radius: 20px;
  color: #999;
  padding: 10px;
  height: 10px;
  min-width: 120px;
  margin: 0 15px 10px;
}

.colseBtn:hover {
  background: #666;
  color: #fff;
  cursor: pointer;
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

.logo-class:hover {
  cursor: pointer;
}

.pay-img {
  width: 144px;
  height: 44px;
  margin: 0 30px;
}

.my-money {
  color: #d94d37;
  text-indent: 0px;
}

.active-good {
  color: red;
}

.active-pay-type {
  color: red;
}

.good-item {}

.i-ipnput {
  text-indent: 15px;
}

</style>
