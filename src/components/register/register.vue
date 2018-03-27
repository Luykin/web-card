<template>
  <div id="main-body">
    <div class="login-box" id="login-box">
      <div class="login-box-title flex">
        <div>注册</div>
        <div class="min-font flex">注册帐号开始下单</div>
      </div>
      <div class="input-box flex">
        <input type="text" placeholder="用户名" class="i-ipnput">
        <i class="iconfont icon-msnui-user"></i>
      </div>
      <div class="input-box flex">
        <input type="text" placeholder="密码" class="i-ipnput">
        <i class="iconfont icon-mima"></i>
      </div>
      <div class="input-box flex">
        <input type="text" placeholder="验证码" class="i-ipnput">
        <i class="iconfont icon-duanxin"></i>
      </div>
      <div class="btn flex">注册</div>
    </div>
  </div>
</template>
<script type="text/javascript">
export default {}

</script>
<style type="text/css" scoped>
.login-box-title{
  width: 100%;
  height: 105px;
  font-size: 18px;
  flex-wrap: wrap;
  align-content: center;
}
.min-font{
  width: 100%;
  font-size: 13px;
  color: #bdbdbd;
  margin: 10px auto;
}
</style>
