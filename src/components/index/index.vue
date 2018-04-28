<template>
  <div id="main-body" ref='mainbody'>
    <div class="main-box" id="main-box">
      <div class="main-box-header flex">
        <div class="mbh-item flex" v-for="item in app.service_categories" :class="{'activeCategory':activeCategory == item.id}" @click="_chose($event,item.id)" v-bind:key="item.id+Math.random()">
          <img :src="item.icon" class="mbh-icon" v-if="item.icon">
          <div v-else class="mbh-icon"></div>
          <div class="mbh-label flex">{{item.label}}</div>
          <!-- <waveCanvas :cWidth="70" :cHeight="65" :cid='item.id' :ref="item.id" :id='item.id'></waveCanvas> -->
        </div>
      </div>
      <div class="course" v-if="nowServices" v-html='nowServices.tips'>
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
        <div class="select-item">
          <div class="select-item-label flex ellipsis">
            <span v-if="nowServices">{{nowServices.form || '链接'}}</span>
            <el-popover ref="popover4" :placement="position" :width="popoverWidth" trigger="click" v-if="nowServices && (nowServices.category>10||(nowServices.category===2 || nowServices.category===4) && link)">
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
            <el-button v-popover:popover4 @click="_choseShuoShuo(nowServices.category)" ref='elbutton' v-if="nowServices && (nowServices.category>10||(nowServices.category===2 || nowServices.category===4) && link)">{{nowServices.category > 0&&nowServices.category
              < 10 ? '获取说说列表': '查看教程'}}</el-button>
          </div>
          <div class="flex input-defult" v-if="nowServices">
            <!-- nowServices.category>0&&nowServices.category<10?'请按教程输入QQ号': '请按教程粘贴链接' -->
            <input type="text" :placeholder="placeholder" class="i-ipnput" v-model="link" @keyup.enter="_sublime(nowServices.category)">
          </div>
        </div>
        <div class="select-item">
          <div class="select-item-label flex ellipsis">数量</div>
          <div class="num-limiit" v-if="nowServices">(<span class="red-score-sapn">{{nowServices.min_num}}</span>{{nowServices.units}}-<span class="red-score-sapn">{{nowServices.max_num}}</span>{{nowServices.units}})</div>
          <div class="flex input-defult">
            <input type="text" placeholder="请填写数量" class="i-ipnput" v-model="quantity" @keyup.enter="_sublime(nowServices.category)" @keyup="_rectifyMoney" ref='quantityInput'>
          </div>
        </div>
        <div class="select-item">
          <div class="select-item-label flex ellipsis">业务</div>
          <el-select v-model="choseServiceValue" placeholder="请选择" class="index-select" v-if="showService" no-data-text="暂无业务" @change="_clear">
            <el-option v-for="item in showService" :key="item.label" :label="item.label" :value="item.id">
            </el-option>
          </el-select>
        </div>
      </div>
      <div v-if="nowServices">
        <div class="chose-box ellipsis" v-if="suosuo">{{suosuo}}</div>
        <div class="rule-hints flex ellipsis">
          <span class="rh-title">所需积分:</span>
          <span class="need-score-sapn">{{quantity || 0}}{{nowServices.units}} * {{nowServices.rate + '单价'}}= {{consumeNum + '积分'}}</span>
          <!-- <span v-if="user.discount!==1 && user">{{'* ' + (user.discount || 1)*10 + '折'}}</span> -->
        </div>
        <div class="rule-hints flex ellipsis">
          <span class="rh-title">剩余积分:</span>
          <span class="score-sapn">{{user.score || 0}}</span><span class="gray-span">{{'(1'+nowServices.units}}{{nowServices.label + '需要'}}{{(nowServices.rate || '0') + '积分)'}}</span>
        </div>
        <div class="rule-hints flex ellipsis" v-if="proxyRank != '普通用户' && user.agency_level">
          <span class="rh-title">{{proxyRank}}:</span><span class="need-score-sapn">代理折扣后所需积分{{' : '+consumeNum + '原价'}}{{'* ' + (user.agency_level.discount || 1)*10 + '折'}} = {{agencyPrice + '积分'}}</span>
          <!-- <span class="max-gray-span">最小数量</span><span class="red-score-sapn">{{nowServices.min_num}}</span><span class="max-gray-span no-indent">-最大数量</span><span class="red-score-sapn">{{nowServices.max_num}}</span> -->
        </div>
      </div>
      <div class="btn flex" @click="_sublime(nowServices.category)">提交订单</div>
      <div class="agent-box" v-if="false">
        <div class="main-box-header flex agent-box-title">
        </div>
      </div>
    </div>
  </div>
