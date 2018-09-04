<template>
  <div id="main-body" ref='mainbody'>
    <div class="main-box" id="main-box">
      <div class="notice" v-show="announcement || app.show_announcement">
        <div class="notice-title flex">系统公告</div>
        <div class="notice-content" v-html='announcement || app.announcement'></div>
        <div class="notice-down" v-if="app && app.uaid == 60002">
          <div class="notice-title flex">APP下载</div>
          <div class="qr-down-warp flex">
            <img src="http://p7o5mvmp4.bkt.clouddn.com/%E5%88%B7%E8%B5%9EiOS.png" alt="快手刷粉" v-show='downLink == 0' class="qr-down">
            <img src="http://p7o5mvmp4.bkt.clouddn.com/%E5%BF%AB%E6%89%8B%E5%AE%89%E5%8D%93.png" alt="快手刷粉" v-show='downLink == 1' class="qr-down">
            <div class="zi-warp flex">
              <img src="http://p8sxtcg6t.bkt.clouddn.com/Group%202.png" alt="快手刷粉">
            </div>
            <div class="qr-down-btn flex cursor" :class="{'active-qr-down-btn' : downLink == 0}" @click="_updataDownLink(0)">
              <img src="http://p8sxtcg6t.bkt.clouddn.com/iOS.png" alt="IOS快手刷粉" class="qdb-img">IOS</div>
            <div class="qr-down-btn flex cursor" :class="{'active-qr-down-btn' : downLink == 1}" @click="_updataDownLink(1)">
              <img src="http://p8sxtcg6t.bkt.clouddn.com/android.png" alt="Android快手刷粉" class="qdb-img">Android</div>
          </div>
        </div>
      </div>
      <div class="main-box-header flex">
        <div class="mbh-item flex" v-for="item in app.service_categories" :class="{'activeCategory':activeCategory == item.id}" @click="_chose($event,item)" v-bind:key="item.id+Math.random()">
          <img :src="item.icon" class="mbh-icon" v-if="item.icon">
          <div v-else class="mbh-icon"></div>
          <div class="mbh-label flex">{{item.label.slice(0,4)}}</div>
          <!-- <waveCanvas :cWidth="70" :cHeight="65" :cid='item.id' :ref="item.id" :id='item.id'></waveCanvas> -->
        </div>
      </div>
      <div v-loading='loading'>
        <!-- loading 开始 -->
        <div class="no-data" v-show="!showService">暂未开放此业务，请平台关注公告!</div>
        <div class="course" v-if="showService && nowServices" v-html='nowServices.tips || nowServices.des' :class="{'course-border' : uaid <= 60002}">
        </div>
        <div class="course flex" v-if="showService && nowServices && nowServices.fan_project_service" :class="{'course-border' : uaid <= 60002}" style="align-items: flex-start; padding: 0;width: 90%; flex-wrap: wrap;  background: #ffe8d2 url('http://p7o5mvmp4.bkt.clouddn.com/%E9%AB%98%E7%BA%A7%E7%89%88.png') no-repeat; background-position: 98% 98%; background-size: 60px auto;overflow: hidden;">
          <!-- <div class="course-title flex">基础版</div> -->
          <div class="course-item flex">上热门：<span class="min-span-ci flex">{{nowServices.hour}}小时</span></div>
          <div class="course-item flex">曝光时间：<span class="min-span-ci flex">{{nowServices.exposure_hour}}小时</span></div>
          <div class="course-item flex">预计点赞数:<span class="min-span-ci flex">{{nowServices.like_num}}w+</span></div>
          <div class="course-item flex">预计曝光量: <span class="min-span-ci flex">{{nowServices.exposure_num}}w+</span></div>
        </div>
        <div class="comment-box flex" v-show="nowServices && nowServices.category === 143">
          <div class="comment-box-descrpt flex">请先添加自定义评论，评论可以分为多条，总字数不能超过100字。</div>
          <el-tag :key="tag" v-for="tag in dynamicTags" closable :disable-transitions="false" @close="handleClose(tag)" type="danger">
            {{tag}}
          </el-tag>
          <!--             <el-input class="input-new-tag" v-if="true" v-model="inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
            </el-input> -->
          <div class="tag-input-warp" v-if="inputVisible && totleTga < 99">
            <input class="tag-input" v-model="inputValue" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm" @keyup.enter="handleInputConfirm" ref="saveTagInput">
          </div>
          <div v-if="!inputVisible && totleTga < 99" class="add-newcoment flex cursor" @click="showInput">增加新评论</div>
          <!--             <el-button v-else class="button-new-tag" size="small" @click="showInput">+增加新评论</el-button> -->
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
              <el-popover ref="popover4" :placement="position" :width="popoverWidth" trigger="click" v-if="nowServices && (nowServices.category>10||(nowServices.category===2 || nowServices.category===4 || nowServices.fan_project_service))">
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
              <el-button v-popover:popover4 @click="_choseShuoShuo(nowServices.category)" ref='elbutton' v-if="nowServices && (nowServices.category>10||(nowServices.category===2 || nowServices.category===4 || nowServices.fan_project_service))">{{nowServices.category > 0&&nowServices.category
                < 10 ? '获取说说列表': '查看教程'}}</el-button>
            </div>
            <div class="flex input-defult" v-if="nowServices">
              <!-- nowServices.category>0&&nowServices.category<10?'请按教程输入QQ号': '请按教程粘贴链接' -->
              <input type="text" :placeholder="placeholder" class="i-ipnput" v-model="link" @keyup.enter="_sublime(nowServices.category)">
            </div>
          </div>
          <div class="select-item" v-if="showService">
            <div class="select-item-label flex ellipsis">数量</div>
            <div class="num-limiit" v-if="nowServices && nowServices.submit_category !== 2 && !nowServices.fix_num">(<span class="red-score-sapn">{{nowServices.min_num}}</span>{{nowServices.units}}-<span class="red-score-sapn">{{nowServices.max_num}}</span>{{nowServices.units}})</div>
            <div class="flex input-defult" v-if="nowServices && nowServices.submit_category !== 2 && !nowServices.fix_num">
              <input type="text" placeholder="请填写数量" class="i-ipnput" v-model="quantity" @keyup.enter="_sublime(nowServices.category)" @keyup="_rectifyMoney" ref='quantityInput'>
            </div>
            <div class="i-input-disable flex" v-if="nowServices && nowServices.submit_category === 2 || nowServices.fix_num">{{quantity}} (固定数量)</div>
          </div>
          <div class="select-item" v-if="showService">
            <div class="select-item-label flex ellipsis">业务</div>
            <el-select v-model="choseServiceValue" placeholder="请选择" class="index-select" no-data-text="暂无业务" @change="_clear">
              <el-option v-for="item in showService" :key="item.label" :label="item.label" :value="item.id">
              </el-option>
            </el-select>
          </div>
        </div>
        <div v-if="showService && nowServices">
          <div class="chose-box ellipsis" v-if="suosuo">{{suosuo}}</div>
          <div class="rule-hints flex ellipsis" v-if="nowServices.price">
            <span class="rh-title">所需金额:</span>
            <span class="need-score-sapn">{{quantity || 0}}{{nowServices.units}} * {{parseFloat(nowServices.price) + '单价'}}= {{consumeMoney + '元'}}</span>
          </div>
          <!--           <div class="rule-hints flex ellipsis" v-if="!Gdomain">
            <span class="rh-title">所需金额:</span>
            <span class="need-score-sapn">{{quantity || 0}}{{nowServices.units}} * {{nowServices.rate + '单价'}}= {{consumeNum + '元'}}</span>
          </div> -->
          <!--           <div class="rule-hints flex ellipsis" v-if="!Gdomain">
            <span class="rh-title">剩余积分:</span>
            <span class="score-sapn">{{user.score || 0}}</span><span class="gray-span" v-if="nowServices && nowServices.submit_category !== 2">{{'(1'+nowServices.units}}{{nowServices.label + '需要'}}{{(nowServices.rate || '0') + '积分)'}}</span>
          </div> -->
          <div class="rule-hints flex ellipsis" v-if="proxyRank != '普通用户' && user.agency_level && !Gdomain && !nowServices.fan_project_service">
            <span class="rh-title">{{proxyRank}}:</span><span class="need-score-sapn">代理所需积分{{' : '+ consumeMoney + '原价'}}{{'* ' + (user.agency_level.discount || 1)*10 + '折'}} = {{agencyPrice + '元'}}</span>
          </div>
        </div>
        <div class="weihu-btn flex" v-show="showService && nowServices.behavior == 0">维护中</div>
        <div class="btn flex" @click="_sublime(nowServices.category)" v-show="showService && nowServices.behavior !== 0 && nowServices.category">提交订单</div>
        <div class="btn flex" @click="_addFanProject(nowServices.id)" v-show="showService && nowServices.behavior !== 0 && nowServices.fan_project_service">提交方案</div>
        <div class="index-bootom-height"></div>
        <!-- loading 结束 -->
      </div>
    </div>
  </div>
