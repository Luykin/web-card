<template>
    <footer class="flex">
      <div id="footer-item" class="footer-item font-max flex">联系我们</div>
      <div id="footer-item" class="footer-item font-min flex">客服电话：13212399922</div>
      <div id="footer-item" class="footer-item font-min flex">客服微信：fans10005</div>
    </footer>
</template>
<script type="text/javascript">
export default {}

</script>
<style type="text/css" scoped>
footer{
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
  /*margin-top: 5px;*/
}
.font-min{
  font-size: 14px;
/*  height: 25%;*/
}
</style>
