<template>
  <div id="app">
    <m-header></m-header>
    <keep-alive>
      <router-view/>
    </keep-alive>
    <foot></foot>
    <x-canvas></x-canvas>
  </div>
</template>
<script>
import MHeader from 'components/header/header'
import foot from 'components/footer/footer'
import XCanvas from 'components/canvas/canvas'
export default {
  components: {
    MHeader,
    foot,
    XCanvas
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
