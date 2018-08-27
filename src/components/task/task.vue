<template>
  <!--   http://p70pqu6ys.bkt.clouddn.com/%E8%83%8C%E6%99%AF%E5%9B%BE%EF%BC%881920x1335%29.png -->
  <div id="main-body" ref='mainbody'>
    <div class="main-box" id="main-box" v-if="user">
      <!--  右侧边栏start -->
      <m-agent></m-agent>
      <!--  右侧边栏end -->
      <!--       <div class="partition"></div> -->
      <div class="goods-table" v-if="tableData">
        <div class="income-box flex shpc" v-if="siteInfo">
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
        <div class="flex input-btn-box">
          <div class="ibb-input-warp">
            <input type="text" name="mxInput" class="aib-ipnput" placeholder="输入ID或订单号查询" v-model="code">
          </div>
          <div class="good-btn flex cursor margin20" @click="_chose(false)">查询</div>
          <div class="good-btn flex cursor margin20" @click="_chose(true)">全部订单</div>
        </div>
        <!-- :row-class-name="tableRowClassName" -->
        <el-table :data="tableData" style="width: 100%" v-loading="loading" :row-class-name="tableRowClassName">
          <el-table-column prop="label" label="业务">
          </el-table-column>
          <el-table-column prop="id" label="订单ID">
          </el-table-column>
          <el-table-column prop="addition" label="分享链接/用户ID">
          </el-table-column>
          <el-table-column
          label="">
          <template slot-scope="scope">
            <el-button @click="_viewLink(scope.row)" type="text" size="small" v-if="scope.row.showLink">查看链接</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="start_point" label="初始数量">
        </el-table-column> 
        <el-table-column prop="point" label="数量">
        </el-table-column>
        <el-table-column prop="status" label="状态">
        </el-table-column>
<!--         <el-table-column prop="time" label="预计完成">
        </el-table-column> -->
        <el-table-column prop="appointment_time" label="预约时间">
        </el-table-column>
        <el-table-column prop="createA" label="提交时间">
        </el-table-column>
      </el-table>
      <div id="i-page" class="i-page flex">
        <el-pagination layout="prev, pager, next" :total="total" @current-change="handleCurrentChange">
        </el-pagination>
      </div>
    </div>
  </div>
