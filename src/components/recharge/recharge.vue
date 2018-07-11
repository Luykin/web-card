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
import { SUCCESS_CODE } from 'api/config'
import { testToken } from 'common/js/util'
import { addOrder } from 'api/header'
import QrcodeVue from 'qrcode.vue'
export default {
  data() {
    return {
      activePayType: 'wx',
      money: '',
      choseGoodId: -1,
      choseGood: false,
      size: 180,
      payUrl: false,
      page: 1,
      tableData: [{ label: '支付宝', code: 'zh42429951', name: '张恒' },
        { label: '微信', code: 'zh42429951', name: '张恒' },
        { label: '工商银行', code: '6222021324234234', name: '张恒' }
      ]
    }
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
    _openQQ() {
      window.open('http://wpa.qq.com/msgrd?v=3&uin=42428851&site=qq&menu=yes', '_brank')
    },
    _sureCompletionPayment() {
      this.$router.replace({
        path: '/bg-money-record'
      })
      this.$root.eventHub.$emit('canvas', true)
    },
    _cancel() {
      this.payUrl = false
      this.money = ''
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
    ...mapMutations({
      setToken: 'SET_TOKEN',
      setUser: 'SET_USER',
      setTokenTime: 'SET_TOKENTIME'
    })
  },
  components: {
    BAgent,
    QrcodeVue
  },
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
  margin: 0 10px;
  flex-wrap: wrap;
}

.active-pay-type {
  border: 1px solid #FF9100;
  color: #353535;
}

.cr-box-min {
  border: 1px solid #DFDFDF;
  margin: 0 10px;
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

</style>
