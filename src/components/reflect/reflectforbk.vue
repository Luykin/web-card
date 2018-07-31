<template>
  <div id="main-body" ref='mainbody'>
    <div class="main-box" id="main-box" v-if="user">
      <b-agent></b-agent>
      <div class="configure-box flex">
        <div class="configure-box-item flex">
          <div class="cbi-name flex ellipsis">我的提现账户:</div>
          <div class="cbi-input-box flex disable-i">
            <span>{{nowAccount ? nowAccount.account :  '去绑定'}}</span>
          </div>
          <div class="cbi-btn flex cursor" @click="showPop" v-show="!nowAccount">去绑定</div>
          <div class="cbi-btn flex cursor" @click="_delete(nowAccount)" v-show="nowAccount">解绑</div>
        </div>
        <div class="configure-box-item flex">
          <div class="cbi-name flex ellipsis">提现方式:</div>
          <div class="cbi-input-box flex disable-i">
            {{nowAccount ? (nowAccount.account_type === 1 ? '支付宝' : nowAccount.account_type === 2 ? '微信' : '银行卡') : '去绑定'}}
          </div>
          <div class="cbi-btn flex cursor" style="opacity:0;"></div>
        </div>
        <div class="configure-box-item flex">
          <div class="cbi-name flex ellipsis">营业余额:</div>
          <div class="cbi-input-box flex disable-i">
            {{user.agency.turnover}}
          </div>
          <div class="cbi-btn flex cursor" style="opacity:0;"></div>
        </div>
        <div class="configure-box-item flex">
          <div class="cbi-name flex ellipsis">提现金额:</div>
          <div class="cbi-input-box flex disable-i">
            <input type="text" class="edit-input" v-model="rmoney" @keyup="_rectifyMoney">
            <div class="poundage flex">注: 单笔最低提现金额{{app.min_withdraw}}元，提现手续费{{app.withdraw_rate * 100}}%(100的整数倍)</div>
          </div>
          <div class="cbi-btn flex cursor" @click="_withdraw">确认提现</div>
        </div>
      </div>
      <div class="show-line"></div>
      <div class="goods-table">
        <el-table :data="wdList" style="width: 100%" v-loading="loading" :row-class-name="tableRowClassName">
          <el-table-column prop="id" label="ID">
          </el-table-column>
          <el-table-column prop="money" label="提现金额">
          </el-table-column>
          <el-table-column prop="WAType" label="提现方式">
          </el-table-column>
          <el-table-column prop="withdraw_account.account" label="提现帐号">
          </el-table-column>
          <el-table-column prop="withdraw_account.name" label="账户姓名">
          </el-table-column>
          <el-table-column prop="statusA" label="状态">
          </el-table-column>
          <el-table-column prop="createA" label="申请时间">
          </el-table-column>
        </el-table>
        <div id="i-page" class="i-page flex" v-show='total'>
          <el-pagination layout="prev, pager, next" :total="total" @current-change="handleCurrentChange" :page-size="page_size">
          </el-pagination>
        </div>
      </div>
    </div>
    <popup ref="popup">
      <div class="recharge-box-title-agent flex">绑定提现账户</div>
      <div class="agreement-content overHiden">
        <div class="flex agree-input-box">
          <div class="aib-label flex ellipsis">提现方式：</div>
          <div class="flex aib-input-warp none-bg">
            <div class="r-i-warp flex cursor" @click="_choseType(1)" :class="wh_type===1?'active-riw':''">
              <img src="http://ozp5yj4ke.bkt.clouddn.com/ali.png" class="riw-img"> 支付宝
            </div>
            <div class="r-i-warp flex cursor" @click="_choseType(2)" :class="wh_type==2?'active-riw':''">
              <img src="http://ozp5yj4ke.bkt.clouddn.com/wx.png" class="riw-img"> 微信
            </div>
            <div class="r-i-warp flex cursor" @click="_choseType(3)" :class="wh_type==3?'active-riw':''">
              <img src="http://p70pqu6ys.bkt.clouddn.com/%E9%93%B6%E8%A1%8C%E5%8D%A1%E5%9B%BE%E6%A0%87.png" class="riw-img"> 银行卡
            </div>
          </div>
        </div>
        <div class="flex agree-input-box">
          <div class="aib-label flex ellipsis">提现账户：</div>
          <div class="flex aib-input-warp">
            <input type="text" placeholder="输入账户" class="aib-ipnput" v-model="raccount">
          </div>
        </div>
        <div class="flex agree-input-box">
          <div class="aib-label flex ellipsis">账户姓名：</div>
          <div class="flex aib-input-warp">
            <input type="text" placeholder="输入姓名" class="aib-ipnput" v-model="rname">
          </div>
        </div>
        <div class="flex agree-input-box">
          <div class="aib-label flex ellipsis">账户手机：</div>
          <div class="flex aib-input-warp">
            <span class="disable-phone">{{user.phone}}</span>
          </div>
        </div>
        <div class="flex agree-input-box">
          <div class="aib-label flex ellipsis">手机验证：</div>
          <div class="flex aib-input-warp min-warp">
            <input type="text" placeholder="输入验证码" class="aib-ipnput" v-model="ryan">
          </div>
          <div class="btn-yan flex ellipsis cursor" @click="_getcode">{{time}}
            <span v-if="time > 0">s后重新获取</span>
          </div>
        </div>
        <div class="flex agree-input-box">
          <div class="recharge-btn-box flex">
            <div class="recharge-btn-sure flex sure cursor" @click="_sureAddAccount">确认</div>
            <div class="recharge-btn-sure flex cancel cursor" @click='_interlayerHide'>取消</div>
          </div>
        </div>
      </div>
    </popup>
    <popup ref="sure">
      <div class="recharge-box-title-agent flex">解绑提现账户</div>
      <div class="agreement-content overHiden">
        <div class="flex agree-input-box">
          <div class="aib-label flex ellipsis">提现账户：</div>
          <div class="flex aib-input-warp">
            <input type="text" class="aib-ipnput" v-model="deletItem.name" disabled="disabled">
          </div>
        </div>
        <div class="flex agree-input-box">
          <div class="aib-label flex ellipsis">账户姓名：</div>
          <div class="flex aib-input-warp">
            <input type="text" class="aib-ipnput" v-model="deletItem.account" disabled="disabled">
          </div>
        </div>
        <div class="flex agree-input-box">
          <div class="aib-label flex ellipsis">账户手机：</div>
          <div class="flex aib-input-warp">
            <span class="disable-phone">{{user.phone}}</span>
          </div>
        </div>
        <div class="flex agree-input-box">
          <div class="aib-label flex ellipsis">手机验证：</div>
          <div class="flex aib-input-warp min-warp">
            <input type="text" placeholder="输入验证码" class="aib-ipnput" v-model="ryan">
          </div>
          <div class="btn-yan flex ellipsis cursor" @click="_getcode">{{time}}
            <span v-if="time > 0">s后重新获取</span>
          </div>
        </div>
        <div class="titps-delet">是否确认解绑此提现账户?</div>
        <div class="flex agree-input-box">
          <div class="recharge-btn-box flex">
            <div class="recharge-btn-sure flex sure cursor" @click="_sureDelet">确认</div>
            <div class="recharge-btn-sure flex cancel cursor" @click='_cancelDelet'>取消</div>
          </div>
        </div>
      </div>
    </popup>
    <interlayer ref="interlayer"></interlayer>
    <el-dialog :title="dialogTitle" :visible.sync="centerDialogVisible" width="30vw" center :show-close="false" top="35vh">
      <div class="dialog-min-text flex">{{dialogText}}</div>
      <div class="dialog-min-btn flex cursor" @click="centerDialogVisible = false">知道了</div>
    </el-dialog>
  </div>