</div>
</template>
<script type="text/javascript">
  // import { getSiteinfo, getOrders } from 'api/site'
  import { getTasks, getSiteinfo } from 'api/site'
  import { mapGetters, mapMutations } from 'vuex'
  import { testToken, timeChange } from 'common/js/util'
  import { SUCCESS_CODE } from 'api/config'
  import MAgent from 'components/agent-banner/agent-banner'
  const NUM = 10
  export default {
    data() {
      return {
        siteInfo: false,
        showMingXi: false,
        tableData: false,
        page: 0,
        total: 0,
        bgPath: null,
        code: '',
        siteInfo: false,
        loading: false,
        state: {
          '-10': '未支付',
          '-9': '进行中',
          '-8': '订单失败',
          '-7': '进行中',
          '-6': '订单失败',
          '-5': '进行中',
          '-4': '已完成',
          '-3': '准备中',
          '-2': '准备中',
          '-1': '准备中',
          '0': '准备中',
          '1': '进行中',
          '2': '已完成',
          '3': '进行中',
          '4': '订单取消',
          '5': '订单取消'
        }
      }
    },
    created() {
    // this.$root.eventHub.$emit('user')
    this._siteInit()
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
  components: {
    MAgent
  },
  methods: {
    _viewLink(e) {
      window.open(e.hrefLink)
    },
    tableRowClassName(row) {
      if (row.row.status === '已完成') {
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
    _chose(e) {
      this.page = 0
      const that = this
      if (e) {
        this._getTasks()
      } else {
        if (!this.code) {
          this.$parent._open('请先输入订单号')
          return false
        }
        this._getTasks(this.code)
      }
    },
    handleCurrentChange(val) {
      console.log(val)
      this.page = val - 1
      this._getTasks()
    },
    _checkMX() {
      this.$router.replace({
        path: '/management'
      })
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
      // this._getSiteinfo(that)
      this._getSiteinfo(that)
      this._getTasks()
    },
    _getTasks(id) {
      if (!this.checkTock()) {
        return false
      }
      this.loading = true
      // const that = this
      if (id) {
        // console.log(id)
        getTasks(this.token, NUM, this.page, 1, id).then((res) => {
          this.afterGetTasks(res, this)
        })
      } else {
        getTasks(this.token, NUM, this.page, 1).then((res) => {
          this.afterGetTasks(res, this)
        })
      }
    },
    afterGetTasks(res, that) {
      this.loading = false
      if (res.data.err_code === SUCCESS_CODE) {
        this.total = res.data.data.count
        this.tableData = that._normalTasks(res.data.data.tasks)
        // this._timing(this.tableData)
        setInterval(() => {
          that._countDown(this.tableData)
        }, 1000)
      }
    }, 
    _countDown(list) {
      const that = this
      let time = Date.parse(new Date()) / 1000
      list.forEach((item) => {
        // console.log(item.status)
        if (item.status ==='完成' || item.status ==='未支付') {
          item.time = '-'
          return
        }
        if (item.status === '准备中') {
          item.time = '-'
        } else {
          if (item.cost_time + item.create > time) {
            item.time = that.normalTimeCountDown(item.cost_time + item.create - time)
          } else {
            item.time = '00:00:01'
          }
        }
      })
    },
    normalTimeCountDown: function(item) {
      let day = item / 3600 >= 24 ? parseInt(item / (3600 * 24)) : 0 // 天
      let hour = (item - day * 24 * 3600) / 3600 >= 1 ? parseInt((item - day * 24 * 3600) / 3600) : 0 // 小时
      let minute = (item - day * 24 * 3600 - hour * 3600) / 60 >= 1 ? parseInt((item - day * 24 * 3600 - hour * 3600) / 60) : 0 // 分钟
      let second = item - day * 24 * 3600 - hour * 3600 - minute * 60 // 秒
      day = day === 0 ? '' : day + ':'
      hour = hour === 0 ? '00:' : hour < 10 ? '0' + hour + ':' : hour + ':'
      minute = minute === 0 ? '' : minute < 10 ? '0' + minute + ':' : minute + ':'
      second = second < 10 ? '0' + second : second
      return day + hour + minute + second
    },   
    _normalTasks(list) {
      const that = this
      list.forEach((item) => {
        item.hrefLink = item.addition
        item.status = that.state[item.status]
        item.createA = timeChange(item.create)
        item.currentNum = '-'
        item.time = '-'
        if (item.hrefLink.indexOf('http')> -1) {
          item.showLink = true
        } else {
          item.showLink = false
        }
        if (item.appointment_time) {
          item.appointment_time = timeChange(item.appointment_time)
        } else {
          item.appointment_time = '-'
        }
        if (item.addition.length >= 15) {
          item.addition = item.addition.slice(0, 12) + '...'
          // console.log(item.addition)
        }
      })
      return list
    },
    // _formatMXlist(list) {
    //   list.forEach((item) => {
    //     item.statusShow = item.status === 1 ? '未支付' : '已支付'
    //     item.timeA = timeChange(item.create)
    //   })
    //   return list
    // },
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
    ...mapMutations({
      setToken: 'SET_TOKEN',
      setUser: 'SET_USER',
      setScorerate: 'SET_SCORERATE',
      setTokenTime: 'SET_TOKENTIME'
    })
  },
  beforeCreate: function() {
    document.getElementsByTagName("body")[0].className = "add_bg"
  },
}

</script>
<style type="text/css" scoped>
/*#body{
  background: url(http://p70pqu6ys.bkt.clouddn.com/%E8%83%8C%E6%99%AF%E5%9B%BE%EF%BC%881920x1335%29.png) no-repeat !important;
  }*/
  #main-box {
   /* width: 45% !important;*/
   opacity: .95 !important;
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
  margin: 40px auto 0;
  background-size: 100% 100% !important;
}

.cr-item {
  width: 100%;
  margin-top: 40px;
}

.cr-box-min {
  width: 60%;
  flex-grow: 1;
  height: 44px;
  font-size: 14px;
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
  font-size: 16px;
  height: 44px;
}

.cr-box-max {
  height: 100px;
  margin: 0 20px 0 10px;
  border-radius: 5px;
  background: #f4f4f4;
  text-indent: 10px;
  font-size: 14px;
  justify-content: flex-start;
  flex-grow: 1;
  align-items: flex-start;
  line-height: 40px;
  overflow: hidden;
}

.cr-box-tit {
  width: 15%;
  height: 100%;
  min-width: 60px;
  font-size: 16px;
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
  font-size: 16px;
}

.proxy-icon {
  max-width: 25px;
  height: auto;
  margin: 0 5px;
}

.goods-table {
  width: 96%;
  margin: 0 auto;
  overflow: hidden;
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
