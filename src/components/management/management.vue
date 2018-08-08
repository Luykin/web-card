<template>
  <div id="main-body" ref='mainbody'>
    <div class="main-box" id="main-box" v-if="user">
      <m-agent></m-agent>
      <div class="configure-box flex" v-show="!showMingXi">
        <div class="cb-left flex shpc">
          <div class="cb-left-logo" :style="siteLogo"></div>
        </div>
        <div class="cb-right" v-if="user.agency">
          <div class="cr-item flex">
            <div class="cr-box-tit ellipsis flex">分站名称:</div>
            <div class="cr-box-min flex">{{user.agency.sub_site.site_name}}</div>
            <div class="cr-box-btn mg-btn flex cursor" @click="toEdit">分站编辑</div>
          </div>
          <div class="cr-item flex">
            <div class="cr-box-tit ellipsis flex">我的分站:</div>
            <div class="cr-box-min flex">{{user.agency.sub_domain}}</div>
            <div class="cr-box-btn mg-btn flex cursor" @click="_copyDomain">访问分站</div>
          </div>
          <div class="cr-item flex">
            <div class="cr-box-tit ellipsis flex">首页公告:</div>
            <div class="cr-box-max flex">
              <div v-html="user.agency.sub_site.announcement"></div>
            </div>
          </div>
          <div class="cr-item flex">
            <div class="cr-box-tit ellipsis flex">商户联系:</div>
            <div class="cr-box-min flex margin-right">{{user.agency.sub_site.contact}}</div>
          </div>
          <div class="cr-item flex">
            <div class="cr-box-tit ellipsis flex">联系邮箱:</div>
            <div class="cr-box-min flex margin-right">{{user.agency.sub_site.email}}</div>
          </div>
          <!-- ,联系邮箱：{{user.agency.sub_site.email}} -->
        </div>
      </div>
      <div class="partition" v-show="!showMingXi"></div>
      <div class="partition-top" v-show="showMingXi"></div>
      <div class="income-box flex" v-if="siteInfo">
        <div class="income-box-item cursor">
          <div class="position-ibi-content flex">
            <img src="http://p70pqu6ys.bkt.clouddn.com/%E4%BB%8A%E6%97%A5%E6%94%B6%E7%9B%8A.png" class="pic-img">
            <div class="pic-title flex height-light nir-color">{{siteInfo.sum_price_today}}</div>
            <div class="pic-title flex">今日消费</div>
          </div>
        </div>
        <div class="income-box-item cursor">
          <div class="position-ibi-content flex">
            <img src="http://p70pqu6ys.bkt.clouddn.com/%E4%BB%8A%E6%97%A5%E6%B6%88%E8%B4%B9.png" class="pic-img">
            <div class="pic-title flex height-light nir-color">{{siteInfo.sum_income_today}}</div>
            <div class="pic-title flex">今日收入</div>
          </div>
        </div>
        <div class="income-box-item cursor">
          <div class="position-ibi-content flex">
            <img src="http://p70pqu6ys.bkt.clouddn.com/%E7%B4%AF%E7%A7%AF%E6%94%B6%E7%9B%8A.png" class="pic-img">
            <div class="pic-title flex height-light nir-color">{{siteInfo.sum_price}}</div>
            <div class="pic-title flex">总消费</div>
          </div>
        </div>
        <div class="income-box-item cursor">
          <div class="position-ibi-content flex">
            <img src="http://p70pqu6ys.bkt.clouddn.com/%E7%B4%AF%E7%A7%AF%E6%B6%88%E8%B4%B9.png" class="pic-img">
            <div class="pic-title flex height-light nir-color">{{siteInfo.sum_income}}</div>
            <div class="pic-title flex">总收入</div>
          </div>
        </div>
      </div>
      <div class="partition" v-show="showMingXi"></div>
      <div class="goods-table" v-if="showMingXi && MXList">
        <div class="flex input-btn-box">
          <div class="ibb-input-warp">
            <input type="text" name="mxInput" class="aib-ipnput" placeholder="输入ID或订单号查询" v-model="code">
          </div>
          <div class="good-btn flex cursor margin20" @click="_chose(false)">查询</div>
          <div class="good-btn flex cursor margin20" @click="_chose(true)">全部订单</div>
        </div>
        <el-table :data="MXList" style="width: 100%" v-loading="loading" :row-class-name="tableRowClassName">
          <el-table-column prop="id" label="ID">
          </el-table-column>
          <el-table-column prop="code" label="订单号" width='200'>
          </el-table-column>
          <el-table-column prop="price" label="充值金额">
          </el-table-column>
          <el-table-column prop="statusShow" label="状态">
          </el-table-column>
          <el-table-column prop="timeA" label="时间">
          </el-table-column>
        </el-table>
        <div id="i-page" class="i-page flex">
          <el-pagination layout="prev, pager, next" :total="total" @current-change="handleCurrentChange">
          </el-pagination>
        </div>
      </div>
      <!-- <div class="mg-btn flex mg-min-btnwidth cursor" @click="_checkMX" v-show="!showMingXi">查看明细</div> -->
    </div>
  </div>
