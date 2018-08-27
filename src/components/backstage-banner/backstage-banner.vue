<template>
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
      <div class="notice-item-right flex nir-color" v-if="user">{{user.score}}</div>
    </div>
    <div class="notice-item flex">
      <div class="notice-item-left flex ellipsis">分站营业额</div>
      <div class="notice-item-right flex nir-color">{{user.agency.balance}}</div>
    </div>
    <div class="db-box flex">
      <div class="db-btn db-btn-left flex" @click="_openc('/recharge')" v-bind:class="{'active-mg-btn' : $route.fullPath == '/recharge'}">充值</div>
      <div class="db-btn flex" @click="_openc('/reflectforbk')" v-bind:class="{'active-mg-btn' : $route.fullPath == '/reflectforbk'}">提现</div>
    </div>
    <!--     <div class="mg-btn flex cursor notice-heder-btn" @click="_openc('/reflect', false, true)" v-bind:class="{'active-mg-btn' : $route.fullPath == '/reflect'}">提现</div> -->
    <div class="backstage-fenge"></div>
    <div class="mg-btn flex cursor notice-heder-btn" @click="_openc('/backstage')" v-bind:class="{'active-mg-btn' : $route.path == '/backstage'}">代理后台</div>
    <!--     <div class="mg-btn flex cursor notice-heder-btn" @click="_openc('/recharge')" v-bind:class="{'active-mg-btn' : $route.fullPath == '/recharge'}">充值余额</div> -->
    <div class="mg-btn flex cursor notice-heder-btn" @click="_openc('/bg-task-record')" v-bind:class="{'active-mg-btn' : $route.fullPath == '/bg-task-record'}">任务列表</div>
    <div class="mg-btn flex cursor notice-heder-btn" @click="_openc('/bg-money-record')" v-bind:class="{'active-mg-btn' : $route.fullPath == '/bg-money-record'}">充值记录</div>
    <div class="mg-btn flex cursor notice-heder-btn" @click="_openc('/management', 1, true)" v-bind:class="{'active-mg-btn' : $route.fullPath == '/management'}">分站管理</div>
    <!--     <div class="mg-btn flex cursor notice-heder-btn" @click="_openc('/secret-books')" v-bind:class="{'active-mg-btn' : ($route.path == '/secret-books') || ($route.path == '/secret-books-detail')}">
      <div class="tag-notic-btn flex ellipsis">轻松上推荐</div>
      上推荐教学秘籍
    </div> -->
    <div class="backstage-fenge"></div>
    <div class="mg-btn flex cursor notice-heder-btn" @click="_dialogTableVisible">代理介绍</div>
    <div class="mg-btn flex cursor notice-heder-btn" @click="_openQQ">客服帮助</div>
    <div class="mg-btn flex cursor notice-heder-btn" @click="_openQQ">发票申请</div>
    <!--   <div class="mg-btn flex cursor notice-heder-btn" @click="_openc('/goodsManage')" v-bind:class="{'active-mg-btn' : $route.fullPath == '/goodsManage'}">商品管理</div> -->
    <!--     <div class="mg-btn flex cursor notice-heder-btn" @click="_openc('/task')" v-bind:class="{'active-mg-btn' : $route.fullPath == '/task'}">任务列表</div> -->
    <!--    <div class="mg-btn flex cursor notice-heder-btn" @click="_openc('/management?mx=%E6%9F%A5%E7%9C%8B%E6%98%8E%E7%BB%86', 2)" v-bind:class="{'active-mg-btn' : $route.fullPath == '/management?mx=%E6%9F%A5%E7%9C%8B%E6%98%8E%E7%BB%86'}">查看明细</div> -->
    <iframe :src="qqurl" v-if="qqurl" class="pay-iframe" @load="_closeSelf" seamless></iframe>
  </div>
