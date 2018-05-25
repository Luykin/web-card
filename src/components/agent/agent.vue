<template>
  <div class="agent-body">
    <div class="btn-warp shpc">
      <img src="http://p70pqu6ys.bkt.clouddn.com/banner01.jpg" class="agent-body-banner">
      <div class="btn-agent flex cursor shpc" @click="_emitAgent">免费申请</div>
    </div>
    <div class="btn-warp sh-phone">
      <img src="http://p70pqu6ys.bkt.clouddn.com/phone_banner1.png" class="agent-body-banner">
      <div class="btn-agent flex cursor sh-phone" @click="_emitAgent">免费申请</div>
    </div>
    <div class="agent-body-title flex shpc">
      <img src="http://p70pqu6ys.bkt.clouddn.com/pc%E6%A0%87%E9%A2%98%E4%B8%80@2x.png" class="title-img">
    </div>
    <div class="agent-body-title flex sh-phone">
      <img src="http://p70pqu6ys.bkt.clouddn.com/%E6%A0%87%E9%A2%98%E4%B8%80@2x.png" class="title-img">
    </div>
    <div class="agent-body-privilege-one flex">
      <div class="abp-item flex cursor" v-for='(item, index) in pcPrivilege' :class="{'shpc': index > 3}">
        <div class="abp-item-border-top"></div>
        <img :src="item.img" class="ai-icon">
        <div class="ai-content flex">
          <div class="ai-content-title flex">{{item.title}}</div>
          <div class="ai-content-info flex">{{item.info1}}</div>
          <div class="ai-content-info flex">{{item.info2}}</div>
        </div>
      </div>
    </div>
    <div class="flex info-for-web-warp">
      <div class="flex info-for-web">
        <div class="info-for-web-item flex">沿用第三代全新技术构架</div>
        <div class="info-for-web-item flex"><span class="font-w">0风险</span>，专属代理客服24小时为您护航</div>
        <div class="info-for-web-item flex"><span class="font-w">高收益</span>，成熟营销体系助您快速盈利</div>
        <div class="info-for-web-item flex"><span class="font-w">超省心</span>，完善的分站搭建技术，一键上线</div>
      </div>
    </div>
    <!-- <img src="http://p70pqu6ys.bkt.clouddn.com/banner2.png" class="agent-body-banner"> -->
    <div class="agent-body-privilege-warp">
      <div class="agent-body-title flex shpc">
        <img src="http://p70pqu6ys.bkt.clouddn.com/pc%E8%87%B3%E5%B0%8A%E4%BB%A3%E7%90%86%E4%B8%9A%E5%8A%A1%E6%A0%87%E9%A2%98%E4%BA%8C@2x.png" class="title-img">
      </div>
      <div class="agent-body-title flex sh-phone">
        <img src="http://p70pqu6ys.bkt.clouddn.com/%E6%A0%87%E9%A2%98%E4%BA%8C@2x.png" class="title-img">
      </div>
      <div class="agent-body-privilege flex">
        <div class="business-item flex" v-for="(item, index) in businessItem" :class="{'shpc': index > 7}"><img :src="item" class="abp-item-img1 cursor"></div>
      </div>
      <div class="customized">
        <div class="customized-warp flex ellipsis">更多代理业务可<span class="Pink">联系我们</span>，为你定制开发!</div></div>
    </div>
  </div>
