<template>
  <div id="main-body" ref='mainbody'>
    <div class="main-box" id="main-box">
      <!--  右侧边栏start -->
      <div class="notice">
        <div class="notice-heder flex">
          <div class="mg-btn flex dengji-warp">代理等级: {{proxyRank}}
            <img :src="proxyIcon" v-if="proxyIcon" class="proxy-icon">
          </div>
        </div>
        <div class="notice-item flex">
          <div class="notice-item-left flex ellipsis">我的账户</div>
          <div class="notice-item-right flex" v-if="user">{{user.phone}}</div>
        </div>
        <div class="notice-item flex">
          <div class="notice-item-left flex ellipsis">我的余额</div>
          <div class="notice-item-right flex" v-if="user">{{user.score}}</div>
        </div>
        <div class="notice-item flex" v-if="siteInfo">
          <div class="notice-item-left flex ellipsis">分站营业额</div>
          <div class="notice-item-right flex">{{user.agency.balance}}</div>
        </div>
        <div class="mg-btn flex cursor notice-heder-btn" @click="_back">分站管理</div>
      </div>
      <!--  右侧边栏end -->
      <div class="configure-box flex">
        <div class="configure-box-item flex">
          <div class="cbi-name flex ellipsis">我的提现账户:</div>
          <div class="cbi-input-box flex disable-i">
            去绑定
          </div>
          <div class="cbi-btn flex cursor" @click="showPop">去绑定</div>
        </div>
        <div class="configure-box-item flex">
          <div class="cbi-name flex ellipsis">体现方式:</div>
          <div class="cbi-input-box flex disable-i">
            <!-- {{user.agency.balance}} -->
            支付宝
          </div>
          <div class="cbi-btn flex cursor" style="opacity:0;"></div>
        </div>
        <div class="configure-box-item flex">
          <div class="cbi-name flex ellipsis">营业余额:</div>
          <div class="cbi-input-box flex disable-i">
            {{user.agency.balance}}
          </div>
          <div class="cbi-btn flex cursor" style="opacity:0;"></div>
        </div>
        <div class="configure-box-item flex">
          <div class="cbi-name flex ellipsis">提现金额:</div>
          <div class="cbi-input-box flex disable-i">
            <input type="text" class="edit-input">
            <!-- {{siteInfo.sum_income}} -->
            <div class="poundage flex" v-if="min_amount">注: 单笔最低提现金额为{{min_amount}}起，提现手续费为{{rate}}</div>
          </div>
          <div class="cbi-btn flex cursor">确认提现</div>
        </div>
      </div>
      <div class="goods-table">
        <el-table :data="wdList" style="width: 100%" v-loading="loading" :row-class-name="tableRowClassName">
          <el-table-column prop="id" label="ID">
          </el-table-column>
          <el-table-column prop="money" label="提现金额">
          </el-table-column>
          <el-table-column prop="withdraw_account.account_type" label="提现方式">
          </el-table-column>
          <el-table-column prop="withdraw_account.account" label="提现帐号">
          </el-table-column>
          <el-table-column prop="withdraw_account.name" label="账户姓名">
          </el-table-column>
          <el-table-column prop="status" label="状态">
          </el-table-column>
          <el-table-column prop="create" label="申请时间">
          </el-table-column>
        </el-table>
      </div>
    </div>
    <popup ref="popup">
      <div class="recharge-box-title-agent flex">绑定提现账户</div>
      <div class="agreement-content overHiden">
        <div class="flex agree-input-box">
          <div class="aib-label flex ellipsis">体现账户：</div>
          <div class="flex aib-input-warp">
            <!-- <span v-if="nowRow">{{nowRow.price}}</span> --> <!-- v-model="" -->
            <input type="text" placeholder="输入账户" class="aib-ipnput">
          </div>
        </div>
        <div class="flex agree-input-box">
          <div class="aib-label flex ellipsis">账户姓名：</div>
          <div class="flex aib-input-warp">
            <!-- <span v-if="nowRow">{{nowRow.price}}</span> --> <!-- v-model="" -->
            <input type="text" placeholder="输入姓名" class="aib-ipnput">
          </div>
        </div>
        <div class="flex agree-input-box">
          <div class="aib-label flex ellipsis">账户手机：</div>
          <div class="flex aib-input-warp">
            <span class="disable-phone">{{user.phone}}</span> <!-- v-model="" -->
            <!-- <input type="text" placeholder="输入姓名" class="aib-ipnput"> -->
          </div>
        </div>
        <div class="flex agree-input-box">
          <div class="aib-label flex ellipsis">手机验证：</div>
          <div class="flex aib-input-warp">
            <input type="text" placeholder="输入验证码" class="aib-ipnput">
          </div>
        </div>
        <div class="recharge-btn-box flex">
          <div class="recharge-btn-sure flex sure cursor" @click="">确认</div>
          <div class="recharge-btn-sure flex cancel cursor" @click='_interlayerHide'>取消</div>
        </div>
      </div>
    </popup>
    <interlayer ref="interlayer"></interlayer>
  </div>
