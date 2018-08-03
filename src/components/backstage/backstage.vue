<template>
  <div id="main-body" ref='mainbody' @click="_mainBody">
    <div class="main-box flex" id="main-box" v-if="user">
      <b-agent></b-agent>
      <div class="back-servce-box">
        <div class="service-item flex title-bsb">业务选择</div>
        <div v-for="item in app.service_categories" class="service-item flex cursor" :class="{'activeCategory':activeCategory == item.id}" @click="_chose($event,item.id)" v-bind:key="item.id+Math.random()">
          {{item.label}}
          <i class="active-icon el-icon-d-arrow-right shpc"></i>
        </div>
      </div>
      <div class="segmenting-line"></div>
      <div class="back-servce-info" v-loading='loading'>
        <!-- <div class="course" v-if="showService && nowServices">{{nowServices.tips}}</div> -->
        <!--         <div class="cr-item flex">
          <div class="cr-box-tit ellipsis flex">分站名称:</div>
          <div class="cr-box-min flex">{{user.agency.sub_site.site_name}}</div>
          <div class="cr-box-btn mg-btn flex cursor" @click="toEdit">分站编辑</div>
        </div> -->
        <div v-if="nowServices">
          <div class="cr-item flex">
            <div class="cr-box-tit ellipsis flex">首页公告:</div>
            <div class="cr-box-max flex" v-html="nowServices.tips">
            </div>
          </div>
          <div class="cr-st-line"></div>
          <div class="cr-item flex">
            <div class="cr-box-tit ellipsis flex">商品选择:</div>
            <div class="cr-box-min flex margin-right cursor" @click.stop="_choseservce">
              {{nowServices.label}}
              <div class="select-servce flex" v-show="showSC">
                <div class="select-servce-item flex" v-for="item in showService" @click="_nowServce(item)">{{item.label}}</div>
              </div>
              <i class="el-icon-d-caret cr-box-icon"></i>
            </div>
          </div>
          <div class="cr-item flex">
            <div class="cr-box-tit ellipsis flex">{{nowServices.form || '链接输入'}}:</div>
            <div class="cr-box-min flex margin-right">
              <div class="flex input-defult">
                <input type="text" :placeholder="placeholder" class="i-ipnput" v-model="link" @keyup.enter="_sublime(nowServices.category)">
              </div>
            </div>
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
            <el-button v-popover:popover4 @click.stop="_choseShuoShuo(nowServices.category)" ref='elbutton' v-if="nowServices && (nowServices.category>10||(nowServices.category===2 || nowServices.category===4))">{{nowServices.category > 0&&nowServices.category
              < 10 ? '获取说说': '查看教程'}} </el-button>
          </div>
          <div class="cr-item flex" v-show='nowServices && (nowServices.category === 24 || nowServices.category === 25)'>
            <div class="cr-box-tit ellipsis flex">预约时间:</div>
            <div class="cr-box-min flex margin-right over-hidden">
              <el-date-picker v-model="orderTimeD" type="date" placeholder="选择日期" :picker-options="pickerOptions" value-format='timestamp' format='yyyy-MM-dd' ref='pickerD'>
              </el-date-picker>
              <el-time-select v-model="orderTimeS" :picker-options="{start: '00:00',step: '00:30',end: '23:30'}" placeholder="选择时间" value-format='timestamp' ref='pickerS'>
              </el-time-select>
              <<img src="../../assets/logo.png" alt="" @load="_setBG" v-show='false'>
            </div>
          </div>
          <div class="cr-item flex">
            <div class="cr-box-tit ellipsis flex">商品数量:</div>
            <div class="cr-box-min flex margin-right">
              <div class="flex input-defult" v-if="nowServices && nowServices.submit_category !== 2">
                <input type="text" placeholder="请填写数量" class="i-ipnput" v-model="quantity" @keyup.enter="_sublime(nowServices.category)" @keyup="_rectifyMoney" ref='quantityInput'>
              </div>
              <div class="i-input-disable flex" v-if="nowServices && nowServices.submit_category === 2">{{quantity}} (固定数量)</div>
              <div class="num-tips flex" v-show='nowServices.submit_category != 2'>注: 下单数量范围：{{nowServices.min_num}} ~ {{nowServices.max_num}}</div>
            </div>
          </div>
          <div class="cr-item flex">
            <div class="cr-box-tit ellipsis flex">所需金额:</div>
            <div class="cr-box-min flex margin-right">{{quantity || 0}}{{nowServices.units}} * {{nowServices.price + '单价'}}= {{consumeMoney + '元'}}</div>
          </div>
          <div class="cr-item flex">
            <div class="cr-box-tit ellipsis flex">代理折后:</div>
            <div class="cr-box-min flex margin-right">{{consumeMoney + '原价'}}{{'* ' + (user.agency_level? user.agency_level.discount || 1 : 1 )*10 + '折'}} = {{agencyPrice + '元'}}</div>
          </div>
          <div class="btn-back flex cursor" @click="_sublime(nowServices.category)" v-show="showService">提交订单</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script type="text/javascript">