</template>
<script type="text/javascript">
import { getSiteinfo, getPoundageConfig, getWithdrawlist, withdraw, getAccount, addAccount, delAccount } from 'api/site'
import { mapGetters, mapMutations } from 'vuex'
import { testToken, timeChange } from 'common/js/util'
import { SUCCESS_CODE } from 'api/config'
import popup from 'base/popup/popup'
import interlayer from 'base/interlayer/interlayer'
import { sendVerify } from 'api/login'
import BAgent from 'components/backstage-banner/backstage-banner'
export default {
  data() {
    return {
      page_size: 8,
      page: 0,
      siteInfo: false,
      // min_amount: false,
      // rate: false,
      showListAccount: false,
      nowAccount: false,
      raccount: '',
      wh_type: 1,
      rname: '',
      ryan: '',
      rmoney: '0.00',
      dialogTitle: '',
      dialogText: '',
      total: null,
      bgPath: null,
      deletItem: {
        name: '',
        account: ''
      },
      wdList: [],
      accountList: [],
      centerDialogVisible: false,
      time: '获取验证码'
    }
  },
  created() {
    this.$root.eventHub.$emit('user')
    this.$root.eventHub.$on('reflectInit', () => {
      this._reflectInit()
    })
    this._reflectInit()
  },
  computed: {
    siteLogo() {
      return `background: url(${this.user.agency.sub_site.icon || require('../../assets/logo.png')}) no-repeat; background-size: contain;`
    },
    ...mapGetters([
      'user',
      'token',
      'tokenTime',
      'app'
    ])
  },
  methods: {
    _checkRW() {
      this.$router.replace({
        path: '/task'
      })
    },
    _choseType(e) {
      this.wh_type = e
    },
    tableRowClassName(row) {
      if (row.row.status) {
        return ''
      } else {
        return 'sucess-table'
      }
    },
    handleCurrentChange(val) {
      this.page = val - 1
      this._getWithdrawlist(this.page_size, this.page)
    },
    _rectifyMoney() {
      if (isNaN(this.rmoney)) {
        this.rmoney = ''
      }
      if (this.rmoney.indexOf('.') > -1) {
        const end = this.rmoney.indexOf('.')
        this.rmoney = this.rmoney.slice(0, end + 3)
      }
    },
    _withdraw() {
      if (!this.nowAccount) {
        this.$parent._open('请选择提现账户')
        return false
      }
      if (!this.rmoney || this.rmoney <= 0) {
        this.$parent._open('请填写提现金额')
        return false
      }
      if (this.rmoney > parseInt(this.user.agency.turnover)) {
        // console.log(parseInt(this.user.agency.turnover))
        // console.log(this.rmoney)
        console.log(this.rmoney > this.user.agency.turnover)
        this.$parent._open('提现金额应小于营业余额')
        return false
      }
      if (!this.checkTock()) {
        return false
      }
      const that = this
      withdraw(this.token, this.rmoney, this.nowAccount.id).then((res) => {
        if (res.data.err_code === SUCCESS_CODE) {
          // console.log(res.data)
          this.$parent._open('申请提交成功')
          this.dialogTitle = '温馨提示'
          this.dialogText = '申请提现后，我们将在每周二进行统一打款'
          this.centerDialogVisible = true
          this.$root.eventHub.$emit('user')
          this.page = 0
          that._getWithdrawlist(this.page_size, this.page)
        } else {
          if (res.data.err_msg) {
            this.$parent._open(this.$root.errorCode[res.data.err_code])
          } else {
            this.$parent._open('似乎出错了')
          }
        }
      })
    },
    _sureAddAccount() {
      if (!this.raccount) {
        this.$parent._open('请填写账户')
        return false
      }
      if (!this.rname) {
        this.$parent._open('请填写姓名')
        return false
      }
      if (!this.ryan) {
        this.$parent._open('请填写验证码')
        return false
      }
      if (!this.checkTock()) {
        return false
      }
      const that = this
      addAccount(this.token, this.wh_type, this.raccount, this.rname, this.ryan).then((res) => {
        this.ryan = ''
        if (res.data.err_code === SUCCESS_CODE) {
          this.$parent._open('绑定成功')
          that._getAccount()
          that._interlayerHide()
          that.raccount = ''
          that.rname = ''
          // console.log(res.data)
        } else {
          if (res.data.err_msg) {
            this.$parent._open(this.$root.errorCode[res.data.err_code])
          } else {
            this.$parent._open('似乎出错了')
          }
        }
      })
    },
    _getcode() {
      if (typeof this.time === 'string') {
        let lastTime = +new Date() + 60 * 1000
        localStorage.setItem('codeTime', lastTime)
        this._countdown(60)
        this.netSendCode()
      } else {
        this.$parent._open('请稍后再试哦')
      }
    },
    _setTime() {
      let nowTime = +new Date()
      let lastTime = localStorage.getItem('codeTime') || 0
      if (nowTime < lastTime) {
        this._countdown(parseInt((lastTime - nowTime) / 1000))
      }
    },
    _countdown(time) {
      this.time = time
      let timer = setInterval(() => {
        if (this.time > 1) {
          this.time = this.time - 1
        } else {
          this.time = '获取验证码'
          clearInterval(timer)
          timer = null
        }
      }, 1000)
    },
    netSendCode() {
      sendVerify(this.user.phone).then((res) => {
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
    _choseAccount(e) {
      this.nowAccount = e
    },
    _showList() {
      this.showListAccount = !this.showListAccount
    },
    _interlayerHide() {
      this.$refs.popup._hiddenPopup()
      this.$refs.interlayer._hiddenLayer()
    },
    showPop() {
      this.$refs.popup._showPopup()
      this.$refs.interlayer._setZIndex(9999)
      this.$refs.interlayer._showLayer()
    },
    _back() {
      this.$router.replace({
        path: '/management'
      })
    },
    _toGoodsManage() {
      this.$router.replace({
        path: '/goodsManage'
      })
    },
    _reflectInit() {
      // if (!this.user.agency || !this.user.agency.sub_site) {
      //   this.$parent._open('请先创建分站')
      //   this.$router.replace({
      //     path: '/agent'
      //   })
      //   return false
      // }
      if (!this.checkTock()) {
        return false
      }
      this._getSiteinfo()
      // this._getPoundageConfig()
      this._getWithdrawlist(this.page_size, this.page)
      this._getAccount()
      this._setTime()
    },
    _getAccount() {
      getAccount(this.token).then((res) => {
        if (res.data.err_code === SUCCESS_CODE) {
          this.accountList = res.data.data
          if (res.data.data && res.data.data.length > 0) {
            this.nowAccount = res.data.data[0] || false
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
    _getWithdrawlist(num, page) {
      getWithdrawlist(this.token, num, page).then((res) => {
        if (res.data.err_code === SUCCESS_CODE) {
          this.total = res.data.count
          if (res.data.count > 0) {
            this.wdList = this._formatWDlist(res.data.data)
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
    _formatWDlist(list) {
      list.forEach((item) => {
        if (item.status) {
          item.statusA = '已打款'
        } else {
          item.statusA = '打款中'
        }
        item.WAType = '人工提现'
        if (item.withdraw_account.account_type === 1) {
          item.WAType = '支付宝'
        }
        if (item.withdraw_account.account_type === 2) {
          item.WAType = '微信'
        }
        if (item.withdraw_account.account_type === 3) {
          item.WAType = '银行卡'
        }
        item.createA = timeChange(item.create)
      })
      return list
    },
    // _getPoundageConfig() {
    //   getPoundageConfig().then((res) => {
    //     if (res.data.err_code === SUCCESS_CODE && res.data.data[0].value) {
    //       console.log(res.data.data[0].value)
    //       const reflectInfo = JSON.parse(res.data.data[0].value)
    //       this.min_amount = reflectInfo.min_amount
    //       this.rate = reflectInfo.rate
    //       console.log(reflectInfo)
    //     } else {
    //       if (res.data.err_msg) {
    //         this.$parent._open(this.$root.errorCode[res.data.err_code])
    //       } else {
    //         this.$parent._open('似乎出错了')
    //       }
    //     }
    //   })
    // },
    _getSiteinfo() {
      getSiteinfo(this.token).then((res) => {
        if (res.data.err_code === SUCCESS_CODE) {
          // console.log(res.data.data)
          this.siteInfo = res.data.data
        } else {
          if (res.data.err_msg) {
            this.$parent._open(this.$root.errorCode[res.data.err_code])
          } else {
            this.$parent._open('似乎出错了')
          }
        }

      })
    },
    checkTock() {
      if (!this.user) {
        this.$parent._open('请登录')
        this.$router.replace({
          path: '/login'
        })
        return false
      }
      if (!testToken(this.tokenTime)) {
        this.setUser(false)
        this.setToken(false)
        this.setTokenTime(false)
        this.$router.replace({
          path: '/login'
        })
        return false
      }
      return true
    },
    toEdit() {
      this.$root.eventHub.$emit('updataEditInfo')
      this.$router.push({
        path: '/edit'
      })
    },
    _delete(item) {
      this.deletItem = item
      this.$refs.sure._showPopup()
      this.$refs.interlayer._setZIndex(9999)
      this.$refs.interlayer._showLayer()
    },
    _cancelDelet() {
      this.deletItem = {
        name: '',
        account: '',
        id: ''
      }
      this.$refs.sure._hiddenPopup()
      this.$refs.interlayer._hiddenLayer()
    },
    _sureDelet() {
      if (!this.checkTock()) {
        return false
      }
      if (!this.ryan) {
        this.$parent._open('请填写验证码')
        return false
      }
      delAccount(this.token, this.deletItem.id, this.ryan).then((res) => {
        this.ryan = ''
        if (res.data.err_code === SUCCESS_CODE) {
          this.nowAccount = false
          this._getAccount()
          this._cancelDelet()
          this.$parent._open('删除成功')
        } else {
          if (res.data.err_msg) {
            this.$parent._open(this.$root.errorCode[res.data.err_code])
          } else {
            this.$parent._open('似乎出错了')
          }
        }
      })
    }
  },
  components: {
    popup,
    interlayer,
    BAgent
  },
  beforeCreate: function() {
    document.getElementsByTagName("body")[0].className = "add_bg"
  }
}

</script>
<style type="text/css" scoped>
#main-box {
  opacity: 1 !important;
}

.notice {
  position: absolute;
  right: 0;
  top: 0;
  transform: translate(106%, 0);
  min-height: 5%;
  width: 38%;
  background: #fff;
  padding-bottom: 10px;
}

.income-box {
  width: 100%;
  height: 160px;
  margin: 10px auto;
}

.income-box-item {
  width: 18%;
  margin: 3%;
  padding-bottom: 18%;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, .2);
  position: relative;
}

.mg-btn {
  height: 40px;
  min-width: 90px;
  border-radius: 5px;
  background: rgba(255, 210, 54, 1);
  color: #333;
}

.mg-min-btnwidth {
  margin: 0 auto;
  width: 30%;
}

.configure-box {
  width: 98%;
  background: #fff;
  height: auto;
  padding: 10px 1%;
  align-items: flex-start;
  flex-wrap: wrap;
  align-content: flex-start;
  /*  align-items: flex-start;*/
}

.cb-left {
  width: 30%;
  height: 100%;
  align-items: flex-start;
  overflow: hidden;
}

.cb-right {
  width: 70%;
  height: 100%;
  overflow: hidden;
  align-items: flex-start;
}

.partition {
  width: 100%;
  background: #f4f4f4;
  height: 20px;
}

.cb-left-logo {
  width: 85%;
  padding-bottom: 30%;
  background: #f4f4f4;
  margin: 20px auto 0;
}

.cr-item {
  width: 100%;
  margin-top: 20px;
}

.cr-box-min {
  width: 60%;
  flex-grow: 1;
  height: 40px;
  margin: 0 10px;
  border-radius: 5px;
  background: #f4f4f4;
  text-indent: 10px;
  justify-content: flex-start;
  overflow: hidden;
  font-size: 16px;
}

.cr-box-btn {
  width: 100px;
  margin-right: 20px;
  font-size: 16px;
}

.cr-box-max {
  height: 100px;
  margin: 0 10px;
  border-radius: 5px;
  background: #f4f4f4;
  text-indent: 10px;
  justify-content: flex-start;
  flex-grow: 1;
  margin-right: 10px;
  align-items: flex-start;
  line-height: 40px;
  overflow: hidden;
  font-size: 16px;
}

.cr-box-tit {
  width: 15%;
  height: 100%;
}

.position-ibi-content {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  flex-wrap: wrap;
  /*  background: #000;*/
}

.pic-img {
  width: 45%;
  height: 45%;
}

.pic-title {
  width: 100%;
  height: 15%;
}

.proxy-icon {
  max-width: 25px;
  height: auto;
  margin: 0 5px;
}

.configure-box-item {
  width: 100%;
  height: 80px;
}

.cbi-name {
  width: 15%;
  height: 100%;
  justify-content: flex-start;
  min-width: 80px;
  font-size: 16px;
}

.cbi-input-box {
  width: 65%;
  margin: 0 2%;
  height: 50%;
  background: #f4f4f4;
  border-radius: 5px;
  border: 1px solid #eee;
  position: relative;
}

.cbi-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translate(0, -50%);
}

.cbi-show-list {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: auto;
  background: #eee;
  border-radius: 5px;
  transform: translate(0, 100%);
  z-index: 999;
}

.cbi-show-list-item {
  height: 40px;
  width: 100%;
  /* background: rgba(0,0,0,.2);*/
  background: #9BCB14;
  color: #f8f8f8;
  border-bottom: 1px solid #eee;
  border-radius: 5px;
  position: relative;
}

.cbi-show-list-item-icon {
  font-size: 18px;
}

.icon-box {
  width: 60px;
  height: 100%;
  justify-content: center;
  position: absolute;
  right: 0;
  top: 0;
  z-index: 99999;
}

.icon-box:hover .cbi-show-list-item-icon {
  color: red;
}

.cbi-show-list-item:last-child {
  border-bottom: none;
}

.cbi-show-list-item:hover {
  background: #FFD236;
  color: #353535;
}

.cbi-btn {
  width: 12%;
  height: 50%;
  background: #FFD236;
  color: #353535;
  border-radius: 5px;
  min-width: 70px;
  font-size: 16px;
}

.edit-input {
  border: none;
  outline: none;
  background: #f4f4f4;
  width: 98%;
  height: 100%;
  margin: 0 1%;
  text-indent: 20px;
  color: #444;
}

.disable-i {
  justify-content: flex-start;
  color: #999;
  text-indent: 20px;
}

.poundage {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  transform: translate(0, 100%);
  color: #FF9100;
  text-indent: 20px;
  justify-content: flex-start;
}

.goods-table {
  margin: 20px 20px 0;
}

.recharge-box-title-agent {
  width: 100%;
  height: 70px;
  margin: 0 auto;
  font-size: 20px;
  font-weight: 600;
  color: #000;
  background: #FFD236;
}

.agreement-content {
  width: 82%;
  height: auto;
  min-height: 20px;
  /*  max-height: 500px;*/
  margin: 20px auto 20px;
  font-size: 15px;
  line-height: 26px;
  font-weight: normal;
  overflow-y: scroll;
  overflow-x: hidden;
}

.overHiden {
  overflow: hidden;
}

.agree-input-box {
  margin: 0 auto 20px;
  /*margin-bottom: 30px;*/
  width: 100%;
  height: 50px;
  overflow: hidden;
}

.aib-label {
  height: 100%;
  width: 20%;
}

.aib-input-warp {
  height: 70%;
  width: 72%;
  padding: 0 4%;
  background: #f4f4f4;
  border: 1px solid #eee;
  border-radius: 5px;
  justify-content: flex-start;
  flex-shrink: 1;
}

.none-bg {
  width: 80%;
  padding: 0;
  background: #fff;
  border: none;
}

.min-warp {
  width: 45%;
}

.aib-ipnput {
  width: 100%;
  height: 100%;
  outline: none;
  border: none;
  background: #f4f4f4;
  font-size: 15px;
}

.recharge-btn-box {
  width: 100%;
  height: 70px;
  justify-content: flex-start;
}

.recharge-btn-sure {
  width: 35%;
  height: 46px;
  border-radius: 6px;
}

.recharge-btn-sure:nth-child(1) {
  margin: 0 30% 0 0;
}

.cancel {
  box-sizing: border-box;
  color: #fff;
  background: rgba(166, 166, 166, 1);
}

.sure {
  box-sizing: border-box;
  color: #353535;
  background: #FFD236;
  /* box-shadow: 2px 0px 8px rgba(157, 106, 95, 1);*/
}

.disable-phone {
  color: #666;
}

.btn-yan {
  width: 25%;
  height: 70%;
  background: #FFD236;
  color: #353535;
  border-radius: 5px;
  margin-left: 2%;
}

.dialog-min-text {
  width: 100%;
  height: auto;
  line-height: 20px;
  min-height: 20px;
  font-size: 15px;
  color: #999;
}

.dialog-min-btn {
  width: 40%;
  padding: 2% 0;
  border-radius: 5px;
  background: #FFD236;
  color: #000;
  font-size: 15px;
  margin: 5% auto 0;
}

.show-line {
  width: 100%;
  height: 1px;
  background: #ddd;
  margin: 20px auto;
}

.r-i-warp {
  width: 120px;
  height: 100%;
  border: 1px solid rgba(0, 0, 0, .2);
  margin: 0 20px 0 0;
  border-radius: 8px;
}

.riw-img {
  width: auto;
  height: 80%;
  margin: 0 2%;
}

.active-riw {
  /*background: #f4f4f4;*/
  border: 1px solid #FF9100;
}

.dengji-warp {
  font-size: 16px;
}

.titps-delet {
  color: #FF9100;
  height: 20px;
  line-height: 20px;
  margin-bottom: 20px;
  text-indent: 2px;
}

</style>