</template>
<script type="text/javascript">
import { getServiceCategory, getServices, addTask, getUserInfo, getShuoshuoList, addTaskTargetId, getAppInfo } from 'api/index'
import { testToken } from 'common/js/util'
import { mapGetters, mapMutations } from 'vuex'
import { SUCCESS_CODE, modifyEnv } from 'api/config'
const BILI = 0.8
export default {
  data() {
    return {
      popoverWidth: 1000,
      link: '',
      orderTimeD: '',
      orderTimeS: '',
      quantity: '',
      shuoshuoPage: 0,
      choseServiceValue: '',
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
      choseSay: false,
      sublimeTime: false,
      // agencyPrice: null,
      position: 'right',
      closeName: '关闭',
      rank: ['青铜代理', '白银代理', '黄金代理', '王者代理'],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 86400000
        }
      }
    }
  },
  // updated() {
  //   if (!this.init) {
  //     this._initNet()
  //   }
  // },
  created() {
    this._setEnv()
    this._setPopoverWidth()
    this._getAppInfo(this)
    if (this.user) {
      this.$nextTick(() => {
        this.$root.eventHub.$emit('user')
      })
    }
    this.$root.eventHub.$emit('canvas')
    // this.$root.eventHub.$emit('IndexInit')
  },
  updated() {
    this.$nextTick(() => {
      if (this.$refs.pcCourse && (this.$refs.pcCourse.style.width !== `${BILI * window.screen.height}px`)) {
        this.$refs.pcCourse.style.width = `${BILI * window.screen.height}px`
        this.$refs.pcCourse.style.height = `${BILI * window.screen.height}px`
      }
    })
  },
  computed: {
    nowServices() {
      let nowServer
      if (this.showService) {
        this.showService.forEach((item) => {
          if (item.id === this.choseServiceValue) {
            nowServer = item
          }
        })
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
      // * (this.user.discount || 1))
    },
    agencyPrice() {
      if (this.user.agency_level) {
        return Math.ceil((this.quantity || 0) * this.nowServices.rate * (this.user.agency_level.discount || 1))
      } else {
        return Math.ceil((this.quantity || 0) * this.nowServices.rate)
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
    _setEnv() {
      const query = this.$route.query
      if (query.env === 'dev') {
        this.$root.eventHub.$emit('env')
        modifyEnv()
      }
    },
    _closeCourse() {
      // console.log(this.$refs.elbutton)
      this.$refs.elbutton.$el.click()
    },
    _choseSayList(item) {
      this.$refs.quantityInput.click()
      if (item) {
        this.targetid = item.tid
        this.suosuo = item.content
      }
      // this.suosuo = 0
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
      let rate = 0
      this.services[this.activeCategory].forEach((item) => {
        if (item.id === this.choseServiceValue) {
          max = item.max_num
          min = item.min_num
          rate = item.rate
        }
      })
      if (!max || !rate) {
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
        console.log(H)
        console.log(M)
        console.log(this.orderTimeD / 1000 + H + M)
        this.sublimeTime = this.orderTimeD / 1000 + H + M
        // return false
      }
      let price
      if (this.user.agency && this.user.agency_level.discount < 1) {
        // agencyPrice
        if (this.agencyPrice > this.user.score) {
          this.$parent._open('积分不足')
          this.$root.eventHub.$emit('showPopup')
          return false
        }
        price = this.agencyPrice
      } else {
        if (this.consumeNum > this.user.score) {
          this.$parent._open('积分不足')
          this.$root.eventHub.$emit('showPopup')
          return false
        }
        price = this.consumeNum
      }
      if (category === 2 || category === 4) {
        addTask(price, this.quantity, this.token, this.choseServiceValue, this.link, this.targetid).then((res) => {
          this._afterAddtask(res)
        })
        return true
      }
      if (category === 24 || category === 25) {
        addTask(price, this.quantity, this.token, this.choseServiceValue, this.link, false, this.sublimeTime).then((res) => {
          this._afterAddtask(res)
        })
        return true
      }
      addTask(price, this.quantity, this.token, this.choseServiceValue, this.link).then((res) => {
        this._afterAddtask(res)
      })
    },
    _afterAddtask(res) {
      this.orderTimeD = ''
      this.orderTimeS = ''
      this.link = ''
      this.quantity = ''
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
        this.$parent._open('请输入QQ号')
        return
      }
      if (this.link.length < 5) {
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
        // console.log('登录已失效 checkTock')
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
      if (!this.services[id]) {
        this._getServices(this, id)
      } else {
        this.showService = this.services[id]
        this.choseServiceValue = this.showService[0] ? this.showService[0].id : ''
      }
      this.link = ''
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
      this.activeCategory = this.app.service_categories[0].id
      this._getServices(this, this.app.service_categories[0].id) // 服务
    },
    _getServiceCategory(that) {
      getServiceCategory().then((res) => {
        if (res.data.err_code === SUCCESS_CODE) {
          that.serviceCategory = res.data.data
          that.activeCategory = res.data.data[0].id
          that._getServices(that, res.data.data[0].id) // 服务
        } else {
          if (res.data.err_msg) {
            this.$parent._open(this.$root.errorCode[res.data.err_code])
          } else {
            this.$parent._open('似乎出错了')
          }
        }
      })
    },
    _getServices(that, id) {
      // const that = this
      getServices(id).then((res) => {
        if (res.data.err_code === SUCCESS_CODE) {
          const services = this._normalServices(res.data.data)
          that.services[that.activeCategory] = services
          that.showService = services
          that.choseServiceValue = that.showService[0] ? that.showService[0].id : ''
        } else {
          if (res.data.err_msg) {
            this.$parent._open(this.$root.errorCode[res.data.err_code])
          } else {
            this.$parent._open('似乎出错了')
          }
        }
      })
    },
    _normalServices(list) {
      // list.forEach((item) => {
      //   if (typeof item.form === 'string') {
      //     if (item.form.indexOf('[{') > -1 && item.form.indexOf('}]') > -1) {
      //       item.form = eval(item.form)
      //     }
      //   }
      // })
      // console.log(list)
      return list
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
  background-color: #ffe8d2;
  border: 1px solid #EBCED1;
  line-height: 20px;
  font-size: 14px;
  border-radius: 6px;
  padding: 10px;
  color: #d94d37;
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
  /* letter-spacing: 5px;*/
}

.el-button {
  height: 100%;
  line-height: 0px !important;
  background: rgba(255, 255, 255, 0) !important;
  color: #d94d37;
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
  /*color: var(--main-color);*/
}

.max-gray-span {
  text-indent: 10px;
  color: #353535;
}

.i-ipnput {
  text-indent: 15px;
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

</style>