</template>
<script type="text/javascript">
  import { getSiteinfo, getOrders } from 'api/site'
  import { mapGetters, mapMutations } from 'vuex'
  import { testToken } from 'common/js/util'
  import { SUCCESS_CODE } from 'api/config'
  import { timeChange } from 'common/js/util'
  import  MAgent from 'components/agent-banner/agent-banner'

  export default {
    data() {
      return {
        siteInfo: false,
        showMingXi: false,
        MXList: false,
        page: 0,
        total: 0,
        bgPath: null,
        code: ''
      }
    },
    created() {
      // this.$root.eventHub.$emit('loaddl')
      // this.$root.eventHub.$emit('loadfz')
      this.$root.eventHub.$emit('user')
      this.$root.eventHub.$on('showMX', (res) => {
        this._checkMX(res)
      })
      this._siteInit()
    },
    components: {
      MAgent
    },
    computed: {
      siteLogo() {
        return `background: url(${this.user.agency.sub_site.icon || require('../../assets/logo.png')}) no-repeat;`
      },
      ...mapGetters([
        'user',
        'token',
        'tokenTime',
        'app'
        ])
    },
    methods: {
      tableRowClassName(row) {
        if (row.row.status === 2) {
          return ''
        } else {
          return 'sucess-table'
        }
      },
      _copyDomain() {
        if (this.user.agency.sub_domain) {
          window.open(`http://${this.user.agency.sub_domain}`)
        } else {
          this.$root.eventHub.$emit('domain')
        }
      },
      _chose(e) {
        this.page = 0
        const that = this
        if (e) {
          this._getOrders(that)
        } else {
          if (!this.code) {
            this.$parent._open('请先输入订单号')
            return false
          }
          this._getOrders(that, this.code)
        }
      },
      handleCurrentChange(val) {
        this.page = val - 1
        this._getOrders(that)
      },
      _checkMX(res) {
        this.showMingXi = res
      },
      _toGoodsManage() {
        this.$root.eventHub.$emit('siteInit')
        this.$router.replace({
          path: '/goodsManage'
        })
      },
      _toReflect() {
        this.$root.eventHub.$emit('reflectInit')
        this.$router.replace({
          path: '/reflect'
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
        const that = this
        this._getSiteinfo(that)
      },
      _getOrders(that, code) {
        getOrders(this.token, 10, this.page, 1, code).then((res) => {
          if (res.data.err_code === SUCCESS_CODE) {
            that.MXList = this._formatMXlist(res.data.data.data)
            that.total = res.data.data.count
          } else {
            if (res.data.err_msg) {
              this.$parent._open(this.$root.errorCode[res.data.err_code])
            } else {
              this.$parent._open('似乎出错了')
            }
          }
        })
      },
      _formatMXlist(list) {
        list.forEach((item) => {
          item.statusShow = item.status === 1 ? '未支付' : '已支付'
          item.timeA = timeChange(item.create)
        })
        return list
      },
      _getSiteinfo(that) {
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
    beforeCreate: function() {
      document.getElementsByTagName("body")[0].className = "add_bg"
    }
  }

</script>
<style type="text/css" scoped>
#main-box {
  opacity: .95 !important;
}

.income-box {
  width: 100%;
  height: auto;
  margin: 40px auto;
}

.income-box-item {
  width: 20%;
  margin: 2%;
  padding-bottom: 21%;
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
  margin: -20px auto 0;
  width: 30%;
}

.configure-box {
  width: 100%;
  background: #fff;
  height: 520px;
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
  width: 38%;
  height: 36%;
  margin-top: 15%;
  overflow: hidden;
}

.pic-title {
  width: 100%;
  margin-top: -15%;
  color: #353535;
  font-size: 1rem;
}

.proxy-icon {
  max-width: 25px;
  height: auto;
  margin: 0 5px;
}

.goods-table {
  width: 96%;
  margin: 0 auto;
}

.good-btn {
  width: 80px;
  height: 40px;
  border-radius: 5px;
  background: #FFD236;
  color: #353535;
}

.input-btn-box {
  justify-content: flex-start;
  height: auto;
  width: 100%;
  margin: 20px 0;
}

.ibb-input-warp {
  height: 40px;
  width: 35%;
  background: #f4f4f4;
  border-radius: 5px;
  border: 1px solid #eee;
  /*  margin-right: 2%;*/
}

.aib-ipnput {
  width: 100%;
  height: 100%;
  outline: none;
  border: none;
  background: #f4f4f4;
  font-size: 15px;
  color: #777;
  text-indent: 20px;
}

.margin20 {
  margin-left: 2%;
}

.partition-top {
  height: 10px;
  width: 100%;
}
.margin-right{
  /*margin-right: 20px;*/
  margin: 0 20px 0 10px;
}
</style>
