<template>
  <div id="main-body">
    <div class="main-box" id="main-box">
      <div class="main-box-header flex">
        <div class="mbh-item flex" v-for="item in serviceCategory" :class="{'activeCategory':activeCategory == item.id}" @click="_chose(item.id)" v-bind:key="item.id+Math.random()">
          <img :src="item.icon" class="mbh-icon" v-if="item.icon">
          <div v-else class="mbh-icon"></div>
          <div class="mbh-label flex">{{item.label}}</div>
        </div>
      </div>
      <div class="course" v-if="nowServices">
        {{nowServices.tips || '快去下单吧~'}}
      </div>
      <div class="select-box flex">
        <div class="select-item">
          <div class="select-item-label flex">
            <span v-if="nowServices">{{nowServices.category>0&&nowServices.category<10?'QQ号': '链接'}}</span>
            <el-popover ref="popover4" placement="right" :width="popoverWidth" trigger="click" v-if="nowServices && (nowServices.category>10||(nowServices.category===2 || nowServices.category===4) && link)">
              <div class="p-course-box" v-if="nowServices">
                <scroller>
                  <div v-if="!nowServices.tutorials && (nowServices.category!==2 && nowServices.category!==4)" class="flex no-tutorials">暂无教程</div>
                  <div v-if="(nowServices.category ===2 || nowServices.category===4) && !sayList" class="flex no-tutorials">您输入的QQ号无效或无权限访问此QQ号空间</div>
                  <img :src="nowServices.tutorials" class="course-img" v-if="nowServices.tutorials && (nowServices.category!==2 && nowServices.category!==4)">
                  <div v-if="sayList && (nowServices.category ===2 || nowServices.category ===4)" v-for="item in sayList">
                    {{item}}
                  </div>
                </scroller>
              </div>
            </el-popover>
            <el-button v-popover:popover4 @click="_choseShuoShuo(nowServices.category)" v-if="nowServices && (nowServices.category>10||(nowServices.category===2 || nowServices.category===4) && link)">{{nowServices.category>0&&nowServices.category
              <10? '获取说说列表': '查看教程'}}</el-button>
                <!--             <span class="chose-shuoshuo" v-for="item in showService" v-show="(item.category === 2 || item.category === 4) && item.id === choseServiceValue" @click="_choseShuoShuo">点击选择说说</span> -->
          </div>
          <div class="flex input-defult" v-if="nowServices">
            <input type="text" :placeholder="nowServices.category>0&&nowServices.category<10?'请按教程输入QQ号': '请按教程粘贴链接'" class="i-ipnput" v-model="link">
          </div>
        </div>
        <div class="select-item">
          <div class="select-item-label flex">数量</div>
          <div class="flex input-defult">
            <input type="text" placeholder="请填写数量" class="i-ipnput" v-model="quantity" onkeyup="value=value.replace(/[^\d]/g,'') " ng-pattern="/[^a-zA-Z]/">
          </div>
        </div>
        <div class="select-item">
          <div class="select-item-label flex">业务</div>
          <el-select v-model="choseServiceValue" placeholder="请选择" class="index-select" v-if="showService" no-data-text="暂无业务">
            <el-option v-for="item in showService" :key="item.label" :label="item.label" :value="item.id">
            </el-option>
          </el-select>
        </div>
      </div>
      <div v-if="nowServices">
        <div class="rule-hints flex ellipsis">
          所需积分:<span class="need-score-sapn">{{quantity || 0}} / {{nowServices.rate}} <span v-if="user.discount!==1">{{'* ' + (user.discount || 1)*10 + '折'}}</span> = {{Math.ceil((quantity||0)/nowServices.rate*(user.discount || 1))}}</span>
        </div>
        <div class="rule-hints flex ellipsis">
          剩余积分:<span class="score-sapn">{{user.score || 0}}</span><span class="gray-span">{{'(1积分等于'+ nowServices.rate || '0'}}{{nowServices.units}}{{nowServices.label}}等于1元钱)</span>
        </div>
      </div>
      <div class="btn flex" @click="_sublime">提交订单</div>
    </div>
  </div>
