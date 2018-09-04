<template>
  <div id="main-body" ref='mainbody'>
    <div class="main-box flex" id="main-box">
      <b-agent></b-agent>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/secret-books' }">抖音上推荐秘籍</el-breadcrumb-item>
        <el-breadcrumb-item>秘籍详情</el-breadcrumb-item>
      </el-breadcrumb>
      <div v-html="detail" class="detail-box" v-loading='loading'></div>
    </div>
  </div>
</template>
<script>
import BAgent from 'components/backstage-banner/backstage-banner'
import { getSecretBooksDetail } from 'api/secret-books'
import { testToken } from 'common/js/util'
import { mapGetters, mapMutations } from 'vuex'
import { SUCCESS_CODE } from 'api/config'

export default {
  data() {
    return {
      detail: '',
      loading: null
    }
  },
  created() {
    this.$root.eventHub.$on('secret-books', (id) => {
      this._getSecretBooksDetail(id)
    })
    const query = this.$route.query
    if (!query.id) {
      this.$router.replace({
        path: '/secret-books'
      })
      return false
    }
    this._getSecretBooksDetail(query.id)
  },
  computed: {
    ...mapGetters([
      'user',
      'token',
      'tokenTime'
    ])
  },
  methods: {
    _getSecretBooksDetail(id) {
      this.checkTock()
      this.loading = true
      getSecretBooksDetail(this.token, id).then((res) => {
        this.loading = null
        if (res.data.err_code === SUCCESS_CODE) {
          this.detail = res.data.data[0].text
          // this.tableData = this._formatTableData(res.data.data)
        } else {
          if (res.data.err_msg) {
            this.$parent._open(this.$root.errorCode[res.data.err_code])
          } else {
            this.$parent._open('似乎出错了')
          }
        }
      })
    },
    checkTock() {
      if (!testToken(this.tokenTime)) {
        this.setUser(false)
        this.setToken(false)
        this.setTokenTime(false)
        this.$router.replace({
          path: '/login'
        })
        return false
      }
      return true
    },
    ...mapMutations({
      setToken: 'SET_TOKEN',
      setUser: 'SET_USER',
      setApp: 'SET_APP',
      setTokenTime: 'SET_TOKENTIME'
    })
  },
  components: {
    BAgent
  }
}

</script>
<style scoped>
.main-box {
  justify-content: flex-start;
  align-content: flex-start;
  align-items: flex-start;
  padding: 10px 0 0 10px;
  flex-wrap: wrap;
}

.detail-box {
  width: 100%;
  height: auto;
  padding: 30px 10px;
  line-height: 20px;
  user-select: text;
}

</style>
