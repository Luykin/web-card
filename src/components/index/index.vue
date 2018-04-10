<template>
  <div id="main-body">
    <div class="main-box" id="main-box">
      <div class="main-box-header flex">
        <div class="mbh-item flex" v-for="item in app.service_categories" :class="{'activeCategory':activeCategory == item.id}" @click="_chose(item.id)" v-bind:key="item.id+Math.random()">
          <img :src="item.icon" class="mbh-icon" v-if="item.icon">
          <div v-else class="mbh-icon"></div>
          <div class="mbh-label flex">{{item.label}}</div>
        </div>
      </div>
      <div class="course" v-if="nowServices" v-html='nowServices.tips'>
      </div>
      <div class="select-box flex">
        <div class="select-item">
          <div class="select-item-label flex">
            <span v-if="nowServices">{{nowServices.category>0&&nowServices.category < 10 ? 'QQ号': '链接/快手号,抖音号'}}</span>
            <el-popover ref="popover4" placement="right" :width="popoverWidth" trigger="click" v-if="nowServices && (nowServices.category>10||(nowServices.category===2 || nowServices.category===4) && link && !hiddenPop)">
              <div class="p-course-box" v-if="nowServices">
                <div v-if="!nowServices.tutorials && (nowServices.category!==2 && nowServices.category!==4)" class="flex no-tutorials">暂无教程</div>
                <div v-if="(nowServices.category ===2 || nowServices.category===4) && !sayList && !lodingS" class="flex no-tutorials">您输入的QQ号无效或无权限访问此QQ号空间</div>
                <div class="flex no-tutorials loding" v-if="lodingS">加载中</div>
                <img :src="nowServices.tutorials" class="course-img" v-if="nowServices.tutorials && (nowServices.category!==2 && nowServices.category!==4)">
                <div v-if="sayList && (nowServices.category ===2 || nowServices.category ===4)" v-for="item in sayList" class="say-list-item" @click="_choseSayList(item)">
                  {{item.content}}
                </div>
              </div>
            </el-popover>
            <el-button v-popover:popover4 @click="_choseShuoShuo(nowServices.category)" v-if="nowServices && (nowServices.category>10||(nowServices.category===2 || nowServices.category===4) && link && !hiddenPop)">{{nowServices.category > 0&&nowServices.category
              < 10 ? '获取说说列表': '查看教程'}}</el-button>
          </div>
          <div class="flex input-defult" v-if="nowServices">
            <input type="text" :placeholder="nowServices.category>0&&nowServices.category<10?'请按教程输入QQ号': '请按教程粘贴链接'" class="i-ipnput" v-model="link" @keyup.enter="_sublime(nowServices.category)">
          </div>
        </div>
        <div class="select-item">
          <div class="select-item-label flex">数量</div>
          <div class="flex input-defult">
            <input type="text" placeholder="请填写数量" class="i-ipnput" v-model="quantity" onkeyup="value=value.replace(/[^\d]/g,'') " ng-pattern="/[^a-zA-Z]/" @keyup.enter="_sublime(nowServices.category)">
          </div>
        </div>
        <div class="select-item">
          <div class="select-item-label flex">业务</div>
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
          <span class="need-score-sapn">{{quantity || 0}}{{nowServices.units}} * {{nowServices.rate + '单价'}} <span v-if="user.discount!==1">{{'* ' + (user.discount || 1)*10 + '折'}}</span> = {{consumeNum + '积分'}}</span>
        </div>
        <div class="rule-hints flex ellipsis">
          <span class="rh-title">剩余积分:</span>
          <span class="score-sapn">{{user.score || 0}}</span><span class="gray-span">{{'(1'+nowServices.units}}{{nowServices.label + '需要'}}{{(nowServices.rate || '0') + '积分)'}}</span>
        </div>
        <div class="rule-hints flex ellipsis">
          <span class="rh-title">下单范围:</span>
          <span class="max-gray-span">最小数量</span><span class="red-score-sapn">{{nowServices.min_num}}</span><span class="max-gray-span">最大数量</span><span class="red-score-sapn">{{nowServices.max_num}}</span>
        </div>
      </div>
      <div class="btn flex" @click="_sublime(nowServices.category)">提交订单</div>
    </div>
    <centerTips ref='centerTips'>
      <div class="tips-class flex ellipsis">{{centerTips}}</div>
    </centerTips>
  </div>
</template>
<script type="text/javascript">
import { getServiceCategory, getServices, addTask, getUserInfo, getShuoshuoList, addTaskTargetId } from 'api/index'
import { testToken } from 'common/js/util'
import { mapGetters, mapMutations } from 'vuex'
import { SUCCESS_CODE } from 'api/config'
import centerTips from 'base/centerTips/centerTips'

