<template>
	<div class="edit-box">
		<div class="edit-content">
			<div class="edit-logo"></div>
			<div class="cr-item flex">
        <div class="cr-box-tit ellipsis flex">分站名称:</div>
          <div class="cr-box-min flex">12312</div>
        </div>
        <div class="cr-item flex">
          <div class="cr-box-tit ellipsis flex">我的分站:</div>
          <div class="cr-box-min flex">12312</div>
        </div>
        <div class="cr-item flex">
          <div class="cr-box-tit ellipsis flex">标题后缀:</div>
          <div class="cr-box-max flex">12312首页公告首页公告首页公告</div>
        </div>
        <div class="cr-item flex">
          <div class="cr-box-tit ellipsis flex">首页公告:</div>
          <div class="cr-box-max flex">12312首页公告首页公告首页公告</div>
        </div>
        <div class="cr-item flex">
          <div class="cr-box-tit ellipsis flex">尾页信息:</div>
          <div class="cr-box-max flex">邮 箱： 1342343@qq.com</div>
        </div>
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
  	const that = this
  	that.$root.eventHub.$on('updataEditInfo', (res) => {
      that._updataEditInfo(that)
    })
  },
  computed: {
  },
  methods: {
  	_updataEditInfo() {
  		console.log('g')
  	}
  },
  components: {
  },
}
</script>
<style scoped>
  .edit-logo{
  	width: 15%;
  	padding-top: 15%;
  	background: #eee;
  	margin: 10px auto;
  }
	.edit-box{
 		width: 100%;
 		min-height: 950px !important;
 		height: auto;
 		background: #fff;
 		opacity: 1;
 		padding-top: 85px;
 		background: #eee;
	}
	.edit-content{
		width: 90%;
		max-width: 1100px;
		min-height: 900px;
		height: auto;
		margin: 0 auto;
		/*transform: translate(0 , 10%);*/
		background: #fff;
		overflow: hidden;
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
  margin-right: 5%;
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
  height: 100px;
  margin: 0 10px;
  border-radius: 5px;
  background: #ddd;
  text-indent: 10px;
  justify-content: flex-start;
  flex-grow: 1;
  margin-right: 5%;
  align-items: flex-start;
  line-height: 40px;
  overflow: hidden;
}
.cr-box-tit{
  width: 20%;
  max-width: 80px;
  height: 100%;
  margin: 0 3%;
}
</style>