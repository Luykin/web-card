<template>
  <div id="main-body">
    <div class="i-title flex" id="i-title">
      订单记录查询
    </div>
    <div class="i-table" id="i-table">
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="date" label="订单号" width="120" fixed>
        </el-table-column>
        <el-table-column prop="name" label="充值金额">
        </el-table-column>
        <el-table-column prop="address" label="支付方式">
        </el-table-column>
        <el-table-column prop="address" label="状态">
        </el-table-column>
        <el-table-column prop="address" label="提交时间">
        </el-table-column>
      </el-table>
    </div>
    <div id="i-page" class="i-page flex">
      <el-pagination layout="prev, pager, next" :total="50" @current-change="handleCurrentChange">
      </el-pagination>
    </div>
  </div>
</template>
<script type="text/javascript">
export default {
  data() {
    return {
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普'
      }, {
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普'
      }, {
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普'
      }, {
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普'
      }, {
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普'
      }, {
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普'
      }, {
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普'
      }, {
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普'
      }, {
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普'
      }, {
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普'
      }, {
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普'
      }, {
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普'
      }, {
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普'
      }, {
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普'
      }, {
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普'
      }],
      currentPage1: 5,
      currentPage2: 5,
      currentPage3: 5,
      currentPage4: 4
    }
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
    }
  }
}

</script>
<style type="text/css" scoped>


</style>
