<template>
	<div id="main-body" ref='mainbody'>
  	<div class="main-box" id="main-box">
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
</style>
