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
    <div class="mg-btn flex cursor notice-heder-btn" @click="_openc('/reflect')" v-bind:class="{'active-mg-btn' : $route.fullPath == '/reflect'}">提现</div>
    <div class="backstage-fenge"></div>
    <div class="mg-btn flex cursor notice-heder-btn" @click="_openc('/task')" v-bind:class="{'active-mg-btn' : $route.fullPath == '/task'}">充值余额</div>
    <div class="mg-btn flex cursor notice-heder-btn" @click="_openc('/task')" v-bind:class="{'active-mg-btn' : $route.fullPath == '/task'}">订单查询</div>
    <div class="mg-btn flex cursor notice-heder-btn" @click="_openc('/management', 1)" v-bind:class="{'active-mg-btn' : $route.fullPath == '/management'}">分站管理</div>
    <div class="mg-btn flex cursor notice-heder-btn" @click="_openc('/task')" v-bind:class="{'active-mg-btn' : $route.fullPath == '/task'}">客服帮助</div>
    <div class="mg-btn flex cursor notice-heder-btn" @click="_openc('/task')" v-bind:class="{'active-mg-btn' : $route.fullPath == '/task'}">发票申请</div>
    <!--   <div class="mg-btn flex cursor notice-heder-btn" @click="_openc('/goodsManage')" v-bind:class="{'active-mg-btn' : $route.fullPath == '/goodsManage'}">商品管理</div> -->
    <!--     <div class="mg-btn flex cursor notice-heder-btn" @click="_openc('/task')" v-bind:class="{'active-mg-btn' : $route.fullPath == '/task'}">任务列表</div> -->
    <!-- 		<div class="mg-btn flex cursor notice-heder-btn" @click="_openc('/management?mx=%E6%9F%A5%E7%9C%8B%E6%98%8E%E7%BB%86', 2)" v-bind:class="{'active-mg-btn' : $route.fullPath == '/management?mx=%E6%9F%A5%E7%9C%8B%E6%98%8E%E7%BB%86'}">查看明细</div> -->
  </div>
</template>
<script type="text/javascript">
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      rank: ['青铜代理', '白银代理', '黄金代理', '王者代理'],
      iconList: ['http://p70pqu6ys.bkt.clouddn.com/%E7%AD%89%E8%AE%B01.png', 'http://p70pqu6ys.bkt.clouddn.com/%E7%AD%89%E7%BA%A72.png', 'http://p70pqu6ys.bkt.clouddn.com/%E7%AD%89%E7%BA%A73@2x.png']
    }
  },
  created() {
    console.log('132321')
  },
  methods: {
    _openc(url, show) {
      if (show) {
        this.$root.eventHub.$emit('showMX', show - 1)
      }
      this.$router.replace({
        path: url
      })
      // console.log(this.$route.fullPath)
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
<style type="text/css" scoped>
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

.active-mg-btn {
  background: #FFD236;
}

.backstage-fenge {
  width: 100%;
  height: 20px;
  background: #F4F4F4;
  margin: 20px 0;
}

</style>
