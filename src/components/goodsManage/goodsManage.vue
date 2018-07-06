<template>
  <div id="main-body" ref='mainbody'>
    <div class="main-box" id="main-box" v-if="user">
      <!--  右侧边栏start -->
      <m-agent></m-agent>
      <!--  右侧边栏end -->
      <div class="configure-box flex">
        <div class="chose-box-top flex">
          <el-select v-model="chose" placeholder="请选择" no-data-text="暂无商品">
            <el-option v-for="item in choseItem" :key="item.choseTitle" :label="item.choseTitle" :value="item.id">
            </el-option>
          </el-select>
          <div class="good-btn flex cursor margin20" @click="_chose">查询</div>
        </div>
        <div class="goods-table">
          <el-table :data="agencyService" style="width: 100%" v-loading="loading" :row-class-name="tableRowClassName">
            <el-table-column prop="label" label="商品类型">
            </el-table-column>
            <el-table-column prop="origin_price" label="成本">
            </el-table-column>
            <el-table-column prop="price" label="销售金额">
            </el-table-column>
            <el-table-column label="是否上架">
              <template slot-scope="scope">
                <!--  <el-button @click="_viewLink(scope.row)" type="text" size="small" v-if="scope.row.showLink">查看链接</el-button> -->
                <div class="chose_status cursor" v-show="scope.row.status === 2" @click="_setAgency(scope.row)"></div>
                <div class="chose_status chose_status-sj cursor" v-show="scope.row.status === 1" @click="_setAgency(scope.row)"></div>
              </template>
            </el-table-column>
            <el-table-column label="">
              <template slot-scope="scope">
                <!--  <el-button @click="_viewLink(scope.row)" type="text" size="small" v-if="scope.row.showLink">查看链接</el-button> -->
                <div class="good-btn flex cursor" @click="showPop(scope.row)">调整价格</div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <popup ref="popup">
      <div class="recharge-box-title-agent flex">价格调整</div>
      <div class="agreement-content overHiden">
        <div class="flex agree-input-box">
          <div class="aib-label flex ellipsis">商品名称：</div>
          <div class="flex aib-input-warp">
            <span v-if="nowRow">{{nowRow.label}}</span>
            <!-- <input type="text" placeholder="请填写公司简称" class="i-ipnput" v-model="companyName"> -->
          </div>
        </div>
        <div class="flex agree-input-box">
          <div class="aib-label flex ellipsis">成本价：</div>
          <div class="flex aib-input-warp">
            <span v-if="nowRow">{{nowRow.origin_price}}</span>
          </div>
        </div>
        <div class="flex agree-input-box">
          <div class="aib-label flex ellipsis">销售价格：</div>
          <div class="flex aib-input-warp">
            <!-- <span v-if="nowRow">{{nowRow.price}}</span> -->
            <input type="text" placeholder="请填写销售价格" class="aib-ipnput" @keyup="_rectifyMoney" v-model="money" ref='aibinput'>
          </div>
          <div class="tishi">注：销售定价不可低于成本价</div>
        </div>
        <div class="flex agree-input-box">
          <div class="aib-label flex ellipsis">是否上架：</div>
          <div class="flex aib-input-warp cursor" v-if='nowRow' @click="_chekStaus">
            <span v-if="nowRow" class="abi-span">{{nowStatus}}</span>
            <i class="el-icon-d-caret aib-icon"></i>
            <div class="chose-box flex" v-show="showStatusValue" @click="_newChekStaus">{{nowStatusN}}</div>
          </div>
        </div>
        <div class="flex agree-input-box">
          <!-- <div class="aib-label flex ellipsis"></div> -->
          <div class="flex recharge-btn-box">
            <div class="recharge-btn-sure flex sure cursor" @click="_setAgencySure">确认</div>
            <div class="recharge-btn-sure flex cancel cursor" @click='_interlayerHide'>取消</div>
          </div>
        </div>
      </div>
    </popup>
    <interlayer ref="interlayer"></interlayer>
  </div>
