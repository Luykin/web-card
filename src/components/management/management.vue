<template>
	<div id="main-body" ref='mainbody'>
  	<div class="main-box" id="main-box">
      <!--  右侧边栏start -->
  		<div class="notice">
  			<div class="notice-heder flex">
  				<div class="mg-btn flex dengji-warp">代理等级</div>
  			</div>
  			<div class="notice-item flex">
  				<div class="notice-item-left flex">我的账户</div>
  				<div class="notice-item-right flex">17323456</div>
  		  </div>
  			<div class="notice-item flex">
  				<div class="notice-item-left flex">我的余额</div>
  				<div class="notice-item-right flex">100000</div>
  			</div>
  			<div class="notice-item flex">
  				<div class="notice-item-left flex">我的账户</div>
  				<div class="notice-item-right flex">17323456</div>
  			</div>
  			<div class="mg-btn flex cursor notice-heder-btn">提现</div>
  		</div>
      <!--  右侧边栏end -->
      <div class="configure-box flex">
        <div class="cb-left flex">
          <div class="cb-left-logo"></div>
        </div>
        <div class="cb-right">
          <div class="cr-item flex">
            分站名称:
            <div class="cr-box-min flex">12312</div>
            <div class="cr-box-btn mg-btn flex cursor">分站编辑</div>
          </div>
          <div class="cr-item flex">
            我的分站:
            <div class="cr-box-min flex">12312</div>
            <div class="cr-box-btn mg-btn flex cursor">复制链接</div>
          </div>
          <div class="cr-item flex">
            首页公告:
            <div class="cr-box-max flex">12312首页公告首页公告首页公告</div>
          </div>
          <div class="cr-item flex">
            尾页信息:
            <div class="cr-box-max flex">邮 箱： 1342343@qq.com</div>
          </div>                   
        </div>
      </div>
      <div class="partition"></div>
  		<div class="income-box flex">
  			<div class="income-box-item cursor"></div>
  			<div class="income-box-item cursor"></div>
  			<div class="income-box-item cursor"></div>
  			<div class="income-box-item cursor"></div>
  		</div>
  		<div class="mg-btn flex mg-min-btnwidth cursor">查看明细</div>
		</div>
  </div>
</template>
<script type="text/javascript">
export default {
  data() {
    return {
    }
  },
  created() {
  },
  computed: {
  },
  methods: {
  },
  components: {
  },
}

</script>
<style type="text/css" scoped>
#main-box{
	opacity: 1 !important;
}
.notice{
  position: absolute;
  right: 0;
  top: 0;
  transform: translate(106%, 0);
  min-height: 5%;
 /* max-height: 50%;*/
  width: 42%;
  background: #fff;
  padding-bottom: 10px;
}
.income-box{
	width: 100%;
	height: 160px;
}
.income-box-item{
	width: 18%;
	margin: 3%;
	padding-bottom: 18%;
	border-radius: 10px;
	box-shadow: 0 0 10px rgba(0,0,0,.2);
}
.mg-btn{
	height: 40px;
	min-width: 90px;
	border-radius: 5px;
	background: rgba(255,210,54,1);
	color: #333;
}
.mg-min-btnwidth{
	margin: 0 auto;
	width: 30%;
}
.notice-heder{
	height: 100px;
	border-bottom: 1px solid #ddd;
}
.notice-item{
	height: 45px;
	width: 100%;
}
.notice-item-left{
	width: 25%;
}
.notice-item-right{
	justify-content: flex-end;
	padding-right: 5%;
	width: 70%;
}
.dengji-warp{
	width: 90%;
}
.notice-heder-btn{
	width: 80%;
	margin: 10px auto;
}
.configure-box{
  width: 100%;
  background: #fff;
  height: 400px;
}
.cb-left{
  width: 30%;
  height: 100%;
  align-items: flex-start;
  overflow: hidden;
}
.cb-right{
  width: 70%;
  height: 100%;
  overflow: hidden;
  align-items: flex-start;
}
.partition{
  width: 100%;
  background: #ddd;
  height: 20px;
}
.cb-left-logo{
  width: 80%;
  padding-bottom: 80%;
  background: #eee;
  margin: 20px auto 0;
}
.cr-item{
  width: 100%;
  margin-top: 20px;
}
.cr-box-min{
  width: 60%;
  flex-grow: 1;
  height: 40px;
  margin: 0 10px;
  border-radius: 5px;
  background: #ddd;
  text-indent: 10px;
  justify-content: flex-start;
  overflow: hidden;
}
.cr-box-btn{
  width: 100px;
  margin-right: 20px;
}
.cr-box-max{
  /*width: 60%;*/
  height: 100px;
  margin: 0 10px;
  border-radius: 5px;
  background: #ddd;
  text-indent: 10px;
  justify-content: flex-start;
  flex-grow: 1;
  margin-right: 10px;
  align-items: flex-start;
  line-height: 40px;
  overflow: hidden;
}
</style>
