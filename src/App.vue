<template>
  <div id="app" ref='app'>
    <m-header></m-header>
    <keep-alive>
      <router-view ref='body'></router-view>
    </keep-alive>
    <!--<foot></foot>-->
    <!--<centerTips ref='centerTips'>-->
      <!--<div class="tips-class flex ellipsis">{{centerTips}}</div>-->
    <!--</centerTips>-->
  </div>
</template>
<script>
import MHeader from 'components/header/header'
// import foot from 'components/footer/footer'
// import XCanvas from 'components/canvas/canvas'
// import centerTips from 'base/centerTips/centerTips'

export default {
  data() {
    return {
    }
  },
  created() {},
  mounted() {

  },
  updated() {

  },
  methods: {

  },
  components: {
    MHeader
  },
  watch: {
  }
}

</script>
<style>
@import url(common/css/reset.css);

</style>
