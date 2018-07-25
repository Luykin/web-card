<template>
  <footer class="flex new-footer">
    <div class="new-footer-top flex shpc">
      <div class="footer-left flex">
        <img :src="nowconfig.logo" alt="网站图标" class="footer-logo">
        <div class="segmenting-line"></div>
      </div>
      <div class="footer-right flex">
        <div class="footer-right-item flex" v-if="name">
          <img src="http://p70pqu6ys.bkt.clouddn.com/%E8%81%94%E7%B3%BB%E4%BA%BA.png" alt="联系人" class="footer-right-icon"> {{name}}
        </div>
        <div class="footer-right-item flex" v-if="!name">
          <img src="http://p70pqu6ys.bkt.clouddn.com/%E7%94%B5%E8%AF%9D.png" alt="电话" class="footer-right-icon"> {{phone}}
        </div>
        <div class="footer-right-item flex">
          <img src="http://p70pqu6ys.bkt.clouddn.com/%E9%82%AE%E4%BB%B6.png" alt="邮件" class="footer-right-icon"> {{emil}}
        </div>
        <div class="footer-right-item flex" v-if="!name">
          <img src="http://p70pqu6ys.bkt.clouddn.com/%E5%BE%AE%E4%BF%A1.png" alt="微信" class="footer-right-icon"> {{wx}}
        </div>
      </div>
    </div>
    <div class="new-footer-bottom flex shpc">© Melon Tech Design. all rights reserved. Powered by Melon Tech.. <a href="http://www.miitbeian.gov.cn" class="footer-to-gx" target="_blank">{{nowconfig.number}}</a></div>
    <div class="h-footer-title flex sh-phone">商务合作</div>
    <!-- <div class="h-footer-box flex sh-phone">商务联系：{{name}}</div> -->
    <div class="h-footer-box flex sh-phone">联系邮箱：{{emil}}</div>
    <div class="border-f sh-phone"></div>
    <div class="h-footer-box flex sh-phone" v-show="!hid">商务联系：钟先生</div>
    <div class="h-footer-box flex sh-phone" v-show="!hid">联系邮箱：raynor@melonblock.com</div>
    <div class="h-footer-title flex sh-phone" v-show="!hid">商务联系</div>
    <div class="h-footer-title h-footer-title-q flex sh-phone">QQ联系：<span class="c-y">42428851</span></div>
  </footer>
</template>
<script type="text/javascript">
import { NOWCONFIG } from 'api/appConfig'
export default {
  data() {
    return {
      name: false,
      emil: 'zhangheng@melonblock.com',
      phone: '13212399922',
      wx: 'fans10005',
      hid: null,
      nowconfig: null
    }
  },
  created() {
    this.nowconfig = NOWCONFIG
    const that = this
    this.$root.eventHub.$on('footername', (footer) => {
      that.name = footer
      that.hid = true
    })
    this.$root.eventHub.$on('footeremail', (footer) => {
      that.emil = footer
      that.hid = true
    })
  }
}

</script>
<style type="text/css" scoped>
/*.new-footer{
  opacity: .8;
}*/

.new-footer-bottom {
  width: 100%;
  height: 18%;
  border-top: 1px solid #e3e3e3;
  color: #BDBDBD;
}

.footer-to-gx {
  color: #BDBDBD;
}

.new-footer-top {
  width: 100%;
  height: 82%;
}

.footer-logo {
  margin: 0 40px;
}

.footer-left {
  width: 50%;
  height: 100%;
  justify-content: flex-end;
  align-items: center;
  flex-shrink: 0;
  flex-grow: 0;
}

.footer-right {
  width: 50%;
  flex-shrink: 0;
  flex-grow: 0;
  justify-content: flex-start;
  flex-wrap: wrap;
}

.footer-right-item {
  width: 100%;
  height: 35px;
  color: #828282;
  font-size: 12px;
  justify-content: flex-start;
}

.footer-right-icon {
  max-width: 20px;
  height: auto;
  margin: 0 20px 0 40px;
}

.segmenting-line {
  height: 60%;
  width: 2px;
  background: #e7e7e7;
}

.footer-item {
  width: 30%;
  height: 90%;
  flex-wrap: wrap;
  align-content: flex-start;
}

.footer-item-title {
  font-size: 18px;
}

.footer-item-name {
  font-size: 15px;
}

.footer-item-item {
  height: 28%;
  width: 100%;
  justify-content: flex-start;
  white-space: nowrap;
}

.interval {
  height: 100%;
  width: 100px;
}






/*.max-length{
  width: 200px;
  }*/

.h-footer-title {
  justify-content: flex-start;
  height: 12%;
  width: 100%;
  color: #fff;
  font-size: 16px;
}

.h-footer-title-q {
  color: #999;
}

.h-footer-box {
  justify-content: flex-start;
  height: 12%;
  width: 100%;
  font-size: 13px;
}

.border-f {
  width: 100%;
  height: 1px;
  background-image: linear-gradient(to right, rgba(255, 255, 255, .2) 0%, rgba(255, 255, 255, .2) 50%, transparent 50%);
  background-size: 10px 1px;
  background-repeat: repeat-x;
  margin: 1% 0;
}

.c-y {
  color: #F0C030;
}






/*footer{
  width: 100%;
  height: 125px;
  padding-top: 10px;
  background: #242424;
  flex-wrap: wrap;
  align-content: center;
}
.footer-item{
  width: 100%;
  flex-shrink: 0;
  min-height: 30%;
  height: auto;
  margin-left: 15%;
  color: #fff;
  font-weight: 400;
  justify-content: flex-start;
}
.font-max{
  font-size: 22px;
}
.font-min{
  font-size: 14px;
  }*/

</style>