</template>
<script type="text/javascript">
import { getServiceCategory, getServices, addTask, getUserInfo, getkjInfo } from 'api/index'
import { testToken } from 'common/js/util'
import { mapGetters, mapMutations } from 'vuex'
export default {
  data() {
    return {
      popoverWidth: 400,
      link: '',
      quantity: 0,
      shuoshuoPage: 0,
      choseServiceValue: '',
      serviceCategory: false,
      services: [],
      sayList: false,
      activeCategory: false,
      showService: false,
      scorerate: false // 一元购买多少积分
    }
  },
  created() {
    this._initNet()
    this._setPopoverWidth()
    if (this.user) {
      this.$nextTick(() => {
        this.$root.eventHub.$emit('user')
      })
    }
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
    ...mapGetters([
      'user',
      'token'
    ])
  },
  methods: {
    _sublime() {
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
      if (!this.link || this.link.indexOf('http') < 0) {
        this.$message({
          showClose: true,
          message: '请正确填写链接',
          type: 'warning'
        })
        return false
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
        this.$message({
          showClose: true,
          message: `最大数量${max},最小数量${min}`,
          type: 'warning'
        })
        return false
      }
      if (Math.ceil(this.quantity / rate * this.user.discount > this.user.score)) {
        this.$message({
          showClose: true,
          message: '积分不足',
          type: 'warning'
        })
        return false
      }
      addTask(this.quantity, this.token, this.choseServiceValue, this.link).then((res) => {
        if (res.data.err_code === 0) {
          this.$message({
            showClose: true,
            message: '下单成功',
            type: 'success'
          })
          this.$root.eventHub.$emit('updateOrder')
          this.$router.replace({
            path: '/order'
          })
          if (!this.checkTock()) {
            return false
          }
          getUserInfo(this.token).then((res) => {
            if (res.data.err_code === 0) {
              this.setUser(res.data.data)
              this.$root.eventHub.$emit('user')
            } else {
              if (res.data.err_msg) {
                this.$message({
                  showClose: true,
                  message: res.data.err_msg,
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
              message: res.data.err_msg,
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
    _choseShuoShuo(category) {
      console.log(category)
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
      getkjInfo(typeid, page, this.token).then((res) => {
        if (res.data.err_code === 0) {
          if (res.data.msglist) {
            if (!this.sayList) {
              this.sayList = res.data.msglist
            }
            this.sayList = this.sayList.concat(res.data.msglist)
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
              message: res.data.err_msg,
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
      if (!testToken()) {
        this.setUser(false)
        this.setToken(false)
        localStorage['tokenTime'] = false
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
      this.activeCategory = id
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
      this._getServiceCategory(that) // 服务类别
      // this._getScoreRate(that)
    },
    _getServiceCategory(that) {
      getServiceCategory().then((res) => {
        if (res.data.err_code === 0) {
          that.serviceCategory = res.data.data
          // console.log(res.data.data[0].id)
          that.activeCategory = res.data.data[0].id
          console.log(that.activeCategory)
          that._getServices(that, res.data.data[0].id) // 服务
        } else {
          if (res.data.err_msg) {
            this.$message({
              showClose: true,
              message: res.data.err_msg,
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
        if (res.data.err_code === 0) {
          const services = this._normalServices(res.data.data)
          // console.log(services)
          that.services[that.activeCategory] = services
          that.showService = services
          that.choseServiceValue = that.showService[0] ? that.showService[0].id : ''
        } else {
          if (res.data.err_msg) {
            this.$message({
              showClose: true,
              message: res.data.err_msg,
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
      setScorerate: 'SET_SCORERATE'
    })
  },
  watch: {

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
  background: #ff9430;
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
  background: #dcdcdc;
}

@keyframes color {
  0% {
    color: #666;
  }
  100% {
    color: #ff9430;
  }
}

.course {
  width: 85%;
  height: auto;
  margin: 20px auto;
  background-color: #F3DFDF;
  border: 1px solid #EBCED1;
  line-height: 20px;
  font-size: 14px;
  border-radius: 6px;
  padding: 10px;
  color: #A94442;
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
  color: #606266;
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
  text-indent: 2%;
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
  color: #999;
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
  overflow: hidden;
}

.el-button {
  height: 100%;
  line-height: 0px !important;
  background: rgba(255, 255, 255, 0) !important;
  color: #A94442;
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
  color: #A94442;
}

.chose-shuoshuo:hover {
  color: #ff9430;
  cursor: pointer;
}
.no-tutorials{
  width: 100%;
  height: 550px;
}

</style>
