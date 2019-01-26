<template>
  <div class="index">
    <div class="index-main">
    </div>
  </div>
</template>

<script>
  import {access_token, get_openid} from 'api/index'

  export default {
    name: "tx-login",
    created() {
      // console.log(this.$route.query.code);
      this._getAccessToken()
    },
    methods: {
      async _getAccessToken() {
        const ret = await access_token(this.$route.query.code, 'http%3a%2f%2fwww.jiangzhifan.com%2f%23%2ftxLogin');
        // console.log(ret)
        if (ret.status === 200 && ret.data.state === 200) {
          this.$message({
            message: '登录成功',
            type: 'success',
            duration: 1000
          });
          this.$router.replace({
            path: '/index'
          });
          this.$root.user = ret.data;
          localStorage.setItem('user-info', encodeURIComponent(JSON.stringify(ret.data)));
        } else {
          this.$message({
            message: '授权登录失败',
            type: 'warning'
          });
          this.$router.replace({
            path: '/login/index'
          });
          return false
        }
      }
    }
  }
</script>

<style scoped>
  .tx-login {
  }
</style>
