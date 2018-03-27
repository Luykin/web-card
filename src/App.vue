<template>
  <div id="app">
    <m-header></m-header>
    <keep-alive>
      <router-view/>
    </keep-alive>
    <foot></foot>
  </div>
</template>
<script>
import MHeader from 'components/header/header'
import foot from 'components/footer/footer'
export default {
  components: {
    MHeader,
    foot
  }
}

</script>
<style>
@import url(common/css/reset.css);
@import url(common/css/adaptation.css);
@import url(common/icon/iconfont.css);
</style>