</template>
<script type="text/javascript">
import { getServiceCategory, getServices, addTask, getUserInfo, getShuoshuoList, addTaskTargetId, getAppInfo, getFanProject, addFanProject } from 'api/index'
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
      choseServiceValue: '',
      lodingChose: null,
      serviceCategory: false,
      services: [],
      sayList: false,
      activeCategory: false,
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
      totleTga: 0,
      dynamicTags: [],
      inputVisible: null,
      inputValue: '',
      rank: ['青铜代理', '白银代理', '黄金代理', '王者代理'],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 86400000
        }
      }
    }
  },
  created() {
    const query = this.$route.query
    if (query.token && query.tokenTime && query.sgin) {
      if (query.sgin == navigator.userAgent.slice(-10)) {
        this.setToken(query.token)
        this.setTokenTime(query.tokenTime)
        this.$root.eventHub.$emit('user')
      } else {
        if (NOWCONFIG.seo) {
          window.location.href = NOWCONFIG.seo
        }
      }
    }
    this.uaid = UAID
    this._setEnv()
    this._setPopoverWidth()
    if (this.user) {
      this.$nextTick(() => {
        this.$root.eventHub.$emit('user')
      })
    }
    // this.$root.eventHub.$emit('loaddl', true)
    // this.$root.eventHub.$emit('loadfz', true)
    this.$root.eventHub.$on('announcement', (announcement) => {
      this._setAnnouncement(announcement)
    })
    this.$root.eventHub.$emit('canvas')
  },
  // updated() {
  //   this.$nextTick(() => {
  //     if (this.$refs.pcCourse && (this.$refs.pcCourse.style.width !== `${BILI * window.screen.height}px`)) {
  //       this.$refs.pcCourse.style.width = `${BILI * window.screen.height}px`
  //       this.$refs.pcCourse.style.height = `${BILI * window.screen.height}px`
  //     }
  //   })
  //   // this.pcOrphone()
  // },
  computed: {
    nowServices() {
      let nowServer = {
        submit_category: 1
      }
      if (this.showService && this.showService.length > 0) {
        this.showService.forEach((item) => {
          if (item.id === this.choseServiceValue) {
            nowServer = item
          }
        })
      }
      if (nowServer.submit_category === 2) {
        this.quantity = nowServer.min_num
      }
      if (nowServer.fix_num) {
        this.quantity = nowServer.fix_num
      }
      return nowServer
    },
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
      if (this.nowServices.fan_project_service || this.Gdomain) {
        return Math.round(((this.quantity || 0) * (this.nowServices.price || this.nowServices.score)) * 100) / 100
      } else {
        if (this.user.agency_level) {
          return Math.round((this.quantity || 0) * (this.nowServices.price || this.nowServices.score) * (this.user.agency_level.discount || 1) * 100) / 100
        } else {
          return Math.round(((this.quantity || 0) * (this.nowServices.price || this.nowServices.score)) * 100) / 100
        }
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
      if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {} else {
        this.$router.replace({
          path: 'index'
        })
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
      if (this.netWorking) {
        this.$parent._open('提交中,请勿重复提交')
        return false
      }
      if (this.choseServiceValue === '' || !this.choseServiceValue) {
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
      let max = 0
      let min = 0
      // let price = 0
      if (this.services[this.activeCategory] && this.services[this.activeCategory].length > 0) {
        this.services[this.activeCategory].forEach((item) => {
          if (item.id === this.choseServiceValue) {
            max = item.max_num
            min = item.min_num
          }
        })
      }
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
      if (category === 143) {
        // 抖音自定义评论
        if (this.dynamicTags.length <= 0) {
          this.$parent._open('请添加评论')
          return false
        }
      }
      const reg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g
      let data = {
        services: this.nowServices,
        point: this.quantity,
        service_id: this.choseServiceValue,
        price: this.agencyPrice,
        addition: this.link.match(reg) ? this.link.match(reg)[0] : this.link
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
      if (category === 143) {
        let dynamicTags = ''
        if (this.dynamicTags && this.dynamicTags.length > 0) {
          this.dynamicTags.forEach((item) => {
            dynamicTags = dynamicTags + item + '#'
          })
        }
        data = Object.assign({ comment: dynamicTags }, data)
      }
      this.$root.eventHub.$emit('showPopup', data)
    },
    _addFanProject() {
      if (!this.user) {
        this.$parent._open('请先登录哦')
        return
      }
      if (this.proxyRank == '普通用户' || !this.user.agency_level) {
        this.$parent._open('您还不是代理')
        return
      }
      if (!this.link || this.link.indexOf('http') < 0) {
        this.$parent._open('请正确填写')
        return false
      }
      const reg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g
      let data = {
        services: this.nowServices,
        price: this.agencyPrice,
        fan_project_id: this.nowServices.id,
        addition: this.link.match(reg) ? this.link.match(reg)[0] : this.link,
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
    _getFanProject() {
      this.loading = true
      getFanProject().then((res) => {
        this.lodingChose = false
        this.loading = false
        if (res.data.err_code === SUCCESS_CODE) {
          const services = this._formatFanProject(res.data.data)
          this.services[this.activeCategory] = services
          this.showService = services
          if (res.data.data) {
            // this.nowServices = this.showService[0]
            this.choseServiceValue = this.showService[0] ? this.showService[0].id : ''
            this.quantity = 1
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
    _formatFanProject(list) {
      if (list && list.length > 0) {
        list.forEach((item) => {
          item.fix_num = 1
        })
      }
      return list
    },
    _chose(e, item) {
      //  分界线
      const id = item.id
      if (this.lodingChose) {
        this.$parent._open('加载中')
        return 0
      }
      if (!this.services[id]) {
        if (item.category == 14) {
          this._getFanProject()
        } else {
          this.lodingChose = true
          this._getServices(this, id, this.Gdomain)
        }
      } else {
        this.showService = this.services[id]
        this.choseServiceValue = this.showService[0] ? this.showService[0].id : ''
      }
      this.link = ''
      this.quantity = ''
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
    // _normalShowService(services) {
    //   console.log(services)
    //   if (services.form.indexOf('[{') > -1 && services.form.indexOf('}]') > -1) {
    //     services.form = eval(services.form)
    //   }
    //   return services
    // },
    _initNet() {
      if (this.app.service_categories.length > 0) {
        this.activeCategory = this.app.service_categories[0].id
        if (this.app.service_categories[0].category == 14) {
          this._getFanProject()
        } else {
          this._getServices(this, this.app.service_categories[0].id, this.Gdomain) // 服务
        }
      }
    },
    // _getServiceCategory(that, domain) {
    //   getServiceCategory(domain).then((res) => {
    //     if (res.data.err_code === SUCCESS_CODE) {
    //     } else {
    //       if (res.data.err_msg) {
    //         this.$parent._open(this.$root.errorCode[res.data.err_code])
    //       } else {
    //         this.$parent._open('似乎出错了')
    //       }
    //     }
    //   })
    // },
    _getServices(that, id, Gdomain) {
      this.loading = true
      getServices(id, Gdomain).then((res) => {
        this.lodingChose = false
        this.loading = false
        if (res.data.err_code === SUCCESS_CODE) {
          const services = this._formatService(res.data.data)
          that.services[that.activeCategory] = services
          that.showService = services
          if (res.data.data) {
            that.choseServiceValue = that.showService[0] ? that.showService[0].id : ''
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
    _formatService(list) {
      if (list && list.length) {
        list.forEach((item) => {
          if (item.max_num === item.min_num) {
            item.fix_num = item.min_num
          }
        })
      }
      return list
    },
    _comTotleTga() {
      let totle = 0
      if (this.dynamicTags && this.dynamicTags.length > 0) {
        this.dynamicTags.forEach((item) => {
          totle = totle + item.length
        })
      }
      this.totleTga = totle
    },
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
      this._comTotleTga()
    },

    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.focus()
      });
    },

    handleInputConfirm() {
      let inputValue = this.inputValue
      if (inputValue) {
        if (inputValue.length + this.totleTga >= 100) {
          this.$parent._open('评论总字数不能超过100')
        } else {
          this.dynamicTags.push(inputValue)
        }
      }
      this.inputVisible = false
      this.inputValue = ''
      this._comTotleTga()
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
.mbh-item {
  height: 65px;
  min-width: 60px;
  max-width: 70px;
  flex-grow: 1;
  width: auto;
  flex-wrap: wrap;
  align-content: center;
  position: relative;
}

.activeCategory {
  background: #ff6b4e;
  background: var(--main-color);
  /*animation: activeCategory .3s ease 1 forwards;*/
}

@keyframes activeCategory {
  0% {
    background: #dcdcdc;
  }
  100% {
    background: #ff9430;
  }
}

@keyframes labelColor {
  0% {
    color: #666;
  }
  100% {
    color: #fff;
  }
}

.mbh-item:hover {
  cursor: pointer;
}

.mbh-item:hover .mbh-label {
  animation: color .2s ease 1 forwards;
}

.activeCategory .mbh-label {
  color: #fff;
  /*animation: labelColor .35s ease 1 forwards;*/
}

.activeCategory:hover .mbh-label {
  animation: none;
  color: #fff !important;
}

.mbh-icon {
  position: absolute;
  z-index: 2;
  left: 50%;
  top: 12%;
  transform: translate(-50%, 0);
  width: 30px;
  height: 30px;
  pointer-events: none;
}

.mbh-label {
  position: absolute;
  z-index: 2;
  left: 50%;
  bottom: 12%;
  transform: translate(-50%, 0);
  width: 100%;
  flex-shrink: 0;
  color: #666;
  font-size: 13px;
  pointer-events: none;
}

.main-box-header {
  width: 100%;
  min-height: 65px;
  height: auto;
  flex-wrap: wrap;
  justify-content: flex-start;
  background: #dfe1e5;
  background: var(--service-bg);
}

@keyframes color {
  0% {
    color: #666;
  }
  100% {
    color: #d94d37;
  }
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
}

.course-border {
  border: 1px solid #EBCED1;
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

.width100 {
  width: 100% !important;
}

.i-ipnput:focus {
  border-bottom: 1px solid #ff9430;
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





























/* 60002 加入下载框*/

.notice-down {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: auto;
  background: #fff;
  transform: translate(0, 108%);
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

.qdb-img {
  width: 35px;
  height: auto;
  position: absolute;
  left: 0px;
  bottom: 0px;
  z-index: 100;
}

















/* 抖音自定义评论 */

.comment-box {
  width: 83%;
  height: auto;
  margin: 20px auto;
  overflow: hidden;
  padding: 1% 2%;
  background: var(--sbb-bg);
  border-radius: 10px;
  line-height: 20px;
  color: #d94d37;
  color: var(--sbb-font);
  flex-wrap: wrap;
  justify-content: flex-start;
}

.el-tag+.el-tag {
  margin: 5px;
  overflow: hidden;
  /*  position: relative;*/
}

.add-newcoment {
  width: 100px;
  height: 30px;
  font-size: 12px;
  border-radius: 10px;
  background: #ff6b4e;
  background: var(--main-color);
  color: #fff;
  margin: 5px;
}

.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}

.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}

.tag-input-warp {
  width: 100px;
  background-color: rgba(245, 108, 108, .1);
  color: #f56c6c;
  padding: 0 10px;
  height: 30px;
  line-height: 30px;
  font-size: 12px;
  color: #409EFF;
  border-radius: 4px;
  box-sizing: border-box;
  border: 1px solid rgba(245, 108, 108, .2);
  white-space: nowrap;
  margin: 5px;
}

.tag-input-warp input {
  border: none;
  outline: none;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0);
  color: #f56c6c;
}

.comment-box-descrpt {
  width: 100%;
  height: 40px;
  justify-content: flex-start;
}

.course-title {
  background: #FFD8C0;
  color: #FF6B4E;
  font-size: 18px;
  width: 100%;
  height: 45px;
  margin-bottom: 10px;
}

.course-item {
  width: 100%;
  height: 40px;
  color: #FF6B4E;
  margin: 10px auto;
}

</style>
