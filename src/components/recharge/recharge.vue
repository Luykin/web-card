<template>
  <div id="main-body" ref='mainbody'>
    <div class="main-box flex" id="main-box">
      <b-agent></b-agent>
      <div class="recharge-title flex">
        <div class="recharge-title-item flex cursor" @click="_chosePage(1)" :class="{'rti-active' : page === 1 }">在线支付充值</div>
        <div class="recharge-title-item flex cursor" @click="_chosePage(2)" :class="{'rti-active' : page === 2 }">银行汇款充值</div>
      </div>
      <div v-show="!payUrl && page === 1" class="pu-warp">
        <div class="cr-item flex">
          <div class="cr-box-tit ellipsis flex">充值方式:</div>
          <div class="goods-box flex">
            <div v-for="(value, key) in app.payments" @click="_chosePayType(key, value)" :class="{'active-pay-type':activePayType === key, 'disable-pay-type' : !value}" class="cursor flex pay-item ellipsis" v-if='value'>
              <img :src="'http://ozp5yj4ke.bkt.clouddn.com/'+ key + '.png'" class="pay-icon"> {{key === 'wx' ? '微信支付':key === 'qq'?'QQ支付':'支付宝支付'}}
            </div>
          </div>
        </div>
        <div class="goods-boxA flex" v-show="!payUrl  && app && app.goods.length > 0">
          <div v-for="item in app.goods" :class="{'active-good': choseGoodId === item.id && !money}" @click="_choseGood(item)" class="good-item cursor flex">
            <div class="good-item-label flex ellipsis">{{item.label}}</div>
            <div class="good-item-label flex ellipsis">{{'￥'+parseInt(item.price)}}</div>
          </div>
        </div>
        <div class="cr-item flex">
          <div class="cr-box-tit ellipsis flex">充值金额:</div>
          <div class="cr-box-min flex margin-right">
            <input type="text" :placeholder="'请输入充值金额（元）'" class="recharge-input" v-model="money" ref='input' @keyup="_rectifyMoney" @focus='_inputFocus' @blur='_inputBlur' :class="{'inputFocus' : inputFocus}" @keyup.enter="_addOrder" autocomplete='off' autofocus='on'>
          </div>
        </div>
        <div class="min-tips-text flex">最小充值金额为{{Math.ceil(app.min_recharge)}}元。</div>
        <div class="btn-back flex cursor" @click="_addOrder">确认充值</div>
      </div>
      <div class="content-qr flex" v-show="payUrl && page === 1">
        <div class="code-div flex">订单编号:{{code}} 充值金额: <span class="my-money" v-show='!BuyDomainData'>{{money||choseGood.price}}</span><span class="my-money" v-if='BuyDomainData'>{{BuyDomainData.price}}</span>元
        </div>
        <div class="qrcode-box flex">
          <qrcode-vue :value="payUrl" :size="size" level="H"></qrcode-vue>
        </div>
        <div class="showWX flex">请用{{payType}}扫描二维码支付</div>
        <div class="recharge-btn-box-after flex">
          <div class="recharge-btn-sure-after flex sure cursor" @click="_sureCompletionPayment">确定已完成支付</div>
          <div class="recharge-btn-sure-after flex cancel cursor" @click="_cancel">我再考虑考虑</div>
        </div>
      </div>
      <div class="recharge-remittance flex" v-show="page === 2">
        <el-table :data="tableData" style="width: 100%" v-loading="loading" class="recharge-table">
          <el-table-column prop="label" label="汇款类型">
          </el-table-column>
          <el-table-column prop="code" label="收款人帐号">
          </el-table-column>
          <el-table-column prop="name" label="收款人">
          </el-table-column>
          <el-table-column label="">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="_openQQ">汇款成功联系客服</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