</template>
<script type="text/javascript">
  import { getSiteinfo, getAgencyservice, setAgency } from 'api/site'
  import { mapGetters, mapMutations } from 'vuex'
  import { testToken } from 'common/js/util'
  import { SUCCESS_CODE } from 'api/config'
  import popup from 'base/popup/popup'
  import interlayer from 'base/interlayer/interlayer'
   import MAgent from 'components/agent-banner/agent-banner'
  export default {
    data() {
      return {
        siteInfo: false,
        agencyService: [],
        choseItem: [],
        money: '',
        chose: '全部商品',
        nowRow: null,
        fastclike: null,
        timeChose:null,
        showStatusValue: false,
        statusList:[{
          title:'是',
          value: 1
        },{
          title:'否',
          value: 2
        }],
        nowStatusValue: null
      }
    },
    created() {
      this.$root.eventHub.$emit('user')
    // this.$root.eventHub.$emit('siteInit')
    this.$root.eventHub.$on('siteInit', () => {
      this._siteInit()
    })
    this._siteInit()
    this._orderInt()
  },
  computed: {
    nowStatus(){
      if (!this.nowStatusValue) {
        this.nowStatusValue = this.nowRow.status
      }
      return this.nowStatusValue === 1 ? '是' : '否'
    },
    nowStatusN(){
      if (!this.nowStatusValue) {
        this.nowStatusValue = this.nowRow.status
      }
      return this.nowStatusValue === 1 ? '否' : '是'
    },
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
    _chose() {
      if (this.timeChose) {
        this.$parent._open('请勿频繁筛选')
        return false
      }
      if (!this.chose) {
        this.$parent._open('请选择一个类别筛选')
        return false
      }
      if (this.chose < 0 || isNaN(this.chose)) {
        this._reset()
        return false
      }
      this._getAgencyservice(false, this.chose)
      const that = this
      this.timeChose = setTimeout(() => {
        clearTimeout(that.timeChose)
        that.timeChose = false
      }, 1200)
    },
    _reset() {
      this.chose = '全部商品'
      this._getAgencyservice()
    },
    _chekStaus() {
      // if (this.nowStatusValue === 1) {
      //   this.nowStatusValue = 2
      // } else {
      //   this.nowStatusValue = 1
      // }
      this.showStatusValue = !this.showStatusValue
    },
    _newChekStaus() {
      if (this.nowStatusValue === 1) {
        this.nowStatusValue = 2
      } else {
        this.nowStatusValue = 1
      }
    },
    _setAgencySure() {
      this._chekStaus()
      if (!this.money || this.money < this.nowRow.origin_price) {
        this.$parent._open('销售价需大于成本价')
        return false
      }
      if (!this.checkTock()) {
        return false
      }
      const that = this
      setAgency(this.token, this.nowRow.id, this.money, this.nowStatusValue).then((res) => {
        if (res.data.err_code === SUCCESS_CODE && res.data) {
          let chose
          if (this.chose < 0 || isNaN(this.chose)) {
            chose = false
          } else {
            chose = this.chose
          }
          that._getAgencyservice(false, chose)
          that._interlayerHide()
        }  else {
          if (res.data.err_msg) {
            this.$parent._open(this.$root.errorCode[res.data.err_code])
          } else {
            this.$parent._open('似乎出错了')
          }
        }
      })
    },
    _setAgency(e) {
      if (!this.checkTock()) {
        return false
      }
      if (this.fastclike) {
        this.$parent._open('请勿频繁设置')
        return false
      }
      let status
      const that = this
      if (e.status === 1) {
        status = 2
      } else {
        status = 1
      }
      setAgency(this.token, e.id, e.price, status).then((res) => {
        if (res.data.err_code === SUCCESS_CODE && res.data) {
          let chose
          if (this.chose < 0 || isNaN(this.chose)) {
            chose = false
          } else {
            chose = this.chose
          }
          that._getAgencyservice(false, chose)
          that.fastclike = true
          that.time = setTimeout(() => {
            that.fastclike = false
            clearTimeout(that.time)
          }, 300)
        } else {
          if (res.data.err_msg) {
            this.$parent._open(this.$root.errorCode[res.data.err_code])
          } else {
            this.$parent._open('似乎出错了')
          }
        }
      })
    },
    _interlayerHide() {
      this._chekStaus()
      this.$refs.popup._hiddenPopup()
      this.$refs.interlayer._hiddenLayer()
    },
    _toReflect() {
      this.$root.eventHub.$emit('reflectInit')
      this.$router.replace({
        path: '/reflect'
      })
    },
    _rectifyMoney() {
      if (isNaN(this.money)) {
        this.money = ''
      }
      if (this.money.indexOf('.') > -1) {
        const end = this.money.indexOf('.')
        this.money = this.money.slice(0, end + 3)
      }
    },
    showPop(e) {
      // console.log(e)
      this.nowStatusValue = null
      this.nowRow = e
      this.money = e.price
      this.$refs.popup._showPopup()
      this.$refs.interlayer._setZIndex(9999)
      this.$refs.interlayer._showLayer()
      this.$nextTick(() => {
        if (this.$refs.aibinput) {
          this.$refs.aibinput.focus()
        }
      })
    },
    _orderInt() {
      this.choseItem = this.app.service_categories.concat([])
      this.choseItem.forEach((item) => {
        item.choseTitle = item.label
      })
      this.choseItem.unshift({
        choseTitle: '全部商品',
        id: -1
      })
    },
    _back() {
      this.$router.replace({
        path: '/management'
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
      this._getSiteinfo()
      this._getAgencyservice()
    },
    _getAgencyservice(status, id) {
      if (!this.checkTock()) {
        return false
      }
      getAgencyservice(this.token, status, id).then((res) => {
        if (res.data.err_code === SUCCESS_CODE) {
          this.agencyService = res.data.data || []
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
      if (!this.checkTock()) {
        return false
      }
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
    interlayer,
    MAgent
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
  /* max-height: 50%;*/
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
  font-size: 16px;
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
  flex-wrap: wrap;
  align-items: flex-start;
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

.good-btn {
  width: 80px;
  height: 40px;
  border-radius: 5px;
  background: #FFD236;
  color: #353535;
}

.goods-table {
  width: 96%;
  padding: 2%;
  height: auto;
}

.chose-box-top {
  width: 100%;
  height: 100px;
  justify-content: flex-start;
}

.margin20 {
  margin: 0 20px;
}

.chose_status {
  box-sizing: border-box;
  width: 15px;
  height: 15px;
  border: 1px solid #999;
  /* margin: 0 auto;*/
  transform: translate(100%, 0);
}

.chose_status-sj {
  border: none;
  width: 17px;
  height: 17px;
  background: url('http://p70pqu6ys.bkt.clouddn.com/%E9%80%89%E4%B8%AD.png') no-repeat;
  background-size: contain;
  transform: translate(80%, 0);
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
  width: 100%;
  height: 50px;
  position: relative;
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
  position: relative;
}
.aib-ipnput{
  width: 100%;
  height: 100%;
  outline: none;
  border: none;
  background: #f4f4f4;
  font-size: 15px;
  color: #666;
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
  background: rgba(166,166,166,1);
}

.sure {
  box-sizing: border-box;
  color: #353535;
  background: #FFD236;
  /* box-shadow: 2px 0px 8px rgba(157, 106, 95, 1);*/
}
.abi-span{
  color: #666;
}
.tishi{
  position: absolute;
  bottom: 5px;
  left: 0;
  right: 0;
  transform: translate(0, 100%);
  text-indent: 22%;
  color: #ff9100;
  font-size: 14px;
}
.aib-icon{
  color: #666;
  position: absolute;
  right: 0;
  top: 50%;
  transform: translate(-50%, -50%);
}
.chose-box{
  width: 90%;
  height: 100%;
  padding: 0 5%;
  border-radius: 5px;
  position: absolute;
  bottom: 0;
  left: 0;
  transform: translate(0, 100%);
  background: #999;
  color: #fff;
  justify-content: flex-start;
  opacity: .6;
  z-index: 99999;
}
</style>