import { getServiceCategory, getServices, addTask, getUserInfo, getShuoshuoList, addTaskTargetId, getAppInfo } from 'api/index'
import { mapGetters, mapMutations } from 'vuex'
import BAgent from 'components/backstage-banner/backstage-banner'
import { SUCCESS_CODE } from 'api/config'
import { testToken } from 'common/js/util'
import { NOWCONFIG } from 'api/appConfig'
const BILI = 0.8
export default {
  data() {
    return {
      Gdomain: null,
      activeCategory: 1,
      lodingChose: null,
      showService: false,
      services: [],
      link: '',
      quantity: '',
      orderTimeD: '',
      orderTimeS: '',
      suosuo: false,
      pc: true,
      loading: null,
      showSC: false,
      sayList: false,
      choseSay: false,
      lodingS: false,
      position: 'right',
      closeName: '关闭',
      popoverWidth: 950,
      nowServicesCategory: ''
    }
  },
  created() {
    const query = this.$route.query
    if (query.token && query.tokenTime && query.sgin) {
      if (query.sgin == navigator.userAgent.slice(-10)) {
        this.setToken(query.token)
        this.setTokenTime(query.tokenTime)
      } else {
        window.location.href = NOWCONFIG.seo
      }
    }
    if (!this.app) {
      this._getAppInfo(this)
    } else {
      this._initNet()
    }
    this._updataUser()
  },
  computed: {
    placeholder() {
      return this.nowServicesCategory > 0 && this.nowServicesCategory < 10 ? '请输入QQ号' : this.nowServicesCategory === 24 || this.nowServicesCategory === 25 ? '请按教程粘贴快手ID' : '请按教程粘贴链接'
    },
    consumeMoney() {
      if (this.nowServices.price) {
        return (this.quantity || 0) * this.nowServices.price
      } else {
        return false
      }
    },
    agencyPrice() {
      if (this.user.agency_level) {
        return Math.floor((this.quantity || 0) * this.nowServices.price * (this.user.agency_level.discount || 1) * 100) / 100
      } else {
        return Math.floor(((this.quantity || 0) * this.nowServices.price) * 100) / 100
      }
    },
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
    ...mapGetters([
      'user',
      'token',
      'tokenTime',
      'app'
    ])
  },
  // updated() {
  //   this.$nextTick(() => {
  //     console.log(this.$refs.picker)
  //   })
  // },
  methods: {
    _updataUser() {
      if (!this.checkTock()) {
        return false
      }
      getUserInfo(this.token).then((res) => {
        if (res.data.err_code === SUCCESS_CODE) {
          this.setUser(res.data.data)
        } else {
          if (res.data.err_msg) {
            this.$parent._open(this.$root.errorCode[res.data.err_code])
          } else {
            this.$parent._open('似乎出错了')
          }
        }
      })
    },
    _setBG() {
      let pd = this.$refs.pickerD.$el.children[0]
      let ps = this.$refs.pickerS.$el.children[0]
      pd.style.backgroundColor = '#f4f4f4'
      ps.style.backgroundColor = '#f4f4f4'
      pd.style.height = '46px'
      ps.style.height = '46px'
    },
    _nowServce(item) {
      // console.log(item)
      this.nowServices = item
      this.nowServicesCategory = this.nowServices.category
      this._clear()
      if (this.nowServices.submit_category === 2) {
        this.quantity = this.nowServices.min_num
      }
    },
    _choseservce() {
      this.showSC = !this.showSC
    },
    _mainBody() {
      if (this.showSC) {
        this.showSC = false
      }
    },
    _closeCourse() {
      this.$refs.elbutton.$el.click()
    },
    _getAppInfo(that) {
      getAppInfo().then((res) => {
        if (res.data.err_code === SUCCESS_CODE && res.data.data) {
          if (res.data.data.score_rate) {
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
    _initNet() {
      if (this.app.service_categories.length > 0) {
        this.activeCategory = this.app.service_categories[0].id
        this._getServices(this, this.app.service_categories[0].id, this.Gdomain) // 服务
      }
    },
    _chose(e, id) {
      if (this.lodingChose) {
        this.$parent._open('加载中')
        return 0
      }
      this.link = ''
      this.quantity = ''
      this.suosuo = false
      this.activeCategory = id
      if (!this.services[id]) {
        this.lodingChose = true
        this._getServices(this, id, this.Gdomain)
      } else {
        this.showService = this.services[id]
        this.nowServices = this.showService[0]
        this.nowServicesCategory = this.nowServices.category
        if (this.nowServices.submit_category === 2) {
          this.quantity = this.nowServices.min_num
        }
      }
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
    _choseShuoShuo(category) {
      // console.log(category)
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
    checkTock() {
      if (!testToken(this.tokenTime)) {
        this.setUser(false)
        this.setToken(false)
        this.setTokenTime(false)
        window.location.href = NOWCONFIG.seo + '/login'
        return false
      }
      return true
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
    _getServices(that, id, Gdomain) {
      this.loading = true
      getServices(id, Gdomain).then((res) => {
        this.lodingChose = false
        this.loading = false
        if (res.data.err_code === SUCCESS_CODE) {
          const services = res.data.data
          that.services[that.activeCategory] = services
          that.showService = services
          that.nowServices = that.showService[0]
          that.nowServicesCategory = that.nowServices.category
          if (that.nowServices.submit_category === 2) {
            that.quantity = that.nowServices.min_num
          }
          // if (res.data.data) {
          //   that.choseServiceValue = that.showService[0] ? that.showService[0].id : ''
          // }
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
      // this.loading = true
      if (this.netWorking) {
        this.$parent._open('提交中,请勿重复提交')
        return false
      }
      // console.log(this.nowServices)
      if (!this.nowServices.id) {
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
      // let data = {
      //   services: this.nowServices,
      //   point: this.quantity,
      //   service_id: this.nowServices.id,
      //   price: this.agencyPrice,
      //   addition: this.link
      // }
      // if (this.Gdomain) {
      //   data = Object.assign({ sub_domain: this.Gdomain }, data)
      // }
      // if (category === 2 || category === 4) {
      //   data = Object.assign({ target_id: this.targetid }, data)
      // }
      // if (category === 24 || category === 25) {
      //   data = Object.assign({ target_id: false, appointment_time: this.sublimeTime }, data)
      // }
      // this.$root.eventHub.$emit('showPopup', data)
      // else {
      // }
      let price
      if (this.user.agency && this.user.agency_level && this.user.agency_level.discount < 1) {
        if (this.agencyPrice > this.user.score) {
          this.$parent._open('余额不足')
          this.$root.eventHub.$emit('showPopup')
          return false
        }
        price = this.agencyPrice
      } else {
        if (this.agencyPrice > this.user.score) {
          this.$parent._open('余额不足')
          this.$root.eventHub.$emit('showPopup')
          return false
        }
        price = this.agencyPrice
      }
      this.netWorking = true
      if (category === 2 || category === 4) {
        addTask(price, this.quantity, this.token, this.nowServices.id, this.link, this.targetid).then((res) => {
          this._afterAddtask(res)
        })
        return true
      }
      if (category === 24 || category === 25) {
        addTask(price, this.quantity, this.token, this.nowServices.id, this.link, false, this.sublimeTime).then((res) => {
          this._afterAddtask(res)
        })
        return true
      }
      addTask(price, this.quantity, this.token, this.nowServices.id, this.link).then((res) => {
        this._afterAddtask(res)
      })
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
    ...mapMutations({
      setToken: 'SET_TOKEN',
      setUser: 'SET_USER',
      setApp: 'SET_APP',
      setTokenTime: 'SET_TOKENTIME'
    })
  },
  components: {
    BAgent
  },
}

</script>
<style type="text/css" scoped>
.main-box {
  justify-content: flex-start;
  align-items: flex-start;
  opacity: .95;
  padding-bottom: 40px;
}

.back-servce-box {
  width: 18%;
  /*  min-width: 100px;*/
  height: 100%;
  position: relative;
}

.back-servce-info {
  padding-left: 20px;
  width: 0;
  flex-grow: 1;
  height: auto;
  /*  background: red;*/
}

.segmenting-line {
  width: 20px;
  position: absolute;
  left: 18%;
  top: 0;
  bottom: 0;
  background: #F4F4F4;
}

.cr-box-tit {
  flex-shrink: 0;
}

.service-item {
  box-sizing: border-box;
  width: 100%;
  height: 50px;
  /*text-indent: -20px;*/
  border-bottom: 1px solid #F0F0F0;
  position: relative;
}

.activeCategory {
  border-left: 5px solid rgba(255, 210, 54, 1);
  text-indent: -4px;
  background: #F4F4F4;
}

.active-icon {
  font-size: 20px;
  color: #FFD236;
  position: absolute;
  right: 5px;
  top: 50%;
  z-index: 999;
  transform: translate(0, -50%);
  opacity: 0;
}

.activeCategory .active-icon {
  opacity: 1;
}

.title-bsb {
  background: rgba(255, 210, 54, 1);
}

.cr-box-max {
  padding: 1%;
  border: 1px solid #DFDFDF;
  text-indent: 0px;
}

.cr-box-min {
  border: 1px solid #DFDFDF;
  margin: 0 20px 0 10px;
  position: relative;
}

.select-servce {
  box-sizing: content-box;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: auto;
  flex-wrap: wrap;
  border: 1px solid #f4f4f4;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
  z-index: 99999;
  transform: translate(0, 42px);
  overflow: hidden;
}

.select-servce-item {
  height: 45px;
  width: 100%;
  justify-content: flex-start;
  text-indent: 10px;
  border-bottom: 1px solid #f4f4f4;
  background: #fff;
}

.select-servce-item:hover {
  cursor: pointer;
  background: rgba(255, 210, 54, 1);
}

.cr-box-icon {
  font-size: 16px;
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translate(0, -50%);
  color: #9B9B9B;
}

.cr-st-line {
  width: 100%;
  height: 2px;
  background: #F4F4F4;
  margin: 30px 0 -10px 0;
}

.num-tips {
  width: 100%;
  height: 40px;
  position: absolute;
  bottom: 0;
  left: 0;
  transform: translate(0, 40px);
  justify-content: flex-start;
  color: #FF9C1A;
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
  background: #FFD236;
  border-radius: 10px;
  color: #353535;
}

.el-button {
  height: 46px;
  width: 100px;
  line-height: 0px !important;
  background: #FFD236 !important;
  color: #353535;
  font-size: 15px;
  padding: 0;
  border: none !important;
  margin-right: 20px;
}

.el-button:hover {
  color: #353535 !important;
}

.p-course-box:hover {
  cursor: pointer !important;
}

.course-img {
  pointer-events: none !important;
}

.input-defult {
  border: none;
}

.i-ipnput {
  background: #f4f4f4;
  text-indent: 10px;
}

.input-defult:hover {
  animation: none;
}

.i-input-disable {
  color: rgba(0, 0, 0, .4);
}

.btn-back {
  width: 90px;
  padding: 0 5%;
  height: 45px;
  margin: 40px auto -20px;
  background: #FFD236;
}

.over-hidden {
  overflow: hidden;
}

</style>
