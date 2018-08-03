<template>
  <div class="new-index">
    <div class="proclamation flex">
      <i class="iconfont icon-broadcast index-icon"></i>
      <div class="affiche-warp flex">
        <div class="affiche">
          <p v-html="app.announcement" class="inline-block"></p>
          <p v-html="app.announcement" class="inline-block"></p>
        </div>
      </div>
    </div>
    <div class="operating-table">
      <div class="servece-table">
        <div v-for="item in app.service_categories" :class="{'activeCategory':activeCategory == item.id}" @click="_chose($event,item.id)" v-bind:key="item.id+Math.random()" class="servece-table-item flex cursor">
          <img :src="item.icon" class="mbh-icon" v-if="item.icon">
          <div class="mbh-label flex">{{item.label}}</div>
        </div>
      </div>
      <div class="servece-table-detail">
        <div class="std-header flex">
          <div v-for="item in showService" class="std-header-item flex ellipsis cursor" @click="_changeService(item)" :class="{'active-service': item.id == nowServices.id}">
            <div class="shi-label">
              <div class="flex behover" v-show="item.behavior == 0">维护中</div>
              {{item.label}}
            </div>
          </div>
        </div>
        <div class="std-conent">
          <div class="goods-boxA flex" v-if="nowServices">
            <div v-for="item in nowServices.point_list" class="good-item cursor flex" @click="_changeNum(item)" :class="{'ac-good': quantity == item}">
              {{item}}{{nowServices.units}}
              <div class="trang" v-show="quantity == item">
                <i class="iconfont icon-zhengque trang-icon"></i>
              </div>
            </div>
          </div>
          <div class="course flex" v-if="showService && nowServices" :class="{'course-border' : uaid <= 60002}">
            <img src="http://pbfntaxkx.bkt.clouddn.com/zhibo_person.png" alt="温馨提示" class="course-img-icon">
            <div v-html='nowServices.tips'></div>
          </div>
          <div class="select-box flex">
            <div class="select-item" v-show='nowServices && (nowServices.category === 24 || nowServices.category === 25)'>
              <div class="select-item-label flex ellipsis">预约时间</div>
              <div class="flex input-defult no-border">
                <el-date-picker v-model="orderTimeD" type="date" placeholder="选择日期" :picker-options="pickerOptions" value-format='timestamp' format='yyyy-MM-dd'>
                </el-date-picker>
                <el-time-select v-model="orderTimeS" :picker-options="{start: '00:00',step: '00:30',end: '23:30'}" placeholder="选择时间" value-format='timestamp'>
                </el-time-select>
              </div>
            </div>
            <div class="select-item" v-show='nowServices && (nowServices.category === 24 || nowServices.category === 25) && pc'>
            </div>
            <div class="select-item" v-if="showService">
              <div class="select-item-label flex ellipsis">
                <span v-if="nowServices">{{nowServices.form || '链接'}}</span>
                <el-popover ref="popover4" :placement="position" :width="popoverWidth" trigger="click" v-if="nowServices && (nowServices.category>10||(nowServices.category===2 || nowServices.category===4))">
                  <div class="p-course-box" v-show="!pc || choseSay">
                    <div class="pcb-warp">
                      <div v-if="!nowServices.tutorials_mobile && (nowServices.category!==2 && nowServices.category!==4)" class="flex no-tutorials">暂无教程</div>
                      <div v-if="(nowServices.category ===2 || nowServices.category===4) && !sayList && !lodingS" class="flex no-tutorials">您输入的QQ号无效或无权限访问此QQ号空间</div>
                      <div class="flex no-tutorials loding" v-if="lodingS">加载中</div>
                      <img :src="nowServices.tutorials_mobile" class="course-img" v-if="nowServices.tutorials && (nowServices.category!==2 && nowServices.category!==4)">
                      <div v-if="sayList && (nowServices.category ===2 || nowServices.category ===4)" v-for="item in sayList" class="say-list-item" @click="_choseSayList(item)">
                        {{item.content}}
                      </div>
                    </div>
                    <div class="close-btn-c flex cursor phone-btn" @click='_closeCourse'>{{closeName}}</div>
                  </div>
                  <div class="pc-course" v-show='pc && !choseSay' ref='pcCourse'>
                    <div class="close-btn-c flex cursor" @click='_closeCourse'>{{closeName}}</div>
                    <div v-if="!nowServices.tutorials" class="flex no-tutorials">暂无教程</div>
                    <img :src="nowServices.tutorials" class="course-img" v-if="nowServices.tutorials && (nowServices.category!==2 && nowServices.category!==4)">
                  </div>
                </el-popover>
                <el-button v-popover:popover4 @click="_choseShuoShuo(nowServices.category)" ref='elbutton' v-if="nowServices && (nowServices.category>10||(nowServices.category===2 || nowServices.category===4))">{{nowServices.category > 0&&nowServices.category
                  < 10 ? '获取说说列表': '查看教程'}}</el-button>
              </div>
              <div class="flex input-defult" v-if="nowServices">
                <input type="text" :placeholder="placeholder" class="i-ipnput" v-model="link" @keyup.enter="_sublime(nowServices.category)">
              </div>
            </div>
            <div class="select-item" v-if="showService">
              <div class="select-item-label flex ellipsis">数量</div>
              <div class="num-limiit" v-if="nowServices && nowServices.submit_category !== 2">(<span class="red-score-sapn">{{nowServices.min_num}}</span>{{nowServices.units}}-<span class="red-score-sapn">{{nowServices.max_num}}</span>{{nowServices.units}})</div>
              <div class="flex input-defult" v-if="nowServices && nowServices.submit_category !== 2">
                <input type="text" placeholder="请填写数量" class="i-ipnput" v-model="quantity" @keyup.enter="_sublime(nowServices.category)" @keyup="_rectifyMoney" ref='quantityInput'>
              </div>
              <div class="i-input-disable flex" v-if="nowServices && nowServices.submit_category === 2">{{quantity}} (固定数量)</div>
            </div>
          </div>
          <div v-if="showService && nowServices">
            <div class="chose-box ellipsis" v-if="suosuo">{{suosuo}}</div>
            <div class="rule-hints flex ellipsis" v-if="nowServices.price">
              <span class="rh-title">所需金额:</span>
              <span class="need-score-sapn" v-show="nowServices.behavior !== 0">{{quantity || 0}}{{nowServices.units}} * {{parseFloat(nowServices.price) + '单价'}}= {{consumeMoney + '元'}}</span>
              <span class="need-score-sapn" v-show="nowServices.behavior == 0">服务正在维护中，请关注公告。</span>
            </div>
            <div class="rule-hints flex ellipsis" v-if="proxyRank != '普通用户' && user.agency_level && !Gdomain && nowServices.behavior !== 0">
              <span class="rh-title">{{proxyRank}}:</span><span class="need-score-sapn">代理折扣后所需积分{{' : '+ consumeMoney + '原价'}}{{'* ' + (user.agency_level.discount || 1)*10 + '折'}} = {{agencyPrice + '元'}}</span>
            </div>
          </div>
          <!-- app  支付方式 -->
          <div class="goods-box flex">
            <span class="rh-title">选择支付方式:</span>
            <div v-for="(value, key) in app.payments" @click="_chosePayType(key, value)" :class="{'active-pay-type':activePayType === key, 'disable-pay-type' : !value}" class="cursor flex pay-item ellipsis" v-if='value'>
              <img :src="'http://ozp5yj4ke.bkt.clouddn.com/'+ key + '.png'" class="pay-icon"> {{key === 'wx' ? '微信支付':key === 'qq'?'QQ支付':'支付宝支付'}}</div>
          </div>
          <!-- app  支付方式  end -->
          <div class="weihu-btn flex" v-show="showService && nowServices.behavior == 0">提交订单</div>
          <div class="btn flex" @click="_sublime(nowServices.category)" v-show="showService && nowServices.behavior !== 0">提交订单</div>
        </div>
      </div>
      <div class="horse-race-lamp">
        <div class="notice-down">
          <div class="notice-title flex">APP下载</div>
          <div class="qr-down-warp flex">
            <img :src="nowconfig.down_ios" alt="快手刷粉" v-show='downLink == 0' class="qr-down">
            <img :src="nowconfig.down_android" alt="快手刷粉" v-show='downLink == 1' class="qr-down">
            <div class="zi-warp flex">
              <img src="http://p8sxtcg6t.bkt.clouddn.com/Group%202.png" alt="快手刷粉">
            </div>
            <div class="qr-down-btn flex cursor" :class="{'active-qr-down-btn' : downLink == 0}" @click="_updataDownLink(0)">
              <img src="http://p8sxtcg6t.bkt.clouddn.com/iOS.png" alt="IOS快手刷粉" class="qdb-img">IOS</div>
            <div class="qr-down-btn flex cursor" :class="{'active-qr-down-btn' : downLink == 1}" @click="_updataDownLink(1)">
              <img src="http://p8sxtcg6t.bkt.clouddn.com/android.png" alt="Android快手刷粉" class="qdb-img">Android</div>
          </div>
        </div>
        <div class="new-task">
          <div class="notice-title flex">最新订单</div>
          <div v-if="latestTasks" class="record-warp">
            <div class="record">
              <div class="record-item flex ellipsis" v-for="item in latestTasks">
                用户<span class="maincolor">{{item.phone}}</span> 购买<span class="maincolor">{{item.label}}</span>
              </div>
            </div>
            <div class="record">
              <div class="record-item flex ellipsis" v-for="item in latestTasks">
                用户<span class="maincolor">{{item.phone}}</span> 购买<span class="maincolor">{{item.label}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script type="text/javascript">
import { getServiceCategory, getServices, addTask, getUserInfo, getShuoshuoList, addTaskTargetId, getAppInfo, latestTasks } from 'api/index'
import { testToken } from 'common/js/util'
import { mapGetters, mapMutations } from 'vuex'
import { SUCCESS_CODE, modifyEnv } from 'api/config'
import { Judge } from 'common/js/judge'
import { UAID } from 'api/config'
import { NOWCONFIG } from 'api/appConfig'
const BILI = 0.8
export default {
  mixins: [Judge],
  data() {
    return {
      // 很重要，代表是否为分站的参数
      Gdomain: null,
      uaid: null,
      judgeMust: true,
      popoverWidth: 1000,
      link: '',
      loading: false,
      orderTimeD: '',
      orderTimeS: '',
      quantity: '',
      shuoshuoPage: 0,
      lodingChose: null,
      serviceCategory: false,
      services: [],
      sayList: false,
      activeCategory: false,
      activePayType: null,
      showService: false,
      targetid: false,
      suosuo: false,
      lodingS: false,
      scorerate: false, // 一元购买多少积分
      pc: true,
      announcement: null,
      choseSay: false,
      sublimeTime: false,
      netWorking: false,
      position: 'right',
      closeName: '关闭',
      // _startTime: '00:00',
      downLink: '0',
      nowServices: null,
      latestTasks: null,
      rank: ['青铜代理', '白银代理', '黄金代理', '王者代理'],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 86400000
        }
      }
    }
  },
  created() {
    this.uaid = UAID
    this.nowconfig = NOWCONFIG
    this._setEnv()
    this._setPopoverWidth()
    this._latestTasks()
    if (this.user) {
      this.$nextTick(() => {
        this.$root.eventHub.$emit('user')
      })
    }
    this.$root.eventHub.$on('announcement', (announcement) => {
      this._setAnnouncement(announcement)
    })
    this.$root.eventHub.$emit('canvas')
  },
  updated() {
    this.$nextTick(() => {
      if (this.$refs.pcCourse && (this.$refs.pcCourse.style.width !== `${BILI * window.screen.height}px`)) {
        this.$refs.pcCourse.style.width = `${BILI * window.screen.height}px`
        this.$refs.pcCourse.style.height = `${BILI * window.screen.height}px`
      }
    })
    this.pcOrphone()
  },
  computed: {
    // nowServices() {
    //   let nowServer = {
    //     submit_category: 1
    //   }
    //   if (this.showService) {
    //     this.showService.forEach((item) => {
    //       if (item.id === this.choseServiceValue) {
    //         nowServer = item
    //       }
    //     })
    //   }
    //   if (nowServer.submit_category === 2) {
    //     this.quantity = nowServer.min_num
    //   }
    //   return nowServer
    // },
    proxyRank() {
      if (this.user && this.user.agency && this.user.agency.level) {
        return this.rank[this.user.agency.level - 1]
      } else {
        return '普通用户'
      }
    },
    placeholder() {
      if (this.nowServices) {
        return this.nowServices.category > 0 && this.nowServices.category < 10 ? '请按教程输入QQ号' : this.nowServices.category === 24 || this.nowServices.category === 25 ? '请按教程粘贴快手ID' : '请按教程粘贴链接'
      }
      return '请按教程粘贴链接'
    },
    consumeNum() {
      return Math.ceil((this.quantity || 0) * this.nowServices.rate)
    },
    consumeMoney() {
      if (this.nowServices.price) {
        return Math.round(((this.quantity || 0) * this.nowServices.price) * 100) / 100
      } else {
        return false
      }
    },
    agencyPrice() {
      if (this.user.agency_level) {
        return Math.round((this.quantity || 0) * this.nowServices.price * (this.user.agency_level.discount || 1) * 100) / 100
      } else {
        return Math.round(((this.quantity || 0) * this.nowServices.price) * 100) / 100
      }
    },
    ...mapGetters([
      'user',
      'token',
      'tokenTime',
      'app'
    ])
  },
  methods: {
    pcOrphone() {
      if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
        this.$router.replace({
          path: '/old-index'
        })
      } else {}
    },
    _latestTasks() {
      latestTasks().then((res) => {
        if (res.data.err_code === SUCCESS_CODE) {
          this.latestTasks = this._normalTasks(res.data.data.tasks)
        }
      })
    },
    _normalTasks(list) {
      if (list.length < 10) {
        list = list.concat(list)
        return this._normalTasks(list)
      }
      if (list.length >= 10) {
        list = list.slice(0, 10)
        return list
      }
    },
    _chosePayType(key, value) {
      if (value && this.activePayType !== key) {
        this.activePayType = key
      }
    },
    _changeNum(num) {
      this.quantity = num
    },
    _changeService(item) {
      this.nowServices = item
      if (item.submit_category === 2) {
        this.quantity = item.min_num
      } else {
        this.quantity = this.nowServices.point_list ? this.nowServices.point_list[0] : ''
      }
    },
    _updataDownLink(res) {
      this.downLink = res
    },
    _setAnnouncement(announcement) {
      this.announcement = announcement
    },
    _setEnv() {
      const query = this.$route.query
      if (query.env === 'dev') {
        this.$root.eventHub.$emit('env')
        modifyEnv()
      }
    },
    _closeCourse() {
      this.$refs.elbutton.$el.click()
    },
    _choseSayList(item) {
      this.$refs.quantityInput.click()
      if (item) {
        this.targetid = item.tid
        this.suosuo = item.content
      }
    },
    _getAppInfo(that) {
      getAppInfo().then((res) => {
        if (res.data.err_code === SUCCESS_CODE && res.data.data) {
          if (res.data.data.score_rate) {
            this.setScorerate(res.data.data.score_rate)
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
    _rectifyMoney() {
      if (isNaN(this.quantity) || this.quantity.indexOf('.') > -1 || this.quantity <= 0) {
        this.quantity = ''
      }
    },
    _sublime(category) {
      if (!this.activePayType) {
        this.$parent._open('请选择支付方式')
        return
      }
      if (this.netWorking) {
        this.$parent._open('提交中,请勿重复提交')
        return false
      }
      if (!this.nowServices) {
        this.$parent._open('未知错误')
        return false
      }
      if (!this.checkTock()) {
        return false
      }
      if (category === 2 || category === 4) {
        if (!this.targetid) {
          this.$parent._open('请选择说说')
          return false
        }
      } else {
        if (!this.link && category < 10) {
          this.$parent._open('请正确填写QQ号')
          return false
        }
        if (!this.link) {
          this.$parent._open('请正确填写')
          return false
        }
        if ((!this.link || this.link.indexOf('http') < 0) && category > 10 && category !== 21 && category !== 40 && category !== 24 && category !== 25) {
          this.$parent._open('请正确填写')
          return false
        }
      }
      let max = this.nowServices.max_num
      let min = this.nowServices.min_num
      if (!max) {
        this.$parent._open('后台数量限制有误')
        return false
      }
      if (this.quantity > max || this.quantity < min) {
        this.$parent._open(`最大数量${max},最小数量${min}`)
        return false
      }
      if (category === 24 || category === 25) {
        if (!this.orderTimeD) {
          this.$parent._open('请选择日期')
          return false
        }
        if (!this.orderTimeS) {
          this.$parent._open('请选择具体时间')
          return false
        }
        const maohao = this.orderTimeS.indexOf(':')
        const H = parseInt(this.orderTimeS.slice(0, maohao)) * 3600
        const M = parseInt(this.orderTimeS.slice(maohao + 1)) * 60
        this.sublimeTime = this.orderTimeD / 1000 + H + M
      }
      let data = {
        services: this.nowServices,
        point: this.quantity,
        service_id: this.nowServices.id,
        price: this.agencyPrice,
        addition: this.link,
        pay_type: this.activePayType
      }
      if (this.Gdomain) {
        data = Object.assign({ sub_domain: this.Gdomain }, data)
      }
      if (category === 2 || category === 4) {
        data = Object.assign({ target_id: this.targetid }, data)
      }
      if (category === 24 || category === 25) {
        data = Object.assign({ target_id: false, appointment_time: this.sublimeTime }, data)
      }
      this.$root.eventHub.$emit('showPopup', data)
    },
    _afterAddtask(res) {
      this.orderTimeD = ''
      this.orderTimeS = ''
      this.link = ''
      this.quantity = ''
      this.netWorking = false
      this.targetid = false
      this.sublimeTime = false
      if (res.data.err_code === SUCCESS_CODE) {
        this.$parent._open('下单成功')
        this.$root.eventHub.$emit('updateOrder')
        this.$root.eventHub.$emit('canvas', true)
        this.$router.replace({
          path: '/order'
        })
        if (!this.checkTock()) {
          return false
        }
        getUserInfo(this.token).then((res) => {
          if (res.data.err_code === SUCCESS_CODE) {
            this.setUser(res.data.data)
            this.$root.eventHub.$emit('user')
          } else {
            if (res.data.err_msg) {
              this.$parent._open(this.$root.errorCode[res.data.err_code])
            } else {
              this.$parent._open('似乎出错了')
            }
          }
        })
      } else {
        if (res.data.err_msg) {
          this.$parent._open(this.$root.errorCode[res.data.err_code])
        } else {
          this.$parent._open('似乎出错了')
        }
      }
    },
    _choseShuoShuo(category) {
      if (category !== 2 && category !== 4) {
        return
      }
      if (!this.link) {
        this._closeCourse()
        this.$parent._open('请输入QQ号')
        return
      }
      if (this.link.length < 5) {
        this._closeCourse()
        this.$parent._open('请正确输入QQ号')
        return
      }
      this._getKjInfo(this.link, this.shuoshuoPage)
    },
    _getKjInfo(typeid, page) {
      if (!this.checkTock()) {
        return false
      }
      this.sayList = false
      this.lodingS = true
      getShuoshuoList(typeid, this.token).then((res) => {
        this.lodingS = false
        if (res.data.err_code === SUCCESS_CODE) {
          // console.log(res.data.data.msglist)
          if (res.data.data.msglist) {
            this.sayList = res.data.data.msglist
          } else {
            this.$parent._open('似乎没有权限查看,请打开空间权限')
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
    _setPopoverWidth() {
      const width = document.body.clientWidth || window.screen.width
      if (this.browserRedirect()) {
        this.popoverWidth = BILI * window.screen.height
        this.pc = true
        this.position = 'right-start'
      } else {
        this.pc = false
        this.popoverWidth = 300
        if (width <= 320) {
          this.popoverWidth = 240
        }
        this.position = 'right-start'
      }
    },
    browserRedirect() {
      const sUserAgent = navigator.userAgent.toLowerCase()
      const bIsIpad = sUserAgent.match(/ipad/i) == "ipad"
      const bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os"
      const bIsMidp = sUserAgent.match(/midp/i) == "midp"
      const bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4"
      const bIsUc = sUserAgent.match(/ucweb/i) == "ucweb"
      const bIsAndroid = sUserAgent.match(/android/i) == "android"
      const bIsCE = sUserAgent.match(/windows ce/i) == "windows ce"
      const bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile"
      if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
        return false
      } else {
        return true
      }
    },
    _chose(e, id) {
      if (this.lodingChose) {
        this.$parent._open('加载中')
        return 0
      }
      if (!this.services[id]) {
        this.lodingChose = true
        this._getServices(this, id, this.Gdomain)
      } else {
        this.showService = this.services[id]
        // this.choseServiceValue = this.showService[0] ? this.showService[0].id : ''
        this.nowServices = this.showService[0]
      }
      this.link = ''
      this.quantity = this.nowServices.point_list ? this.nowServices.point_list[0] : ''
      this.suosuo = false
      this.activeCategory = id
      if (!this.pc) {
        return
      }
      if (this.nowServices.category === 2 || this.nowServices.category === 4) {
        this.position = 'right'
        this.popoverWidth = 320
        this.choseSay = true
      } else {
        if (this.popoverWidth < 400 && this.pc) {
          this.popoverWidth = BILI * window.screen.height
          this.position = 'right-start'
        }
        if (this.choseSay) {
          this.choseSay = false
        }
      }
    },
    _clear() {
      this.link = ''
      this.quantity = ''
      this.suosuo = false
      if (!this.pc) {
        return
      }
      if (this.nowServices.category === 2 || this.nowServices.category === 4) {
        this.position = 'right'
        this.popoverWidth = 320
        this.choseSay = true
      } else {
        if (this.popoverWidth < 400 && this.pc) {
          this.popoverWidth = BILI * window.screen.height
          this.position = 'right-start'
        }
        if (this.choseSay) {
          this.choseSay = false
        }
      }
    },
    _initNet() {
      if (this.app.service_categories.length > 0) {
        this.activeCategory = this.app.service_categories[0].id
        this._getServices(this, this.app.service_categories[0].id, this.Gdomain) // 服务
      }
    },
    _getServices(that, id, Gdomain) {
      this.loading = true
      getServices(id, Gdomain).then((res) => {
        this.lodingChose = false
        this.loading = false
        if (res.data.err_code === SUCCESS_CODE) {
          const services = res.data.data
          that.services[that.activeCategory] = services
          that.showService = services
          if (res.data.data) {
            that.nowServices = that.showService[0]
            that.quantity = that.nowServices.point_list ? that.nowServices.point_list[0] : ''
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
    ...mapMutations({
      setToken: 'SET_TOKEN',
      setUser: 'SET_USER',
      setApp: 'SET_APP',
      setScorerate: 'SET_SCORERATE',
      setTokenTime: 'SET_TOKENTIME'
    })
  },
  components: {}
}

</script>
<style type="text/css" scoped>
.trang {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 0px;
  height: 0px;
  border-top: 20px solid rgba(0, 0, 0, 0);
  border-left: 20px solid rgba(0, 0, 0, 0);
  border-right: 20px solid var(--main-color);
  border-bottom: 20px solid var(--main-color);
}

.trang-icon {
  position: absolute;
  top: 100%;
  left: 100%;
  color: #fff;
}

.index-icon {
  font-size: 20px;
  margin-right: 10px;
}

.num-limiit {
  text-indent: 10px;
  color: #999;
  font-size: 13px;
}

.select-box {
  width: 90%;
  height: auto;
  margin: 20px auto;
  justify-content: flex-start;
  flex-wrap: wrap-reverse;
  /*flex-direction: column-reverse;*/
}

.index-select {
  width: 100%;
}

.width100 {
  width: 100% !important;
}

.i-ipnput:focus {
  border-bottom: 1px solid #ff9430;
}

.rule-hints {
  width: 90%;
  flex-grow: 1;
  flex-shrink: 0;
  height: 30px;
  margin: 0 auto;
  justify-content: flex-start;
  text-indent: 10px;
  color: #606266;
}

.btn {
  margin-left: 6% !important;
}

.score-sapn {
  color: #4BC9D1;
}

.gray-span {
  font-size: 13px;
  color: #353535;
}

.need-score-sapn {
  color: #D94D37;
  color: var(--title-color);
}

.course-btn {
  color: #A94442;
}

.course-btn:hover {
  cursor: pointer;
  animation: gradientCourse .5s ease 1 forwards;
}

@keyframes gradientCourse {
  0% {
    color: #A94442;
  }
  100% {
    color: #66BB6A;
  }
}

.course-box {
  max-width: 400px;
  min-width: 300px;
  height: 80%;
  position: absolute;
  left: 25%;
  top: 5%;
  padding: 5px;
  border-radius: 10px;
  z-index: 999;
  box-shadow: 0 0 5px rgba(0, 0, 0, .2);
  background: rgba(255, 255, 255, .1);
}

.course-box-inside {
  width: 100%;
  height: 100%;
  border-radius: 20px;
  overflow-x: hidden;
  overflow-y: scroll;
}

.course-box-inside img {
  width: 100%;
  height: auto;
}

.course-img {
  width: 100%;
  height: auto;
}

.p-course-box {
  width: 100%;
  height: 550px;
  /*overflow-y: scroll;*/
  overflow: hidden;
  position: relative;
}

.pcb-warp {
  height: 100%;
  width: 100%;
  overflow-y: scroll;
}

.pc-course {
  width: 950px;
  height: 950px;
  position: relative;
  overflow: hidden;
}

.close-btn-c {
  position: absolute;
  right: 0px;
  top: 0px;
  width: 75px;
  height: 40px;
  background: #ff6b4e;
  border-radius: 10px;
  color: #fff;
}

.el-button {
  height: 100%;
  line-height: 0px !important;
  background: rgba(255, 255, 255, 0) !important;
  color: #d94d37;
  color: var(--title-color);
  font-size: 15px;
  border: none !important;
}

.p-course-box:hover {
  cursor: pointer !important;
}

.course-img {
  pointer-events: none !important;
}

.chose-shuoshuo {
  /*  text-indent: 0;*/
  color: #d94d37;
}

.chose-shuoshuo:hover {
  color: #ff9430;
  cursor: pointer;
}

.no-tutorials {
  width: 100%;
  height: 550px;
  color: #d94d37;
}

.loding {
  color: #666;
}

.say-list-item {
  width: 90%;
  padding: 5px 5%;
}

.say-list-item:hover {
  background: #ff9430;
  color: #fff;
}

.chose-box {
  height: 20px;
  width: 90%;
  margin: 0 auto;
  text-indent: 20px;
}

.red-score-sapn {
  text-indent: 2px;
  color: #D94D37;
  color: var(--title-color);
}

.max-gray-span {
  text-indent: 10px;
  color: #353535;
}

.i-ipnput {
  text-indent: 15px;
}

.i-input-disable {
  width: 100%;
  height: 45px;
  justify-content: flex-start;
  text-indent: 15px;
  font-size: 15px;
  color: rgba(0, 0, 0, .4);
  border-bottom: 1px solid rgba(0, 0, 0, .1);
}

.rh-title {
  text-indent: 20px;
  font-size: 15px;
  /*font-weight: 600;*/
  color: #353535;
}

.no-indent {
  text-indent: 0;
}

.btn-warp {
  padding: 0;
  margin: 0;
  text-indent: 0;
  font-size: 0;
}

.phone-btn {
  opacity: .8;
}

.no-border {
  border: none !important;
}

.no-border:hover {
  animation: none !important;
}

.agent-box-title {
  justify-content: center;
}

.agent-box-title-label {
  width: 50%;
  height: 40%;
  border-radius: 1000px;
  background: #ff6b4e;
  color: #fff;
}

.num-limiit {
  text-indent: 10px;
  color: #999;
  font-size: 13px;
}

.main-box {
  position: relative;
}

.notice {
  position: absolute;
  right: 0;
  top: 0;
  transform: translate(106%, 0);
  min-height: 5%;
  width: 45%;
  background: #fff;
  padding: 50px 10px 10px;
}

.notice-title {
  height: 40px;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  background: #dfe1e5;
  background: var(--service-bg);
  color: #666;
}

.notice-content {
  line-height: 1.5 !important;
}

.no-data {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, 100%);
}

.index-bootom-height {
  height: 10px;
}

.select-item-label {
  height: 20px;
  justify-content: flex-start;
  text-indent: 15px;
  font-size: 15px;
  color: #353535;
}

.select-item {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  height: auto;
  min-height: 60px;
  margin: 10px 1%;
}

.std-header {
  height: 55px;
  width: 100%;
  background: #fff;
  justify-content: flex-start;
}

.std-conent {
  /*  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  top: 60px;*/
  width: 100%;
  margin: 5px 0 0;
  min-height: 560px;
  height: auto;
  background: #fff;
  overflow: hidden;
}

.servece-table-item:hover .mbh-label {
  animation: color .35s ease 1 forwards;
}

.activeCategory:hover .mbh-label {
  animation: none;
  color: #fff !important;
}

@keyframes color {
  0% {
    color: #666;
  }
  100% {
    color: var(--title-color);
  }
}

.std-header-item {
  width: 120px;
  height: 100%;
  flex-shrink: 1;
  flex-grow: 1;
}

.std-header-item:hover {
  animation: color .35s ease 1 forwards;
}

.shi-label {
  position: relative;
}

.behover {
  box-sizing: border-box;
  position: absolute;
  right: 0;
  top: 0;
  transform: translate(80%, -70%);
  padding: 3px;
  border-radius: 5px;
  /*  border: 1px solid rgba(0, 0, 0, .2);*/
  color: #fff;
  background: #B2B2B2;
  font-size: 10px;
}

.weihu {
  font-size: 16px;
  color: rgba(0, 0, 0, .4);
}

.active-service {
  color: #d94d37;
  color: var(--title-color);
}

.active-service:hover {
  animation: none !important;
}

.new-index {
  width: 1400px;
  min-height: 800px;
  height: auto;
  margin: 50px auto;
  opacity: 1;
  /*  background: #fff;*/
}

.proclamation {
  height: 40px;
  width: 100%;
  background: #fff;
}

.operating-table {
  width: 100%;
  height: auto;
  min-height: 620px;
  margin: 25px auto 0;
  position: relative;
}

.servece-table {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 130px;
  background: #dfe1e5;
  background: var(--service-bg);
}

.servece-table-item {
  width: 100%;
  height: 55px;
  justify-content: flex-start;
}

.mbh-icon {
  width: 30px;
  height: 30px;
  margin: 0 10px;
}

.mbh-label {
  flex-grow: 1;
  justify-content: flex-start;
  /*  color: #fff;*/
  font-size: 13px;
}

.servece-table-detail {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 135px;
  right: 340px;
}

.horse-race-lamp {
  width: 335px;
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  /*  background: #fff;*/
}

.notice-down {
  width: 100%;
  height: 310px;
  background: #fff;
  overflow: hidden;
  /*  transform: translate(0, 108%);*/
}

.qr-down {
  width: 120px;
  height: 120px;
}

.qr-down-warp {
  width: 100%;
  height: 265px;
  margin-top: 40px;
  flex-wrap: wrap;
  /*align-items: flex-start;*/
}

.zi-warp {
  width: 92%;
  padding-left: 8%;
  height: auto;
  max-height: 50px;
  overflow: hidden;
}

.qr-down-btn {
  width: 40%;
  height: 42px;
  margin: 0 3% 10px 7%;
  border-radius: 8px;
  color: #fff;
  background: #66677A;
  box-shadow: -1px 3px 6px #66677A;
  position: relative;
  overflow: hidden;
}

.qr-down-btn:nth-child(2n - 1) {
  margin: 0 7% 10px 3%;
}

.active-qr-down-btn {
  background: #FD6E52;
  box-shadow: -1px 3px 6px #FD6E52;
}

.activeCategory {
  background: #ff6b4e;
  color: #fff;
  background: var(--main-color);
}

.qdb-img {
  width: 35px;
  height: auto;
  position: absolute;
  left: 0px;
  bottom: 0px;
  z-index: 100;
}

.notice-title {
  height: 40px;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  background: #dfe1e5;
  background: var(--service-bg);
  color: #666;
}

.course {
  width: 85%;
  height: auto;
  margin: 20px auto;
  background: #ffe8d2;
  background: var(--sbb-bg);
  line-height: 20px;
  font-size: 14px;
  border-radius: 6px;
  padding: 10px;
  color: #d94d37;
  color: var(--sbb-font);
  justify-content: flex-start;
}

.course-border {
  border: 1px solid #EBCED1;
}

.goods-boxA {
  height: auto;
  width: 88%;
  flex-grow: 1;
  overflow: hidden;
  justify-content: flex-start;
  margin: 20px auto 0;
  flex-wrap: wrap;
  position: relative;
}

.good-item {
  position: relative;
  box-sizing: border-box;
  width: 100px;
  height: 75px;
  flex-shrink: 1;
  color: #D94D37;
  margin-right: 5%;
  flex-wrap: wrap;
  align-content: center;
  border-radius: 8px;
  border: 2px solid rgba(0, 0, 0, .1);
  overflow: hidden;
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

.ac-good {
  border: 1px solid var(--main-color);
}


.goods-box {
  min-height: 50px;
  height: auto;
  width: 90%;
  overflow: hidden;
  justify-content: flex-start;
  margin: 20px auto 5px;
  flex-wrap: wrap;
}

.pay-item {
  box-sizing: border-box;
  width: 20%;
  min-width: 100px;
  height: 45px;
  flex-shrink: 0;
  flex-grow: 0;
  margin: 0 15px;
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

.active-pay-type {
  border: 1px solid #FF6B4E;
  color: #FF6B4E;
}













/*//2018.08.01 加入最新任务跑马灯*/

@keyframes affiche {
  0% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(-50%, 0);
  }
  50.0001% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(-50%, 0);
  }
}

.affiche {
  display: inline-block;
  white-space: nowrap;
  width: auto;
  height: 100%;
  line-height: 40px;
  animation: affiche 50s linear infinite;
}

.affiche-warp {
  width: 95%;
  height: 100%;
  overflow: hidden;
  justify-content: flex-start;
}

.new-task {
  width: 100%;
  background: #fff;
  position: absolute;
  top: 315px;
  bottom: 0;
  right: 0;
  overflow: hidden;
}

.inline-block {
  min-width: 1200px;
  display: inline-block;
}

.record-warp {
  width: 90%;
  height: 80%;
  margin: 0 auto;
  margin-top: 50px;
  overflow: hidden;
  /*	background: #000;*/
}

.record {
  width: 100%;
  height: auto;
  min-height: 100%;
  flex-wrap: wrap;
  animation: record 20s linear infinite;
}

.maincolor {
  color: #ff6b4e;
  color: var(--main-color);
  margin: 0 10px;
}

.record-item {
  width: 100%;
  min-height: 40px;
}

.weihu-btn {
  /*margin-left: 6%;*/
  max-width: 60px;
  min-width: 30px;
  height: 45px;
  padding: 0 5%;
  flex-grow: 0;
  word-spacing: normal;
  text-overflow: ellipsis;
  overflow: hidden;
  background: rgba(0, 0, 0, .5);
  -webkit-box-shadow: 2px 2px 5px rgba(0, 0, 0, .2);
  box-shadow: 2px 2px 5px rgba(0, 0, 0, .2);
  color: #fff;
  font-size: 14px;
  margin: 20px 5% 20px 6%;
  cursor: no-drop;
}

.course-img-icon {
  width: 65px;
  height: auto;
  margin: 0 5px;
  transform: translate(-10%, -10%);
}

@keyframes record {
  0% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(0, -50%);
  }
  50.0001% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(0, -50%);
  }
}

</style>
