<template>
  <div id="main-body" ref='mainbody'>
    <div class="main-box" id="main-box">
      <b-agent></b-agent>
      <div class="goods-table" v-if="tableData">
        <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
          <el-table-column prop="code" label="订单号" width="200" fixed>
          </el-table-column>
          <!--        <el-table-column prop="score" label="充值积分">
          </el-table-column> -->
          <el-table-column prop="price" label="充值金额">
          </el-table-column>
          <el-table-column prop="status" label="状态">
          </el-table-column>
          <el-table-column prop="pay_type" label="支付方式">
          </el-table-column>
          <el-table-column prop="create" label="提交时间">
          </el-table-column>
        </el-table>
        <div id="i-page" class="i-page flex">
          <el-pagination layout="prev, pager, next" :total="total" @current-change="handleCurrentChange">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import BAgent from 'components/backstage-banner/backstage-banner'
import { getOrders } from 'api/score-record'
import { mapGetters, mapMutations } from 'vuex'
import { SUCCESS_CODE } from 'api/config'
import { testToken, timeChange } from 'common/js/util'
const NUM = 11
export default {
  data() {
    return {
      tableData: [],
      currentPage1: 5,
      currentPage2: 5,
      currentPage3: 5,
      currentPage4: 4,
      loading: true,
      page: 0,
      total: 10
    }
  },
  created() {
    this.$root.eventHub.$on('updateScoreRecord', () => {
      this._getOrders()
    })
    this._getOrders()
    this.$root.eventHub.$emit('canvas')
  },
  computed: {
    ...mapGetters([
      'token',
      'tokenTime'
    ])
  },
  methods: {
    _getOrders() {
      if (!testToken(this.tokenTime) || !this.token) {
        this.setUser(false)
        this.setToken(false)
        this.setTokenTime(false)
        this.$parent._open('登录已失效')
        this.$router.replace({
          path: '/login'
        })
        return false
      }
      this.loading = true
      const that = this
      getOrders(this.token, NUM, this.page).then((res) => {
        this.loading = false
        if (res.data.err_code === SUCCESS_CODE) {
          this.total = res.data.data.count
          this.tableData = that._normalTime(res.data.data.data)
        }
      })
    },
    _normalTime(list) {
      // const that = this
      list.forEach((item) => {
        item.create = timeChange(item.create)
        item.status = item.status === 2 ? '已支付' : '未支付'
        item.pay_type = item.pay_type === 'wx' ? '微信' : item.pay_type === 'ali' ? '支付宝' : item.pay_type === 'qq' ? '腾讯' : item.pay_type
      })
      return list
    },
    handleSizeChange(val) {},
    handleCurrentChange(val) {
      // console.log(val - 1)
      this.page = val - 1
      this._getOrders()
    },
    handleClick(row) {
      // console.log(row.pay_url)
    },
    ...mapMutations({
      setToken: 'SET_TOKEN',
      setUser: 'SET_USER',
      setScorerate: 'SET_SCORERATE',
      setTokenTime: 'SET_TOKENTIME'
    })
  },
  components: {
    BAgent
  },
  watch: {}
}

</script>
<style scoped>
.i-chose {
  justify-content: flex-start;
}

.goods-table {
  width: 96%;
  margin: 0 auto;
  overflow: hidden;
}

.order-btn {
  background: rgba(255, 210, 54, 1);
  color: #353535;
  margin: 20px 10px;
  height: 40px;
}

</style>