</template>
<script type="text/javascript">
import { mapGetters } from 'vuex'
import { NOWCONFIG } from 'api/appConfig'
import { isPhone } from 'common/js/util'
export default {
  data() {
    return {
      qqurl: null,
      rank: ['青铜代理', '白银代理', '黄金代理', '王者代理'],
      iconList: ['http://p70pqu6ys.bkt.clouddn.com/%E7%AD%89%E8%AE%B01.png', 'http://p70pqu6ys.bkt.clouddn.com/%E7%AD%89%E7%BA%A72.png', 'http://p70pqu6ys.bkt.clouddn.com/%E7%AD%89%E7%BA%A73@2x.png']
    }
  },
  created() {
    this.$root.eventHub.$on('headerToDl', (data) => {
      this._openc(data, 1, true)
    })
    this.$root.eventHub.$on('openqq', (data) => {
      this._openQQ()
    })
  },
  methods: {
    _dialogTableVisible() {
      this.$root.eventHub.$emit('dialogTableVisible')
    },
    _closeSelf() {
      const close = setTimeout(() => {
        this.qqurl = null
        clearTimeout(close)
      }, 10000)
    },
    _openc(url, show, windowOpen) {
      this.$root.eventHub.$emit('timeforsps')
      if (url == '/bg-task-record') {
        this.$root.eventHub.$emit('updateOrder')
      }
      if (url == '/bg-money-record') {
        this.$root.eventHub.$emit('updateScoreRecord')
      }
      if (windowOpen) {
        if (!this.user.agency.sub_site) {
          if (this.user.agency.level <= 0) {
            this.$parent.$parent._open('您的代理等级不够')
          } else {
            this.$root.eventHub.$emit('domain')
          }
        } else {
          window.open(window.location.origin + '/#' + url, '_brank')
        }
      } else {
        if (show) {
          this.$root.eventHub.$emit('showMX', show - 1)
        }
        this.$router.replace({
          path: url
        })
      }
    },
    _openQQ() {
      this.$parent.$parent._open('正在打开QQ,请稍候')
      if (this.qqurl) {
        this.qqurl = null
      }
      if (isPhone()) {
        this.qqurl = 'http://qm.qq.com/cgi-bin/qm/qr?k=5DQm1DPl08H41RVOoQhgLesBwmnzLkgD'
        // window.location.href = 'http://qm.qq.com/cgi-bin/qm/qr?k=5DQm1DPl08H41RVOoQhgLesBwmnzLkgD'
      } else {
        window.open(`https://wpa.qq.com/msgrd?v=3&uin=${NOWCONFIG.customerQQ}`, '_brank')
      }
    }
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
    ...mapGetters([
      'user'
    ])
  }
}

</script>
<style type="text/css" media="screen">
#main-body {
  min-height: 820px !important;
}

</style>
<style type="text/css" scoped>
.notice-heder-btn {
  position: relative;
}

.tag-notic-btn {
  position: absolute;
  top: 0;
  left: 0;
  width: 30%;
  background: red;
  color: #fff;
  height: 18px;
  font-size: 8px;
  border-radius: 2px;
  transform: translate(0, -50%);
}

.notice {
  position: absolute;
  right: 0;
  top: 0;
  transform: translate(106%, 0);
  min-height: 5%;
  width: 38%;
  background: #fff;
  padding-bottom: 10px;
}

.backstage-fenge {
  width: 100%;
  height: 20px;
  background: #F4F4F4;
  margin: 20px 0;
}

.proxy-icon {
  width: 20px;
  height: auto;
  margin: 0 5px;
}

.db-box {
  width: 80%;
  height: 40px;
  margin: 20px auto;
}

.db-btn {
  width: 45%;
  height: 100%;
  background: #fff;
  border: 1px solid #FFDA5B;
  border-radius: 5px;
  /*  margin: 0 6%*/
}

.db-btn-left {
  margin-right: 10%;
}

.db-btn:hover {
  background: #FFD236;
  cursor: pointer;
}

.active-mg-btn {
  background: #FFD236;
}

.pay-iframe {
  z-index: -1;
  opacity: 0;
  width: 1px;
  height: 1px;
  border: none;
}

</style>