import BAgent from 'components/backstage-banner/backstage-banner'
import { mapGetters, mapMutations } from 'vuex'
import { getAppInfo } from 'api/index'
import { SUCCESS_CODE } from 'api/config'
import { testToken } from 'common/js/util'
import { addOrder } from 'api/header'
import QrcodeVue from 'qrcode.vue'
import { getOrders } from 'api/score-record'
export default {
  data() {
    return {
      activePayType: 'wx',
      money: '',
      choseGoodId: -1,
      choseGood: false,
      size: 180,
      code: false,
      payUrl: false,
      page: 1,
      _timeforSPS: null,
      timeforCumt: 0,
      tableData: [
        { label: '中国农业银行', code: '6228480478794701878', name: '张恒' }
      ]
    }
  },
  created() {
    this.$root.eventHub.$on('timeforsps', () => {
      this._clearTimeforSPS()
    })
    this.choseGoodId = this.app.goods[0].id || -1
    this.choseGood = this.app.goods[0]
    this._getAppInfo()
  },
  computed: {
    payType() {
      return this.activePayType === 'wx' ? '微信' : this.activePayType === 'ali' ? '支付宝' : this.activePayType === 'qq' ? '腾讯' : this.activePayType
    },
    ...mapGetters([
      'user',
      'token',
      'tokenTime',
      'app'
    ])
  },
  methods: {
    _getAppInfo(that) {
      getAppInfo().then((res) => {
        if (res.data.err_code === SUCCESS_CODE && res.data.data) {
          if (res.data.data.score_rate) {
            this.setApp(res.data.data)
            this._initNet()
          }
        } else {
          if (res.data.err_msg) {
            this.$parent._open(this.$root.errorCode[res.data.err_code])
          } else {
            this.$parent._open('似乎出错了')
          }
        }
      })
    },
    _initNet() {
      this.choseGoodId = this.app.goods[0].id || -1
      this.choseGood = this.app.goods[0]
    },
    _choseGood(item) {
      this.choseGood = item
      this.choseGoodId = item.id
      this.money = ''
    },
    _openQQ() {
      window.open('http://wpa.qq.com/msgrd?v=3&uin=42428851&site=qq&menu=yes', '_brank')
    },
    _sureCompletionPayment() {
      this.$router.replace({
        path: '/bg-money-record'
      })
      this.$root.eventHub.$emit('user')
      this.$root.eventHub.$emit('updateScoreRecord')
      this.$root.eventHub.$emit('canvas', true)
    },
    _cancel() {
      this.payUrl = false
      this.money = ''
      this._clearTimeforSPS()
    },
    _chosePage(page) {
      this.page = page
    },
    _chosePayType(key, value) {
      if (value && this.activePayType !== key) {
        this.activePayType = key
      }
    },
    _rectifyMoney() {
      if (isNaN(this.money)) {
        this.money = ''
      }
      if (this.choseGoodId && this.money) {
        this.choseGoodId = -1
      }
      if (this.money.indexOf('.') > -1) {
        const end = this.money.indexOf('.')
        this.money = this.money.slice(0, end + 3)
      }
    },
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
    _addOrder() {
      if (!this.activePayType) {
        this.$parent._open('请选择支付方式')
        return
      }
      console.log(this.choseGoodId)
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
            this.$parent._open('登录已失效')
            this.$router.replace({
              path: '/login'
            })
            // this._hiddenSidebar()
            return false
          }
          if (this.money < Math.ceil(this.app.min_recharge)) {
            this.$parent._open(`最小充值${Math.ceil(this.app.min_recharge)}元`)
            return
          }
          if (!this.activePayType) {
            this.$parent._open('请选择支付方式')
            return
          }
          addOrder(this.token, this.money, this.activePayType, this.money).then((res) => {
            this._afterAddOrder(res)
          })
        } else {
          this.$parent._open('请输入数字')
        }
      }
    },
    _afterAddOrder(res) {
      if (res.data.err_code === SUCCESS_CODE) {
        // new QRCode(document.getElementById("qrcode"), res.data.data.pay_url)
        this.code = res.data.data.code
        this.payUrl = res.data.data.pay_url
        this.timeforCumt = 0
        this._timeforSPS = setInterval(() => {
          this.payUrl = false
          this._surePaySuc(this.code)
          this.timeforCumt++
            if (this.timeforCumt >= 70) {
              this._clearTimeforSPS()
            }
        }, 3000)
      } else {
        // this._hiddenSidebar()
        this.money = ''
        if (res.data.err_msg) {
          this.$parent._open(this.$root.errorCode[res.data.err_code])
        } else {
          this.$parent._open('似乎出错了')
        }
      }
    },
    _surePaySuc(code) {
      if (!this._timeforSPS) {
        return false
      } else {
        getOrders(this.token, 11, 0, code).then((res) => {
          if (res.data.err_code === SUCCESS_CODE) {
            if (res.data.data.data[0] && res.data.data.data[0].status == 2) {
              this.$parent._open('支付成功！')
              this._clearTimeforSPS()
              this._sureCompletionPayment()
            }
          }
        })
      }
    },
    _clearTimeforSPS() {
      clearInterval(this._timeforSPS)
      this._timeforSPS = null
      this.timeforCumt = 0
    },
    ...mapMutations({
      setToken: 'SET_TOKEN',
      setUser: 'SET_USER',
      setApp: 'SET_APP',
      setTokenTime: 'SET_TOKENTIME'
    })
  },
  components: {
    BAgent,
    QrcodeVue
  },
  beforeDestroy() {
    this._clearTimeforSPS()
  }
}

