<template>
  <div id="app" ref='app'>
    <m-header></m-header>
    <keep-alive>
      <router-view ref='body'></router-view>
    </keep-alive>
    <loading ref="loading"></loading>
    <foot></foot>
    <!--<centerTips ref='centerTips'>-->
      <!--<div class="tips-class flex ellipsis">{{centerTips}}</div>-->
    <!--</centerTips>-->
  </div>
</template>
<script>
import MHeader from 'components/header/header'
import foot from 'components/footer/footer'
import loading from 'base/loading/loading'
import {app_info} from 'api/index'

export default {
  data() {
    return {
      timer: null
    }
  },
  created() {
    this._getAppinfo()
  },
  mounted() {
    this.$root.eventHub.$on('loading', (loading) => {
      if (this.timer && loading) {
        return false
      }
      if (loading) {
        this.timer = setTimeout(() => {
          this.$refs.loading._show()
        }, 400)
      } else {
        clearTimeout(this.timer);
        this.timer = null;
        this.$refs.loading._hidden()
      }
    })
  },
  methods: {
    async _getAppinfo() {
      this.$root.eventHub.$emit('loading', true);
      const ret = await app_info();
      this.$root.eventHub.$emit('loading', null);
      if (ret.status === 200 && ret.data.state === 200) {
        this.$root.app_info = ret.data;
      }
    },
  },
  updated() {

  },
  components: {
    MHeader,
    foot,
    loading
  },
  watch: {
  }
}

</script>
<style>
@import url(common/css/reset.css);
@import url(common/icon/iconfont.css);

</style>
