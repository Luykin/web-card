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
          <div class="notice-item-right flex">{{siteInfo.sum_price}}</div>
        </div>
        <div class="mg-btn flex cursor notice-heder-btn" @click="_back">分站管理</div>
        <div class="mg-btn flex cursor notice-heder-btn" @click="_toReflect">提现</div>
      </div>
      <!--  右侧边栏end -->
      <div class="configure-box flex">
        <div class="chose-box flex">
          <el-select v-model="chose" placeholder="请选择" no-data-text="暂无商品">
            <el-option v-for="item in choseItem" :key="item.choseTitle" :label="item.choseTitle" :value="item.id">
            </el-option>
          </el-select>
          <div class="good-btn flex cursor margin20">筛选</div>
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
                <div class="chose_status cursor" v-show="!scope.row.status"></div>
                <div class="chose_status chose_status-sj cursor" v-show="scope.row.status"></div>
              </template>
            </el-table-column>
            <el-table-column label="">
              <template slot-scope="scope">
                <!--  <el-button @click="_viewLink(scope.row)" type="text" size="small" v-if="scope.row.showLink">查看链接</el-button> -->
                <div class="good-btn flex cursor" @click="showPop($event, scope)">调整价格</div>
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
          <div class="agree-label flex ellipsis">商品名称</div>
          <div class="flex input-defult">
            <!-- <input type="text" placeholder="请填写公司简称" class="i-ipnput" v-model="companyName"> -->
          </div>
        </div>
      </div>
    </popup>
    <interlayer ref="interlayer" @close='_interlayerHide'></interlayer>
  </div>
</template>
<script type="text/javascript">
import { getSiteinfo, getAgencyservice } from 'api/site'
import { mapGetters, mapMutations } from 'vuex'
import { testToken } from 'common/js/util'
import { SUCCESS_CODE } from 'api/config'
import popup from 'base/popup/popup'
import interlayer from 'base/interlayer/interlayer'
export default {
  data() {
    return {
      siteInfo: false,
      agencyService: [],
      choseItem: [],
      chose: '全部商品',
      rank: ['青铜代理', '白银代理', '黄金代理', '王者代理'],
      iconList: ['http://p70pqu6ys.bkt.clouddn.com/%E7%AD%89%E8%AE%B01.png', 'http://p70pqu6ys.bkt.clouddn.com/%E7%AD%89%E7%BA%A72.png', 'http://p70pqu6ys.bkt.clouddn.com/%E7%AD%89%E7%BA%A73@2x.png']
    }
  },
  created() {
    this.$root.eventHub.$emit('user')
    this._siteInit()
    this._orderInt()
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
    _toReflect() {
      this.$router.replace({
        path: '/reflect'
      })
    },
    showPop(e, s) {
      console.log(e)
      console.log(s)
      this.$refs.popup._showPopup()
      this.$refs.interlayer._setZIndex(9999)
      this.$refs.interlayer._showLayer()
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
    _getAgencyservice() {
      if (!this.checkTock()) {
        return false
      }
      getAgencyservice(this.token).then((res) => {
        if (res.data.err_code === SUCCESS_CODE) {
          console.log(res.data.data)
          // this.siteInfo = res.data.data
          this.agencyService = res.data.data
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
  width: 100%;
  height: auto;
}

.chose-box {
  width: 100%;
  height: 100px;
  justify-content: flex-start;
}

.margin20 {
  margin: 0 20px;
}

.chose_status {
  width: 15px;
  height: 15px;
  border: 1px solid #353535;
  /* margin: 0 auto;*/
  transform: translate(100%, 0);
}

.chose_status-sj {
  border: none;
  background: url('http://p70pqu6ys.bkt.clouddn.com/%E9%80%89%E4%B8%AD.png') no-repeat;
  background-size: contain;
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
  margin: 20px auto 100px;
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

</style>