</script>
<style scoped>
.main-box {
  flex-wrap: wrap;
  align-items: flex-start;
  padding-bottom: 20px;
  justify-content: flex-start;
}

.recharge-title {
  height: 55px;
  width: 100%;
  border-bottom: 2px solid #f4f4f4;
  justify-content: flex-start;
}

.recharge-title-item {
  width: 20%;
  height: 100%;
}

.rti-active {
  background: #ffd236;
}

.pay-item {
  box-sizing: border-box;
  /* max-width: 29.3%;
  width: 29.3%;*/
  width: 120px;
  height: 45px;
  flex-shrink: 0;
  flex-grow: 0;
  /*margin-left: 5%;*/
  margin-top: 5px;
  margin-right: 3%;
  color: #353535;
  font-size: 15px;
  border: 1px solid rgba(0, 0, 0, .2);
  border-radius: 8px;
}

.pay-icon {
  max-width: 30px;
  width: auto;
  max-height: 26px;
  height: auto;
  margin-right: 2%;
  flex-shrink: 1;
}

.goods-box {
  height: auto;
  width: 60%;
  flex-grow: 1;
  overflow: hidden;
  justify-content: flex-start;
  margin: 10px 0;
  flex-wrap: wrap;
}

.goods-boxA {
  height: auto;
  width: 60%;
  flex-grow: 1;
  overflow: hidden;
  justify-content: flex-start;
  margin: 20px 0 0 15%;
  flex-wrap: wrap;
}

.active-pay-type {
  border: 1px solid #FF9100;
  color: #353535;
}

.cr-box-min {
  border: 1px solid #DFDFDF;
  margin: 0 10px 0 0;
  position: relative;
}

.btn-back {
  width: 90px;
  padding: 0 5%;
  height: 45px;
  margin: 10px 0px 0 20px;
  background: #FFD236;
}

.qrcode-box {
  width: 100%;
  flex-shrink: 0;
  height: auto;
}

.showWX {
  background-color: #E8F8FF;
  border: 1px solid #D9F3FF;
  border-radius: 20px;
  color: #55C2F5;
  padding: 10px;
  height: 10px;
  min-width: 120px;
  margin: 10px 0 0;
}

.content-qr {
  width: 100%;
  height: auto;
  margin-top: 20px;
  flex-wrap: wrap;
}

.min-tips-text {
  height: 50px;
  width: 100%;
  color: #FF9100;
  justify-content: flex-start;
  text-indent: 25px;
}

.recharge-input {
  border: none;
  outline: none;
  width: 100%;
  height: 100%;
  background: #f4f4f4;
  text-indent: 10px;
}

.pu-warp {
  width: 100%;
}

.recharge-btn-box-after {
  width: 100%;
  height: 70px;
}

.recharge-btn-sure-after {
  width: 160px;
  height: 40px;
  margin: 0 5%;
}

.cancel {
  box-sizing: border-box;
  color: #353535;
  background: rgba(223, 225, 229, 1);
}

.sure {
  box-sizing: border-box;
  color: #353535;
  background: #ffd236;
}

.recharge-remittance {
  width: 100%;
  height: auto;
  flex-wrap: wrap;
}

.recharge-table {
  margin-top: 20px;
}

.code-div {
  width: 100%;
  height: 40px;
}

.my-money {
  color: #d94d37;
  text-indent: 0px;
}

.good-item {
  box-sizing: border-box;
  min-width: 75px;
  max-width: 28.33%;
  width: 75px;
  height: 75px;
  flex-shrink: 0;
  flex-grow: 1;
  background: #FFE8D2;
  color: #D94D37;
  margin: 5px 5% 0 0;
  flex-wrap: wrap;
  align-content: center;
  border-radius: 8px;
}

.good-item-label {
  width: 100%;
  height: 40%;
}

.active-good {
  /*color: red;*/
  color: #fff;
  background: #FF6B4E;
}

</style>