</template>
<script type="text/javascript">
import { getSiteinfo, getPoundageConfig, getWithdrawlist, withdraw } from 'api/site'
import { mapGetters, mapMutations } from 'vuex'
import { testToken } from 'common/js/util'
import { SUCCESS_CODE } from 'api/config'
import popup from 'base/popup/popup'
import interlayer from 'base/interlayer/interlayer'
export default {
  data() {
    return {
      siteInfo: false,
      min_amount: false,
      rate: false,
      wdList: [],
      rank: ['青铜代理', '白银代理', '黄金代理', '王者代理'],
      iconList: ['http://p70pqu6ys.bkt.clouddn.com/%E7%AD%89%E8%AE%B01.png', 'http://p70pqu6ys.bkt.clouddn.com/%E7%AD%89%E7%BA%A72.png', 'http://p70pqu6ys.bkt.clouddn.com/%E7%AD%89%E7%BA%A73@2x.png']
    }
  },
  created() {
    this.$root.eventHub.$emit('user')
    this._siteInit()
  },
  computed: {
    proxyRank() {
      if (this.user && this.user.agency && this.user.agency.level > 0) {
        return this.rank[this.user.agency.level - 1]
      } else {
        return '普通用户'
      }
    },
    proxyIcon() {
      if (this.user && this.user.agency && this.user.agency.level > 0) {
        return this.iconList[this.user.agency.level - 1]
      } else {
        return false
      }
    },
    siteLogo() {
      // console.log(this.user.agency.sub_site.icon)
      return `background: url(${this.user.agency.sub_site.icon || require('../../assets/logo.png')}) no-repeat; background-size: contain;`
    },
    //   background: url('http://p70pqu6ys.bkt.clouddn.com/bg.jpg') no-repeat;
    // background-size: cover;
    ...mapGetters([
      'user',
      'token',
      'tokenTime',
      'app'
    ])
  },
  methods: {
    _interlayerHide() {
      this.$refs.popup._hiddenPopup()
      this.$refs.interlayer._setZIndex(-1000)
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
    _siteInit() {
      if (!this.user.agency || !this.user.agency.sub_site) {
        this.$parent._open('请先创建分站')
        this.$router.replace({
          path: '/agent'
        })
        return false
      }
      if (!this.checkTock()) {
        return false
      }
      this._getSiteinfo()
      this._getPoundageConfig()
      this._getWithdrawlist()
    },
    _getWithdrawlist() {
      getWithdrawlist(this.token).then((res) => {
        if (res.data.err_code === SUCCESS_CODE) {
          console.log(res.data.data)
          this.wdList = res.data.data
        } else {
          if (res.data.err_msg) {
            this.$parent._open(this.$root.errorCode[res.data.err_code])
          } else {
            this.$parent._open('似乎出错了')
          }
        }

      })
    },
    _getPoundageConfig() {
      getPoundageConfig().then((res) => {
        if (res.data.err_code === SUCCESS_CODE && res.data.data[0].value) {
          console.log(res.data.data[0].value)
          const reflectInfo = JSON.parse(res.data.data[0].value)
          this.min_amount = reflectInfo.min_amount
          this.rate = reflectInfo.rate
          console.log(reflectInfo)
        } else {
          if (res.data.err_msg) {
            this.$parent._open(this.$root.errorCode[res.data.err_code])
          } else {
            this.$parent._open('似乎出错了')
          }
        }
      })
    },
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
    }
  },
  components: {
    popup,
    interlayer
  },
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
  /* max-height: 50%;*/
  width: 42%;
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

.notice-heder {
  height: 100px;
  border-bottom: 1px solid #ddd;
}

.notice-item {
  height: 45px;
  width: 100%;
}

.notice-item-left {
  width: 25%;
  justify-content: flex-start;
  text-indent: 10px;
}

.notice-item-right {
  justify-content: flex-end;
  padding-right: 5%;
  width: 70%;
}

.dengji-warp {
  width: 90%;
}

.notice-heder-btn {
  width: 80%;
  margin: 10px auto;
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
}

.cr-box-btn {
  width: 100px;
  margin-right: 20px;
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

.cbi-btn {
  width: 10%;
  height: 50%;
  background: #FFD236;
  color: #353535;
  border-radius: 5px;
  min-width: 70px;
}

.edit-input {
  border: none;
  outline: none;
  background: #f4f4f4;
  width: 98%;
  height: 100%;
  margin: 0 1%;
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
  margin: 20px 1% 0;
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
.aib-label{
  height: 100%;
  width: 20%;
}
.aib-input-warp{
  height: 70%;
  width: 72%;
  padding: 0 4%;
  background: #f4f4f4;
  border: 1px solid #eee;
  border-radius: 5px;
  justify-content: flex-start;
}
.aib-ipnput{
  width: 100%;
  height: 100%;
  outline: none;
  border: none;
  background: #f4f4f4;
  font-size: 15px;
}
.recharge-btn-box {
  height: 70px;
  justify-content: flex-start;
}
.recharge-btn-sure {
  width: 35%;
  height: 46px;
  border-radius: 6px;
}

.recharge-btn-sure:nth-child(1) {
  margin: 0 20% 0 5%;
}
.cancel {
  box-sizing: border-box;
  color: #fff;
  background: rgba(166,166,166,1);
}

.sure {
  box-sizing: border-box;
  color: #353535;
  background: #FFD236;
  /* box-shadow: 2px 0px 8px rgba(157, 106, 95, 1);*/
}
.disable-phone{
  color: #666;
}
</style>
