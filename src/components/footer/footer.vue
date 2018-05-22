<template>
  <footer class="flex new-footer">
    <div class="footer-item flex shpc">
      <div class="footer-item-title footer-item-item flex">商务合作</div>
      <div class="footer-item-name footer-item-item flex">商务联系：{{name}}</div>
      <div class="footer-item-name footer-item-item flex">联系邮箱：{{emil}}</div>
    </div>
    <div class="footer-item flex shpc">
      <div class="footer-item-title footer-item-item flex"></div>
      <div class="footer-item-name footer-item-item flex">商务联系：钟先生</div>
      <div class="footer-item-name footer-item-item flex">联系邮箱：raynor@melonblock.com</div>
    </div>
    <div class="footer-item flex shpc">
      <div class="footer-item-title footer-item-item flex">商务合作</div>
      <div class="footer-item-name footer-item-item flex">QQ联系: 42428851</div>
    </div>
    <div class="h-footer-title flex sh-phone">商务合作</div>
    <div class="h-footer-box flex sh-phone">商务联系：{{name}}</div>
    <div class="h-footer-box flex sh-phone">联系邮箱：{{emil}}</div>
    <div class="border-f sh-phone"></div>
    <div class="h-footer-box flex sh-phone">商务联系：钟先生</div>
    <div class="h-footer-box flex sh-phone">联系邮箱：raynor@melonblock.com</div>
    <div class="h-footer-title flex sh-phone">商务联系</div>
    <div class="h-footer-title h-footer-title-q flex sh-phone">QQ联系：<span class="c-y">42428851</span></div>
  </footer>
</template>
<script type="text/javascript">
export default {
    data() {
      return {
        name:'张先生',
        emil: 'zhangheng@melonblock.com'
      }
    },
    created() {
      const that = this
      this.$root.eventHub.$on('footername', (footer) => {
        that.name = footer
      })
      this.$root.eventHub.$on('footeremail', (footer) => {
        that.emil = footer
      })
    }
}

</script>
<style type="text/css" scoped>
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