</template>
<script type="text/javascript">
export default {
  data() {
    return {
      pcPrivilege: [{
        img: 'http://p70pqu6ys.bkt.clouddn.com/%E6%90%AD%E5%BB%BA%E4%BB%A3%E7%90%86icon@2x.png',
        title: '搭建代理分站',
        info1: '全方位免费技术支持',
        info2: '一键搭建自己分站'
      }, {
        img: 'http://p70pqu6ys.bkt.clouddn.com/%E4%BB%A3%E7%90%86%E6%8A%98%E6%89%A3icon@2x.png',
        title: '代理尊享折扣',
        info1: '超低下单价格',
        info2: '最低可至3折'
      }, {
        img: 'http://p70pqu6ys.bkt.clouddn.com/%E4%B8%93%E4%BA%AB%E5%AE%9A%E5%88%B6icon@2x.png',
        title: '专项定制方案',
        info1: '用最低的成本',
        info2: '成为最耀眼的网红'
      }, {
        img: 'http://p70pqu6ys.bkt.clouddn.com/%E6%B4%BB%E5%8A%A8%E7%89%B9%E6%9D%83icon@2x.png',
        title: '代理活动特权',
        info1: '定期代理优惠活动',
        info2: '等你来抢'
      }, {
        img: 'http://p70pqu6ys.bkt.clouddn.com/%E7%A6%8F%E5%88%A9%E7%89%B9%E6%9D%83icon@2x.png',
        title: '预充福利特权',
        info1: '预充就送',
        info2: '超额回馈，多充多得'
      }],
      // webInfo: ['沿用第三代全新技术构架', '0风险，专属代理客服24小时为您护航', '高收益，成熟营销体系助您快速盈利', '超省心，完善的分站搭建技术，一键上线'],
      businessItem: ['http://p70pqu6ys.bkt.clouddn.com/%E5%BF%AB%E6%89%8B.png', 'http://p70pqu6ys.bkt.clouddn.com/%E6%8A%96%E9%9F%B3icon.png', 'http://p70pqu6ys.bkt.clouddn.com/%E5%85%A8%E9%9D%A2k%E6%AD%8Cicon.png', 'http://p70pqu6ys.bkt.clouddn.com/%E7%81%AB%E5%B1%B1%E5%B0%8F%E8%A7%86%E9%A2%91icon.png', 'http://p70pqu6ys.bkt.clouddn.com/%E5%BE%AE%E5%8D%9A.png', 'http://p70pqu6ys.bkt.clouddn.com/%E4%B8%80%E7%9B%B4%E6%92%AD.png', 'http://p70pqu6ys.bkt.clouddn.com/%E5%BF%AB%E6%89%8B%E7%9B%B4%E6%92%AD.png', 'http://p70pqu6ys.bkt.clouddn.com/%E5%BE%AE%E8%A7%86%E5%BC%80%E5%8F%91%E4%B8%AD.png', 'http://p70pqu6ys.bkt.clouddn.com/%E7%BE%8E%E6%8B%8D%E5%BC%80%E5%8F%91%E4%B8%AD.png', 'http://p70pqu6ys.bkt.clouddn.com/%E8%A5%BF%E7%93%9C%E8%A7%86%E9%A2%91%E5%BC%80%E5%8F%91%E4%B8%AD.png']
    }
  },
  created() {
    this.$root.eventHub.$emit('user')
  },
  methods: {
    _emitAgent() {
      this.$root.eventHub.$emit('agent')
    }
  }
}

</script>
<style type="text/css" scoped>
.btn-warp {
  position: relative;
}

.btn-agent {
  position: absolute;
  right: 50%;
  bottom: 12%;
  width: 11%;
  height: 11%;
  transform: translate(50%, 0);
  color: #fff;
  font-size: 0.9rem;
  background: #FFD335;
  border-radius: 6px;
  font-size: 17px;
  color: #000;
  min-width: 120px;
  min-height: 33px;
}

.agent-body {
  width: 100%;
  min-height: 850px !important;
  height: auto;
  background: #fff;
  opacity: 1;
}

.agent-body-banner {
  width: 100%;
  height: auto;
  min-height: 180px;
}


.agent-body-title {
  width: 100%;
  padding: 5% 0 1%;
  justify-content: center;
}

.info-for-web-warp {
  width: 100%;
  /*padding-bottom: 8%;*/
  position: relative;
  height: 120px;
}

.info-for-web {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  flex-wrap: wrap;
  /*  margin-bottom: 50px;*/
  height: 120px;
/*  margin-bottom: 3%;*/
}

.abp-item-img {
  width: auto;
  height: 100%;
  max-width: 100%;
}

.abp-item-img {
  height: 100%;
  width: auto;
  max-width: 100%;
}

