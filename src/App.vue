<template>
  <div id="app">
    <m-header></m-header>
    <keep-alive>
      <router-view ref='body'></router-view>
    </keep-alive>
    <foot></foot>
    <x-canvas></x-canvas>
    <centerTips ref='centerTips'>
      <div class="tips-class flex ellipsis">{{centerTips}}</div>
    </centerTips>
  </div>
</template>
<script>
import MHeader from 'components/header/header'
import foot from 'components/footer/footer'
import XCanvas from 'components/canvas/canvas'
import centerTips from 'base/centerTips/centerTips'
const header = 65
const footer = 135
let margin = 140
export default {
  data() {
    return {
      centerTips: false
    }
  },
  updated() {
    this._screenAdaptation()
  },
  methods: {
    _screenAdaptation() {
      if (this.$refs.body && !this.$refs.body.$el.style.minHeight) {
        const minheight = window.screen.height - header - footer - margin
        this.$refs.body.$el.style.minHeight = `${minheight}px`
      }
    },
    _open(res) {
      if (this.$refs.centerTips && res) {
        this.centerTips = res
        this.$refs.centerTips._open()
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
  },
  components: {
    MHeader,
    foot,
    XCanvas,
    centerTips
  },
  watch:{
    $route(newUrl, oldUrl){
      // console.log(newUrl)
      if (newUrl.name === 'management') {
        document.getElementsByTagName("body")[0].className = "add_bg"
      } else {
        document.body.removeAttribute("class","add_bg")
      }
    }
  }
}

</script>
<style>
@import url(common/css/reset.css);
@import url(common/css/public.css);
@import url(common/css/adaptation.css);
@import url(common/css/important.css);
@import url(common/icon/iconfont.css);

</style>
