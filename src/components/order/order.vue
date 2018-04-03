<template>
  <div id="main-body">
    <div class="i-title flex" id="i-title">
      订单记录查询
    </div>
    <div class="i-table" id="i-table">
      <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
        <el-table-column prop="label" label="业务" width="120" fixed>
        </el-table-column>
        <el-table-column prop="id" label="订单ID">
        </el-table-column>
        <el-table-column prop="addition" label="分享链接/用户ID">
        </el-table-column>
        <el-table-column prop="point" label="数量">
        </el-table-column>
        <el-table-column prop="start_point" label="起始数量">
        </el-table-column>
        <el-table-column prop="currentNum" label="当前数量">
        </el-table-column>
        <el-table-column prop="status" label="状态">
        </el-table-column>
        <el-table-column prop="create" label="提交时间">
        </el-table-column>
      </el-table>
    </div>
    <div id="i-page" class="i-page flex">
      <el-pagination layout="prev, pager, next" :total="total" @current-change="handleCurrentChange">
      </el-pagination>
    </div>
  </div>
</template>
<script type="text/javascript">
import { getTasks, custom } from 'api/order'
import { mapGetters, mapMutations } from 'vuex'
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
      page: 0,
      total: 10,
      loading: false,
      timer: false,
      state: {
        '-9': '进行中',
        '-8': '订单失败',
        '-7': '进行中',
        '-6': '订单失败',
        '-5': '进行中',
        '-4': '已完成',
        '-3': '准备中',
        '-2': '准备中',
        '-1': '准备中',
        '0': '准备中',
        '1': '进行中',
        '2': '已完成',
        '3': '进行中',
        '4': '订单取消',
        '5': '订单取消'
      }
    }
  },
  created() {
    this.$root.eventHub.$on('updateOrder', () => {
      this._getTasks()
    })
    this.$nextTick(() => {
      this._getTasks()
    })
  },
  computed: {
    ...mapGetters([
      'token'
    ])
  },
  methods: {
    _getTasks() {
      if (!testToken() || !this.token) {
        this.setUser(false)
        this.setToken(false)
        localStorage['tokenTime'] = false
        this.$message({
          showClose: true,
          message: '登录已失效',
          type: 'warning'
        })
        this.$router.replace({
          path: '/login'
        })
        return false
      }
      this.loading = true
      const that = this
      getTasks(this.token, NUM, this.page).then((res) => {
        this.loading = false
        if (res.data.err_code === 0) {
          this.total = res.data.data.count
          this.tableData = that._normalTasks(res.data.data.tasks)
          this._timing(this.tableData)
        }
      })
    },
    _normalTasks(list) {
      const that = this
      list.forEach((item) => {
        // item.status = that.state[item.status]
        item.create = timeChange(item.create)
        item.currentNum = '-'
      })
      return list
    },
    _timing(list) {
      if (this.timer) {
        return
      }
      const that = this
      that._asynchronousUpdate(list)
      this.timer = setInterval(() => {
        that._asynchronousUpdate(list)
      }, 120000)
    },
    _asynchronousUpdate(list) {
      const that = this
      let promiseList = []
      let ret = list
      ret.forEach((item, index) => {
        promiseList[index] = new Promise(function(resolve, reject) {
          console.log(item)
          if (item.status == 1 || item.status == 3 || item.status == -5 || item.status == -7 || item.status == -9) {
            console.log('进行中')
            item.status = that.state[item.status]
            item.currentNum = that._queryNum(index, item, resolve)
          } else {
            item.currentNum = '-'
            item.status = that.state[item.status]
            resolve()
          }
        })
      })
      Promise.all(promiseList).then(() => {
        setTimeout(() => {
          console.log('所有请求完成')
          that.tableData = ret
        })
      })
    },
    _queryNum(index, item, resolve) {
      let num = '-'
      const category = item.service_category
      console.log(category)
      custom(item.addition).then((res) => {
        console.log(res)
        if (res) {
          // 快手
          if (category >= 20 && category < 30) {
            const start = res.data.indexOf("window.__data__ = ")
            const end = res.data.indexOf("240\"};")
            if (start > 0 && end > start) {
              const statistics = JSON.parse(res.data.slice(start + 18, end + 5))
              if (category === 20) {
                num = statistics.photo.likeCount
              }
              if (category === 22) {
                num = statistics.photo.viewCount
              }
              if (category === 23) {
                num = statistics.photo.commentCount
              }
            }
          }
          // 全名K歌
          if (category >= 30 && category < 40) {
            const start = res.data.indexOf("window.__DATA__ = ")
            const end = res.data.indexOf("}; </")
            if (start > 0 && end > start) {
              const statistics = JSON.parse(res.data.slice(start + 18, end + 1))
              if (category === 30) {
                num = statistics.data.follower
              }
              if (category === 31) {
                num = statistics.detail.comment_num
              }
              if (category === 32) {
                num = statistics.detail.play_num
              }
              if (category === 33) {
                num = statistics.detail.flower_num
              }
            }
          }
          // 抖音
          if (item.category >= 40 && item.category < 50) {
            const start = res.data.indexOf("statistics")
            const end = res.data.indexOf("music\":{")
            if (start > 0 && end > start) {
              const statistics = JSON.parse(res.data.slice(start + 12, end - 2))
              if (category == 41) {
                num = statistics.play_count
              }
              if (category == 42) {
                num = statistics.digg_count
              }
              if (category == 43) {
                num = statistics.comment_count
              }
            }
          }
        }
        resolve()
        return num
      })
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(val - 1)
      this.page = val - 1
      this._getTasks()
      console.log(`当前页: ${val}`)
    },
    ...mapMutations({
      setToken: 'SET_TOKEN',
      setUser: 'SET_USER',
      setScorerate: 'SET_SCORERATE'
    })
  },
  watch: {}
}

</script>
<style type="text/css" scoped>


</style>
