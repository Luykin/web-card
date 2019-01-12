<template>
    <div class="index">
      <div class="index-main">
        <crumbs :crumbs="crumbs_list"></crumbs>
        <!--<div class="main-title flex">-->
          <!--卡片列表-->
        <!--</div>-->
        <div class="flex card js cur" v-for="item in 10" @click="_toCard(item)">
          <img src="../../assets/card.jpg"/>
          <div class="flex card-right fw">
            <div class="flex tb-item-right-title js">英语大标题</div>
            <div class="flex tb-item-right-info js">学习过程智能可视化 知晓每一步的提升点精英名师伴护式教学 亦师亦学习过程智能可视化 知晓每一步的提升点精英名师伴护式教学 亦师亦学习过程智能可视化 知晓每一步的提升点精英名师伴护式教学 亦师亦友只为你提分</div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
    import crumbs from 'base/crumbs/crumbs'
    export default {
      name: "card",
      data() {
        return{
          crumbs_list: [{
            name: '训练首页',
            path: '/trainingSet'
          }, {
            name: '卡片集',
            path: '/trainingSet/cardSet'
          },{
            name: '卡片列表',
            path: null
          }]
        }
      },
      methods: {
        _toCard() {
          this.$router.push({
            name: `card-detail`,
            params: ''
          })
        }

      },
      components: {
        crumbs
      }
    }
</script>

<style scoped>
.card{
  width: 70%;
  padding: 20px 5%;
  height: 170px;
  box-shadow: 0 0 10px rgba(0,0,0,.1);
  margin: 15px 0 0 5%;
  border-radius: 6px;
}
  .card img{
    width: 200px;
    height: auto;
    max-height: 170px;
  }
  .card-right{
    padding: 0 5%;
    height: 100%;
    align-content: flex-start;
    align-items: flex-start;
  }
.tb-item-right-title{
  font-weight: 600;
  font-size: 20px;
  height: 60px;
  color: rgb(235, 123, 45);
  transition: all .3s;
}
.tb-item-right-title:hover{
  color: #F0A32F;
}
.tb-item-right-info{
  word-break: break-all;
  font-size: 15px;
  min-height: 100px;
  max-height: 130px;
}
.tb-item-right-num span{
  width: 0;
  flex-grow: 1;
  color: #999;
  text-indent: 40px;
}
</style>
