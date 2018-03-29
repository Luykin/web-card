<template>
  <div id="main-body">
    <div class="main-box" id="main-box">
      <div class="main-box-header flex">
        <div class="mbh-item flex" v-for="item in serviceCategory" :class="{'activeCategory':activeCategory == item.id}" @click="_chose(item.id)">
          <img :src="item.icon" class="mbh-icon">
          <div class="mbh-label flex">{{item.label}}</div>
        </div>
      </div>
      <div class="course" v-for="item in showService" v-show="item.category === choseServiceValue">
        {{item.tips || '快去下单吧~'}}
      </div>
      <div class="select-box flex">
        <div class="select-item">
          <div class="select-item-label flex">业务</div>
          <el-select v-model="choseServiceValue" placeholder="请选择" class="index-select" v-if="showService" @change="_setTips" no-data-text="暂无业务">
            <el-option v-for="item in showService" :key="item.label" :label="item.label" :value="item.category">
            </el-option>
          </el-select>
        </div>
<!--         <div class="select-item" :class="{width100:!bespeak}">
          <el-checkbox v-model="bespeak">预约</el-checkbox>
        </div>
        <div class="select-item" v-show="bespeak">
          {{bespeakDate}}
          <el-date-picker v-model="bespeakDate" type="datetime" placeholder="选择日期时间" value-format="timestamp" format="yyyy-MM-dd hh-mm-ss">
          </el-date-picker>
        </div> -->
      </div>
      <div class="btn flex">提交订单</div>
    </div>
  </div>
</template>
<script type="text/javascript">
import { getServiceCategory, getServices } from 'api/index'
export default {
  data() {
    return {
      choseServiceValue: '',
      bespeakDate: '',
      bespeak: false,
      serviceCategory: false,
      services: [],
      activeCategory: false,
      showService: false
    }
  },
  created() {
    this._initNet()
  },
  methods: {
    _chose(id) {
      if (!this.services[id]) {
        this._getServices(this, id)
      } else {
        this.showService = this.services[id]
        console.log(this.showService)
        this.choseServiceValue = this.showService[0] ? this.showService[0].category : ''
      }
      this.activeCategory = id
    },
    _initNet() {
      const that = this
      this._getServiceCategory(that) // 服务类别
    },
    _setTips(res) {
      console.log(res)
    },
    _getServiceCategory(that) {
      getServiceCategory().then((res) => {
        if (res.data.status === 'ok') {
          that.serviceCategory = res.data.data
          console.log(res.data.data[0].id)
          that.activeCategory = res.data.data[0].id
          that._getServices(that, res.data.data[0].id) //服务
        } else {
          if (res.data.err_msg) {
            this.$message({
              showClose: true,
              message: res.data.err_msg,
              type: 'error'
            })
          } else {
            this.$message({
              showClose: true,
              message: '似乎出错了',
              type: 'error'
            })
          }
        }
      })
    },
    _getServices(that, id) {
      getServices(id).then((res) => {
        if (res.data.status === 'ok') {
          that.services[that.activeCategory] = res.data.data
          that.showService = res.data.data
          that.choseServiceValue = that.showService[0] ? this.showService[0].category : ''
        } else {
          if (res.data.err_msg) {
            this.$message({
              showClose: true,
              message: res.data.err_msg,
              type: 'error'
            })
          } else {
            this.$message({
              showClose: true,
              message: '似乎出错了',
              type: 'error'
            })
          }
        }
      })
    }
  }
}

</script>
<style type="text/css" scoped>
.mbh-item {
  height: 65px;
  min-width: 60px;
  max-width: 70px;
  flex-grow: 1;
  width: auto;
  flex-wrap: wrap;
  align-content: center;
}

.activeCategory {
  background: #ff9430;
  /*color: #fff;*/
}

.activeCategory .mbh-label {
  color: #fff;
}

.mbh-item:hover {
  /*  background: #ff9430;*/
  cursor: pointer;
}

.mbh-item:hover .mbh-label {
  animation: color .2s ease 1 forwards;
}

.activeCategory:hover .mbh-label {
  animation: none !important;
  color: #fff;
}

.mbh-icon {
  width: 30px;
  height: 30px;
}

.mbh-label {
  margin-top: 5px;
  width: 100%;
  flex-shrink: 0;
  color: #666;
  font-size: 13px;
}

.main-box-header {
  width: 100%;
  min-height: 65px;
  height: auto;
  flex-wrap: wrap;
  justify-content: flex-start;
  background: #dcdcdc;
}

@keyframes color {
  0% {
    color: #666;
  }
  100% {
    color: #ff9430;
  }
}

.course {
  width: 85%;
  height: auto;
  margin: 20px auto;
  background-color: #F3DFDF;
  border: 1px solid #EBCED1;
  line-height: 20px;
  font-size: 14px;
  border-radius: 6px;
  padding: 10px;
  color: #A94442;
}

.select-box {
  width: 90%;
  height: auto;
  margin: 20px auto;
  justify-content: flex-start;
  flex-wrap: wrap-reverse;
}

.index-select {
  width: 100%;
}

.select-item-label {
  height: 20px;
  justify-content: flex-start;
  text-indent: 16px;
  color: #606266;
}

.select-item {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  height: auto;
  min-height: 60px;
  margin: 10px 1%;
}

.width100 {
  width: 100% !important;
}

</style>