export default {
  data() {
    return {
      popoverWidth: 400,
      link: '',
      centerTips: '',
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
      hiddenPop: false,
      scorerate: false // 一元购买多少积分
    }
  },
  created() {
    // 由app 统一返回
    this._initNet()
    this._setPopoverWidth()
    if (this.user) {
      this.$nextTick(() => {
        this.$root.eventHub.$emit('user')
      })
    }
    this.$root.eventHub.$emit('canvas')
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
    consumeNum() {
      return Math.ceil((this.quantity || 0) * this.nowServices.rate * (this.user.discount || 1))
    },
    ...mapGetters([
      'user',
      'token',
      'tokenTime',
      'app'
    ])
  },
  methods: {
    _choseSayList(item) {
      this.hiddenPop = true
      setTimeout(() => {
        this.hiddenPop = false
      }, 0)
      this.targetid = item.tid
      this.suosuo = item.content
    },
    _sublime(category) {
      if (this.choseServiceValue === '' || !this.choseServiceValue) {
        this.$message({
          showClose: true,
          message: '未知错误',
          type: 'warning'
        })
        return false
      }
      if (!this.checkTock()) {
        return false
      }
      if (category === 2 || category === 4) {
        if (!this.targetid) {
          this.$message({
            showClose: true,
            message: '请选择说说',
            type: 'warning'
          })
          return false
        }
      } else {
        if (!this.link && category < 10) {
          this.$message({
            showClose: true,
            message: '请正确填写QQ号',
            type: 'warning'
          })
          return false
        }
        if ((!this.link || this.link.indexOf('http') < 0) && category > 10) {
          this.$message({
            showClose: true,
            message: '请正确填写链接',
            type: 'warning'
          })
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
        this.$message({
          showClose: true,
          message: '后台数量限制有误',
          type: 'warning'
        })
        return false
      }
      if (this.quantity > max || this.quantity < min) {
        // this.$message({
        //   showClose: true,
        //   message: `最大数量${max},最小数量${min}`,
        //   type: 'warning'
        // })
        this.centerTips = `最大数量${max},最小数量${min}`
        this.$refs.centerTips._open()
        return false
      }
      if (this.consumeNum > this.user.score) {
        // this.$message({
        //   showClose: true,
        //   message: '积分不足',
        //   type: 'warning'
        // })
        this.centerTips = '积分不足'
        this.$refs.centerTips._open()
        this.$root.eventHub.$emit('showPopup')
        return false
      }
      if (category === 2 || category === 4) {
        addTask(this.consumeNum, this.quantity, this.token, this.choseServiceValue, this.link, this.targetid).then((res) => {
          this._afterAddtask(res)
        })
        return true
      } else {
        addTask(this.consumeNum, this.quantity, this.token, this.choseServiceValue, this.link).then((res) => {
          this._afterAddtask(res)
        })
      }
    },
    _afterAddtask(res) {
      if (res.data.err_code === SUCCESS_CODE) {
        this.$message({
          showClose: true,
          message: '下单成功',
          type: 'success'
        })
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
              this.$message({
                showClose: true,
                message: this.$root.errorCode[res.data.err_code],
                type: 'error'
              })
            } else {
              this.$message({
                showClose: true,
                message: '似乎出错了',
                type: 'error'
              })
            }
          }
        })
      } else {
        if (res.data.err_msg) {
          this.$message({
            showClose: true,
            message: this.$root.errorCode[res.data.err_code],
            type: 'error'
          })
        } else {
          this.$message({
            showClose: true,
            message: '似乎出错了',
            type: 'error'
          })
        }
      }
    },
    _choseShuoShuo(category) {
      // console.log(category)
      if (category !== 2 && category !== 4) {
        return
      }
      if (!this.link) {
        this.$message({
          showClose: true,
          message: '请输入QQ号',
          type: 'warning'
        })
        return
      }
      if (this.link.length < 5) {
        this.$message({
          showClose: true,
          message: '请正确输入QQ号',
          type: 'warning'
        })
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
            this.$message({
              showClose: true,
              message: '似乎没有权限查看,请打开空间权限',
              type: 'error'
            })
          }
        } else {
          if (res.data.err_msg) {
            this.$message({
              showClose: true,
              message: this.$root.errorCode[res.data.err_code],
              type: 'error'
            })
          } else {
            this.$message({
              showClose: true,
              message: '似乎出错了',
              type: 'error'
            })
          }
        }
      })
    },
    checkTock() {
      if (!this.user) {
        this.$message({
          showClose: true,
          message: '请登录',
          type: 'warning'
        })
        this.$router.replace({
          path: '/login'
        })
        return false
      }
      if (!testToken(this.tokenTime)) {
        console.log('登录已失效 checkTock')
        this.setUser(false)
        this.setToken(false)
        this.setTokenTime(false)
        this.$message({
          showClose: true,
          message: '登录已失效',
          type: 'warning'
        })
        this.$router.replace({
          path: '/login'
        })
        return false
      }
      return true
    },
    _setPopoverWidth() {
      const width = document.body.clientWidth || window.screen.width
      if (width > 800) {
        this.popoverWidth = 400
      } else {
        this.popoverWidth = 300
      }
    },
    _chose(id) {
      if (!this.services[id]) {
        this._getServices(this, id)
      } else {
        this.showService = this.services[id]
        this.choseServiceValue = this.showService[0] ? this.showService[0].id : ''
      }
      this.link = ''
      this.suosuo = false
      this.activeCategory = id
    },
    _clear() {
      this.link = ''
      this.suosuo = false
    },
    // _normalShowService(services) {
    //   console.log(services)
    //   if (services.form.indexOf('[{') > -1 && services.form.indexOf('}]') > -1) {
    //     services.form = eval(services.form)
    //   }
    //   return services
    // },
    _initNet() {
      const that = this
      // 2018.4.10 luoyukun-更改serviceCategory（服务类别）获取方式,减少一个网络请求.
      // this._getServiceCategory(that) // 服务类别
      // this._getScoreRate(that)
      that.activeCategory = that.app.service_categories[0].id
      that._getServices(that, that.app.service_categories[0].id) // 服务
    },
    _getServiceCategory(that) {
      getServiceCategory().then((res) => {
        if (res.data.err_code === SUCCESS_CODE) {
          that.serviceCategory = res.data.data
          // console.log(res.data.data[0].id)
          that.activeCategory = res.data.data[0].id
          // console.log(that.activeCategory)
          that._getServices(that, res.data.data[0].id) // 服务
        } else {
          if (res.data.err_msg) {
            this.$message({
              showClose: true,
              message: this.$root.errorCode[res.data.err_code],
              type: 'error'
            })
          } else {
            this.$message({
              showClose: true,
              message: '似乎出错了',
              type: 'error'
            })
          }
        }
      })
    },
    _getServices(that, id) {
      // const that = this
      getServices(id).then((res) => {
        if (res.data.err_code === SUCCESS_CODE) {
          const services = this._normalServices(res.data.data)
          // console.log(services)
          that.services[that.activeCategory] = services
          that.showService = services
          that.choseServiceValue = that.showService[0] ? that.showService[0].id : ''
        } else {
          if (res.data.err_msg) {
            this.$message({
              showClose: true,
              message: this.$root.errorCode[res.data.err_code],
              type: 'error'
            })
          } else {
            this.$message({
              showClose: true,
              message: '似乎出错了',
              type: 'error'
            })
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
      setScorerate: 'SET_SCORERATE',
      setTokenTime: 'SET_TOKENTIME'
    })
  },
  components: {
    centerTips
  }
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
  width: 30px;
  height: 30px;
}

.mbh-label {
  margin-top: 5px;
  width: 100%;
  flex-shrink: 0;
  color: #666;
  font-size: 13px;
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
}

.index-select {
  width: 100%;
}

.select-item-label {
  height: 20px;
  justify-content: flex-start;
  text-indent: 16px;
  font-weight: 600;
  font-size: 16px;
  font-family: Adobe Heiti Std R;
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

.input-defult {
  width: 100%;
  height: 45px;
  border-bottom: 1px solid rgba(0, 0, 0, .1);
}

.input-defult:hover {
  animation: gradientIndex .5s ease 1 forwards;
}

@keyframes gradientIndex {
  0% {
    border-bottom: 1px solid rgba(0, 0, 0, .1);
  }
  100% {
    border-bottom: 1px solid #ff9430;
  }
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
  color: #66BB6A;
}

.gray-span {
  font-size: 13px;
  color: #353535;
}

.need-score-sapn {
  color: #42A5F5;
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
  overflow-y: scroll;
}

.el-button {
  height: 100%;
  line-height: 0px !important;
  background: rgba(255, 255, 255, 0) !important;
  color: #d94d37;
  font-size: 16px;
  font-weight: 600;
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
  text-indent: 10px;
}

.red-score-sapn {
  text-indent: 2px;
  color: #ff6b4e;
  color: var(--main-color);
}

.max-gray-span {
  text-indent: 10px;
  color: #353535;
}

.i-ipnput {
  text-indent: 15px;
}
.rh-title{
  text-indent: 20px;
  font-size: 16px;
  font-weight: 600;
  color: #353535;
}

</style>
