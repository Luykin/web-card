<template>
  <div id="main-body" ref='mainbody'>
    <div class="main-box" id="main-box">
      <b-agent></b-agent>
      <div class="goods-table" v-if="tableData">
        <div class="i-chose flex">
          <el-select v-model="chose" placeholder="请选择" no-data-text="暂无业务">
            <el-option v-for="item in choseItem" :key="item.choseTitle" :label="item.choseTitle" :value="item.id">
            </el-option>
          </el-select>
          <div class="btn flex order-btn" @click='_chose'>筛选</div>
          <div class="btn flex order-btn" @click='_reset'>重置</div>
        </div>
        <el-table :data="tableData" style="width: 100%" v-loading="loading" :row-class-name="tableRowClassName">
          <el-table-column prop="label" label="业务">
          </el-table-column>
          <el-table-column prop="id" label="订单ID">
          </el-table-column>
          <el-table-column prop="addition" label="链接/ID">
          </el-table-column>
          <el-table-column label="">
            <template slot-scope="scope">
              <el-button @click="_viewLink(scope.row)" type="text" size="small" v-if="scope.row.showLink">查看链接</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="start_point" label="初量">
          </el-table-column>
          <el-table-column prop="point" label="数量">
          </el-table-column>
          <el-table-column prop="score" label="价格">
          </el-table-column>
          <el-table-column prop="status" label="状态">
          </el-table-column>
          <!--           <el-table-column prop="time" label="预计完成">
          </el-table-column> -->
          <el-table-column prop="appointment_time" label="预约时间">
          </el-table-column>
          <el-table-column prop="createA" label="提交时间">
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
import { getTasks, custom } from 'api/order'
import { mapGetters, mapMutations } from 'vuex'
import { SUCCESS_CODE } from 'api/config'
import { testToken, timeChange } from 'common/js/util'
const NUM = 10
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
        '-10': '未支付',
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
      },
      chose: '全部订单',
      time: false,
      choseItem: []
    }
  },
  created() {
    this.$root.eventHub.$on('updateOrder', () => {
      this._getTasks()
    })
    this.$nextTick(() => {
      this._getTasks()
    })
    this.$root.eventHub.$emit('canvas')
    this._orderInt()
  },
  computed: {
    ...mapGetters([
      'token',
      'tokenTime',
      'app'
    ])
  },
  methods: {
    _viewLink(e) {
      window.open(e.hrefLink)
    },
    _orderInt() {
      this.choseItem = this.app.service_categories.concat([])
      this.choseItem.forEach((item) => {
        item.choseTitle = item.label + '订单'
      })
      this.choseItem.unshift({
        choseTitle: '全部订单',
        id: -1
      })
    },
    _chose() {
      if (this.time) {
        this.$parent._open('请勿频繁筛选')
        return false
      }
      if (!this.chose) {
        this.$parent._open('请选择一个类别筛选')
        return false
      }
      // console.log(this.chose)
      if (this.chose < 0 || isNaN(this.chose)) {
        this._reset()
        return false
      }
      this._getTasks(this.chose)
      const that = this
      this.time = setTimeout(() => {
        clearTimeout(that.time)
        that.time = false
      }, 1500)
    },
    _reset() {
      this.chose = '全部订单'
      this._getTasks()
    },
    tableRowClassName({ row, rowIndex }) {
      // console.log(row)
      if (row.status === '已完成') {
        return 'success-row'
      } else if (row.status === '进行中') {
        return 'doing-row'
      }
      return ''
    },
    _getTasks(id) {
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
      // const that = this
      if (id) {
        // console.log(id)
        getTasks(this.token, NUM, this.page, id).then((res) => {
          this.afterGetTasks(res, this)
        })
      } else {
        getTasks(this.token, NUM, this.page).then((res) => {
          this.afterGetTasks(res, this)
        })
      }
    },
    afterGetTasks(res, that) {
      this.loading = false
      if (res.data.err_code === SUCCESS_CODE) {
        this.total = res.data.data.count
        this.tableData = that._normalTasks(res.data.data.tasks)
        // this._timing(this.tableData)
        setInterval(() => {
          that._countDown(this.tableData)
        }, 1000)
      }
    },
    _countDown(list) {
      const that = this
      let time = Date.parse(new Date()) / 1000
      list.forEach((item) => {
        // console.log(item.status)
        if (item.status === '完成' || item.status === '未支付') {
          item.time = '-'
          return
        }
        if (item.status === '准备中') {
          item.time = '-'
        } else {
          if (item.cost_time + item.create > time) {
            item.time = that.normalTimeCountDown(item.cost_time + item.create - time)
          } else {
            item.time = '00:00:01'
          }
        }
      })
    },
    normalTimeCountDown: function(item) {
      let day = item / 3600 >= 24 ? parseInt(item / (3600 * 24)) : 0 // 天
      let hour = (item - day * 24 * 3600) / 3600 >= 1 ? parseInt((item - day * 24 * 3600) / 3600) : 0 // 小时
      let minute = (item - day * 24 * 3600 - hour * 3600) / 60 >= 1 ? parseInt((item - day * 24 * 3600 - hour * 3600) / 60) : 0 // 分钟
      let second = item - day * 24 * 3600 - hour * 3600 - minute * 60 // 秒
      day = day === 0 ? '' : day + ':'
      hour = hour === 0 ? '00:' : hour < 10 ? '0' + hour + ':' : hour + ':'
      minute = minute === 0 ? '' : minute < 10 ? '0' + minute + ':' : minute + ':'
      second = second < 10 ? '0' + second : second
      return day + hour + minute + second
    },
    _normalTasks(list) {
      const that = this
      list.forEach((item) => {
        item.hrefLink = item.addition
        item.status = that.state[item.status]
        item.createA = timeChange(item.create)
        item.currentNum = '-'
        item.time = '-'
        if (item.hrefLink.indexOf('http') > -1) {
          item.showLink = true
        } else {
          item.showLink = false
        }
        if (item.appointment_time) {
          item.appointment_time = timeChange(item.appointment_time)
        } else {
          item.appointment_time = '-'
        }
        if (item.addition.length >= 15) {
          item.addition = item.addition.slice(0, 12) + '...'
          // console.log(item.addition)
        }
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
          // console.log(item)
          if (item.status === 1 || item.status === 3 || item.status === -5 || item.status === -7 || item.status === -9) {
            // console.log('进行中')
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
          that.tableData = ret
        })
      })
    },
    _queryNum(index, item, resolve) {
      let num = '-'
      const category = item.service_category
      // console.log(category)
      custom(item.addition).then((res) => {
        // console.log(res)
        if (res) {
          // 快手
          if (category >= 20 && category < 30) {
            const start = res.data.indexOf('window.__data__ = ')
            const end = res.data.indexOf('240\"};')
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
            const start = res.data.indexOf('window.__DATA__ = ')
            const end = res.data.indexOf('}; </')
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
            const start = res.data.indexOf('statistics')
            const end = res.data.indexOf('music\":{')
            if (start > 0 && end > start) {
              const statistics = JSON.parse(res.data.slice(start + 12, end - 2))
              if (category === 41) {
                num = statistics.play_count
              }
              if (category === 42) {
                num = statistics.digg_count
              }
              if (category === 43) {
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
