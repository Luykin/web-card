<template>
  <div id="main-body">
    <div class="main-box" id="main-box">
      <div class="main-box-header flex">
      </div>
      <div class="course">
        回放如果需要点赞请在下方打勾点赞切记！新增回放访问功能!请在选择下拉菜单中的一直播回放下单! 新增预约功能!到达预约时间后,系统开始自动检测上人!大单子推荐使用预约功能,可以加快上人速度! 无预约,主播开播1分钟内自动检测上人气! 认证过V的主播可以上100万人气，没认证过的主播最高上32万，谨记! 若需要更多人气,请提前与我们联系，人气不叠加如果连续下两个订单，只会识别最高人气的订单 有问题加微信客服：renqizhushou
      </div>
      <div class="select-box flex">
        <div class="select-item">
          <div class="select-item-label flex">业务1</div>
          <el-select v-model="value" placeholder="请选择" class="index-select">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="select-item">
          <div class="select-item-label flex">业务2</div>
          <el-select v-model="value" placeholder="请选择" class="index-select">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="btn flex">提交订单</div>
    </div>
  </div>
</template>
<script type="text/javascript">
export default {
  data() {
    return {
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      value: ''
    }
  }
}

</script>
<style type="text/css" scoped>
.main-box-header {
  width: 100%;
  min-height: 65px;
  height: auto;
  flex-wrap: wrap;
  background: #dcdcdc;
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
.index-select{
  width: 100%;
}
.select-item-label{
  height: 20px;
  justify-content: flex-start;
  text-indent: 16px;
  color: #606266;
}
.select-item{
  margin: 10px auto;
}
.btn{
  width: 115px;
  height: 45px;
  background: #ff9430;
  box-shadow: 2px 2px 5px rgba(0,0,0,.2);
  color: #fff;
  font-size: 14px;
  margin: 10px 20px;
}
</style>
