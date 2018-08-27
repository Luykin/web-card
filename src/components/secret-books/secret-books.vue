<template>
  <div id="main-body" ref='mainbody'>
    <div class="main-box flex" id="main-box">
      <b-agent></b-agent>
      <div class="flex secret-list" v-loading='loading'>
        <div class="secret-list-first cursor" :style="_bg(firstData.image)" v-if="firstData" @click="_todetail(firstData.id)">
          <div class="tag-sli flex" :style="_bgcolor(firstData.color)">{{firstData.tag}}</div>
        </div>
        <div class="secret-list-item cursor" @click="_todetail(item.id)" v-for="(item,index) in tableData" v-if="index !== 0 && item.image">
          <div class="tag-sli flex" :style="_bgcolor(item.color)">{{item.tag}}</div>
          <div class="img-sli" :style="_bg(item.image)"></div>
          <div class="info-sli flex">
            <div class="info-sli-left flex">{{item.label}}</div>
            <div class="info-sli-right flex ellipsis">{{item.update}}</div>
          </div>
        </div>
        <!--       	<div class="secret-list-item"></div>
      	<div class="secret-list-item"></div>
      	<div class="secret-list-item"></div> -->
      </div>
      <div id="i-page" class="i-page flex">
        <el-pagination layout="prev, pager, next" :total="total" @current-change="handleCurrentChange" :page-size="pageSize">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import BAgent from 'components/backstage-banner/backstage-banner'
import { getSecretBooks } from 'api/secret-books'
import { mapGetters, mapMutations } from 'vuex'
import { SUCCESS_CODE } from 'api/config'
import { timeChange, testToken } from 'common/js/util'
export default {
  data() {
    return {
      tableData: [],
      firstData: null,
      page: 0,
      total: 10,
      pageSize: 5,
      loading: null,
    }
  },
  created() {
    this._getSecretBooks()
  },
  computed: {
    // number() {
    //   if (this.page == 0) {
    //     return 5
    //   } else {
    //     return 6
    //   }
    // },
    ...mapGetters([
      'user',
      'token',
      'tokenTime'
    ])
  },
  methods: {
    _bgcolor(color) {
      if (!color || color.indexOf('#') < 0) {
        return 'background: red;'
      } else {
        return `background: ${color};`
      }
    },
    _bg(item) {
      if (item) {
        return `background: url(${item}) no-repeat; background-size: 100% 100%;`
      } else {
        return ''
      }
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
    _todetail(id) {
      this.$nextTick(() => {
        this.$root.eventHub.$emit('secret-books', id)
        this.$router.push({
          path: `/secret-books-detail?id=${id}`
        })
      })
    },
    _getSecretBooks() {
      this.checkTock()
      this.loading = true
      getSecretBooks(this.token, this.page, this.pageSize).then((res) => {
        this.loading = null
        if (res.data.err_code === SUCCESS_CODE) {
          this.tableData = this._formatTableData(res.data.data.data)
          this.firstData = this.tableData[0]
          this.total = res.data.data.total
        } else {
          if (res.data.err_msg) {
            this.$parent._open(this.$root.errorCode[res.data.err_code])
          } else {
            this.$parent._open('似乎出错了')
          }
        }
      })
    },
    _formatTableData(list) {
      list.forEach((item) => {
        item.update = timeChange(item.update)
      })
      return list
    },
    handleCurrentChange(val) {
      console.log(val - 1)
      this.page = val - 1
      this._getSecretBooks()
      console.log(`当前页: ${val}`)
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
  flex-wrap: wrap;
  justify-content: flex-start;
}

.secret-list {
  width: 98%;
  height: auto;
  min-height: 280px;
  align-items: flex-start;
  align-content: flex-start;
  justify-content: flex-start;
  flex-wrap: wrap;
}

.secret-list-first {
  width: 98%;
  /*	margin-left: 2%;*/
  margin: 10px 0 0px 2%;
  height: 350px;
  background: #000;
  overflow: hidden;
  position: relative;
}

.secret-list-item {
  box-sizing: border-box;
  width: 48%;
  margin: 10px 0 0px 2%;
  height: 280px;
  /*	background: #000;*/
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, .1);
}

.tag-sli {
  position: absolute;
  top: 0;
  left: 0;
  min-width: 70px;
  padding: 0 6px;
  width: auto;
  height: 30px;
  color: #fff;
  background: red;
  opacity: .85;
}

.img-sli {
  width: 100%;
  height: 70%;
  overflow: hidden;
}

.info-sli {
  width: 100%;
  height: 30%;
  font-size: 13px;
}

.info-sli-left {
  padding: 0 2%;
  width: 66%;
  height: 100%;
  line-height: 18px;
  justify-content: flex-start;
}

.secret-list-item:hover .info-sli-left {
  color: #F01818;
}

.info-sli-right {
  width: 30%;
  height: 100%;
}

</style>
