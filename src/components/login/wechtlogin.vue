<template>
	<div id="main-body" ref='mainbody' class="flex">
		<div class="flex tips">{{titps}}</div>
	</div>
</template>

<script type="text/javascript">
	import { addAccount } from 'api/site'
	export default {
		data() {
			return {
				titps: '绑定中,请稍候...',
			}
		},
		created() {
			const url = window.location.href
			const start = url.indexOf('code=') + 5
			const end = url.indexOf('&state')
			if (start > 4 && end > -1  && this.$route.query.token) {
				console.log(this.$route.query.token)
				console.log(url.slice(start, end))
				this._addAccount(this.$route.query.token, url.slice(start, end))
			} else {
				if (this.$route.query.redirect == 'login' && this.$route.query.token) {
					window.location.href =  `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx63fdbdaf7aa236c9&redirect_uri=http%3a%2f%2fdev.xkfans.com%2f%23%2fwxlogin?token=${this.$route.query.token}&response_type=code&scope=snsapi_base#wechat_redirect`
				}
			}
		},
		computed: {
		},
		methods: {
			async _addAccount(token, wx_code) {
				try {
					const ret = await addAccount(token, '1', '1', '1', '1', wx_code)
					if (ret.status == 200 && ret.data.err_code == 200) {
						this.titps = '星空提现账户与微信绑定成功，请继续完成账户绑定!'
					} else {
						this.titps = '绑定失败!'
					}
				} catch(err) {
					console.log(err)
				}
			}
		}
	}
</script>

<style scoped>
#main-body{
	background: rgba(0,0,0,.85);
}
.tips{
	color: #44b549;
	font-size: 22px;
	width: 100%;
	height: 100px;
	padding: 0 20px;
	line-height: 40px;
	margin-bottom: 100px;
}
</style>