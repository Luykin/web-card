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
        <div class="mg-btn flex cursor notice-heder-btn" @click="_toGoodsManage">商品管理</div>
        <div class="mg-btn flex cursor notice-heder-btn" @click="_toReflect">提现</div>
      </div>
      <!--  右侧边栏end -->
      <div class="configure-box flex">
        <div class="cb-left flex">
          <div class="cb-left-logo" :style="siteLogo"></div>
        </div>
        <div class="cb-right">
          <div class="cr-item flex">
            <div class="cr-box-tit ellipsis flex">分站名称:</div>
            <div class="cr-box-min flex">{{user.agency.sub_site.site_name}}</div>
            <div class="cr-box-btn mg-btn flex cursor" @click="toEdit">分站编辑</div>
          </div>
          <div class="cr-item flex">
            <div class="cr-box-tit ellipsis flex">我的分站:</div>
            <div class="cr-box-min flex">{{user.agency.sub_domain}}</div>
            <div class="cr-box-btn mg-btn flex cursor">复制链接</div>
          </div>
          <div class="cr-item flex">
            <div class="cr-box-tit ellipsis flex">首页公告:</div>
            <div class="cr-box-max flex">{{user.agency.sub_site.announcement}}</div>
          </div>
          <div class="cr-item flex">
            <div class="cr-box-tit ellipsis flex">尾页信息:</div>
            <div class="cr-box-max flex">{{user.agency.sub_site.footer}}</div>
          </div>
        </div>
      </div>
      <div class="partition"></div>
      <div class="income-box flex" v-if="siteInfo">
        <div class="income-box-item cursor">
          <div class="position-ibi-content flex">
            <img src="http://p70pqu6ys.bkt.clouddn.com/%E4%BB%8A%E6%97%A5%E6%94%B6%E7%9B%8A.png" class="pic-img">
            <div class="pic-title flex">{{siteInfo.sum_price_today}}</div>
            <div class="pic-title flex">今日消费</div>
          </div>
        </div>
        <div class="income-box-item cursor">
          <div class="position-ibi-content flex">
            <img src="http://p70pqu6ys.bkt.clouddn.com/%E4%BB%8A%E6%97%A5%E6%B6%88%E8%B4%B9.png" class="pic-img">
            <div class="pic-title flex">{{siteInfo.sum_income_today}}</div>
            <div class="pic-title flex">今日收入</div>
          </div>
        </div>
        <div class="income-box-item cursor">
          <div class="position-ibi-content flex">
            <img src="http://p70pqu6ys.bkt.clouddn.com/%E7%B4%AF%E7%A7%AF%E6%94%B6%E7%9B%8A.png" class="pic-img">
            <div class="pic-title flex">{{siteInfo.sum_price}}</div>
            <div class="pic-title flex">总消费</div>
          </div>
        </div>
        <div class="income-box-item cursor">
          <div class="position-ibi-content flex">
            <img src="http://p70pqu6ys.bkt.clouddn.com/%E7%B4%AF%E7%A7%AF%E6%B6%88%E8%B4%B9.png" class="pic-img">
            <div class="pic-title flex">{{siteInfo.sum_income}}</div>
            <div class="pic-title flex">总收入</div>
          </div>
        </div>
      </div>
      <div class="mg-btn flex mg-min-btnwidth cursor">查看明细</div>
    </div>
  </div>
</template>
<script type="text/javascript">
import { getSiteinfo } from 'api/site'
import { mapGetters, mapMutations } from 'vuex'
import { testToken } from 'common/js/util'
import { SUCCESS_CODE } from 'api/config'
export default {
  data() {
    return {
      siteInfo: false,
      rank: ['青铜代理', '白银代理', '黄金代理', '王者代理'],
      iconList: ['http://p70pqu6ys.bkt.clouddn.com/%E7%AD%89%E8%AE%B01.png', 'http://p70pqu6ys.bkt.clouddn.com/%E7%AD%89%E7%BA%A72.png', 'http://p70pqu6ys.bkt.clouddn.com/%E7%AD%89%E7%BA%A73@2x.png']
    }
  },
  created() {
    this.$root.eventHub.$emit('user')
    this._siteInit()
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
    _toGoodsManage() {
      this.$router.replace({
        path: '/goodsManage'
      })
    },
    _toReflect() {
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
      this._getSiteinfo()
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
  components: {},
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
  width: 100%;
  background: #fff;
  height: 400px;
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
  min-width: 60px;
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
  color: #353535;
}

.proxy-icon {
  max-width: 25px;
  height: auto;
  margin: 0 5px;
}

</style>
