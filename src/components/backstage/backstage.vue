<template>
  <div id="main-body" ref='mainbody'>
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
        <div class="cr-item flex">
          <div class="cr-box-tit ellipsis flex">首页公告:</div>
          <div class="cr-box-max flex">
          	{{nowServices.tips}}
          </div>
        </div>
        <div class="cr-item flex">
          <div class="cr-box-tit ellipsis flex">商户联系:</div>
          <div class="cr-box-min flex margin-right"></div>
        </div>
        <div class="cr-item flex">
          <div class="cr-box-tit ellipsis flex">商户联系:</div>
          <div class="cr-box-min flex margin-right"></div>
        </div>
        <div class="cr-item flex">
          <div class="cr-box-tit ellipsis flex">商户联系:</div>
          <div class="cr-box-min flex margin-right"></div>
        </div>
        <div class="cr-item flex">
          <div class="cr-box-tit ellipsis flex">商户联系:</div>
          <div class="cr-box-min flex margin-right"></div>
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
export default {
  data() {
    return {
      Gdomain: null,
      activeCategory: 1,
      lodingChose: null,
      showService: false,
      services: [],
      choseServiceValue: '',
      link: '',
      quantity: '',
      suosuo: false,
      pc: true,
      loading: null
    }
  },
  created() {
    console.log(1)
    // activeCategory: 1
  },
  computed: {
    nowServices() {
      let nowServer = {
        submit_category: 1
      }
      if (this.showService) {
        this.showService.forEach((item) => {
          if (item.id === this.choseServiceValue) {
            nowServer = item
          }
        })
      }
      if (nowServer.submit_category === 2) {
        this.quantity = nowServer.min_num
      }
      return nowServer
    },
    ...mapGetters([
      'user',
      'token',
      'tokenTime',
      'app'
    ])
  },
  methods: {
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
      if (!this.services[id]) {
        this.lodingChose = true
        this._getServices(this, id, this.Gdomain)
      } else {
        this.showService = this.services[id]
        this.choseServiceValue = this.showService[0] ? this.showService[0].id : ''
      }
      this.link = ''
      this.quantity = ''
      this.suosuo = false
      this.activeCategory = id
      // if (!this.pc) {
      //   return
      // }
      // if (this.nowServices.category === 2 || this.nowServices.category === 4) {
      //   this.position = 'right'
      //   this.popoverWidth = 320
      //   this.choseSay = true
      // } else {
      //   if (this.popoverWidth < 400 && this.pc) {
      //     this.popoverWidth = BILI * window.screen.height
      //     this.position = 'right-start'
      //   }
      //   if (this.choseSay) {
      //     this.choseSay = false
      //   }
      // }
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
}

.back-servce-box {
  width: 18%;
  min-width: 100px;
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
.cr-box-tit{
	flex-shrink: 0;
}
.service-item {
  box-sizing: border-box;
  width: 100%;
  height: 50px;
  text-indent: -20px;
  border-bottom: 1px solid #F0F0F0;
  position: relative;
}

.activeCategory {
  border-left: 5px solid rgba(255, 210, 54, 1);
  text-indent: -22.5px;
  background: #F4F4F4;
}

.active-icon {
  font-size: 20px;
  color: #FFD236;
  position: absolute;
  right: 22px;
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
}

.cr-box-min {
  border: 1px solid #DFDFDF;
  margin: 0 20px 0 10px;
}

</style>