.abp-item-img1 {
  height: 95%;
  width: auto;
  max-width: 100%;
  transform-origin: 50% 50%;
  animation: abpOut .5s ease 1 forwards;
  border-radius: 28%;
}

.abp-item-img1:hover {
  animation: abpIn .5s ease 1 forwards;
}

@keyframes abpIn {
  0% {
    transform: scale(1, 1);
    box-shadow: 0 5px 0px rgba(0, 0, 0, 0);
  }
  100% {
    transform: scale(1.1, 1.1);
    box-shadow: 0 5px 15px rgba(0, 0, 0, .5);
  }
}

@keyframes abpOut {
  0% {
    transform: scale(1.1, 1.1);
    box-shadow: 0 5px 15px rgba(0, 0, 0, .5);
  }
  100% {
    transform: scale(1, 1);
    box-shadow: 0 5px 0px rgba(0, 0, 0, 0);
  }
}

.agent-body-privilege {
  max-width: 1100px;
  height: auto;
  margin: 1% auto;
  justify-content: flex-start;
  flex-wrap: wrap;
  padding-bottom: 3%;
}

.agent-body-privilege-one {
  max-width: 1200px;
  height: auto;
  margin: 4% auto;
  justify-content: flex-start;
}

.min-width {
  max-width: 900px;
}

.agent-body-privilege-warp {
  width: 100%;
  height: auto;
  background-size: 100% 100%;
  margin-top: 5%;
}

.abp-item-img-warp {
  position: relative;
  width: auto;
  height: 100%;
  overflow: hidden;
  max-width: 100%;
  /*  max-height: 100%;*/
}

.info-for-web-item {
  height: 20%;
  width: 100%;
  color: #BBB9D1;
  font-size: 13px;
  min-height: 18px;
  max-height: 24px;
}

.abp-item {
  width: 21%;
  margin: 0 2%;
  padding-top: 16%;
  position: relative;
  background: #fff;
  box-shadow: 0 0 15px rgba(0, 0, 0, .2);
  border-radius: 10%;
}

.ai-icon {
  position: absolute;
  left: 50%;
  top: 30%;
  transform: translate(-50%, -50%);
  width: 35%;
  height: auto;
}

.ai-content-info {
  width: 100%;
  height: 20%;
  font-size: 13px;
  color: #BBB9D1;
}

.ai-content-title {
  height: 30%;
  width: 100%;
  font-size: 15px;
  color: #353535;
}

.ai-content {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 60%;
  flex-wrap: wrap;
  align-content: center;
}

.abp-item:hover .abp-item-border-top {
  animation: gradientIn .5s ease 1 forwards;
}

@keyframes gradientIn {
  0% {
    /*width: 15%;*/
    transform: translate3d(-50%, 50%, 0) scale(1, 1);
  }
  100% {
    /*width: 30%;*/
    transform: translate3d(-50%, 50%, 0) scale(2.2, 1);
  }
}

@keyframes gradientOut {
  0% {
    /*width: 30%;*/
    transform: translate3d(-50%, 50%, 0) scale(2.2, 1);
  }
  100% {
    /*width: 15%;*/
    transform: translate3d(-50%, 50%, 0) scale(1, 1);
  }
}

.abp-item-border-top {
  position: absolute;
  top: 0%;
  left: 50%;
  height: 2px;
  width: 15%;
  border-right: 10px;
  background: #988DFF;
  animation: gradientOut .5s ease 1 forwards;
}

.title-img {
  height: 30%;
  width: auto;
  margin: 0 auto;
}

.agent-more {
  width: 40%;
  height: 20%;
  background: #fff;
}
.customized{
  width: 20%;
  padding-top: 1.5%;
/*  background: #000;*/
  border-radius: 1000px;
  border: 1px dashed #ddd;
  margin: 0 auto;
  transform: translate(0 , -50%);
  position: relative;
  min-width: 280px;
  min-height: 30px;
  max-height: 60px;
  max-width: 380px;
}
.customized-warp{
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
}
.Pink{
  color: #FF9000;
}
.font-w{
  font-weight: 600;
}

</style>
