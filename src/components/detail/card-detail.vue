<template>
    <div class="index">
      <div class="index-main">
        <crumbs :crumbs="crumbs_list"></crumbs>
        <div class="card-detail-warp flex"></div>
      </div>
    </div>
</template>

<script>
  import crumbs from 'base/crumbs/crumbs'
  export default {
    name: "card-dettail",
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
          path: '/trainingSet/card'
        },{
          name: '卡片',
          path: null
        }]
      }
    },
    components: {
      crumbs
    }
  }
</script>

<style scoped>
  .card-detail-warp{
    width: 70%;
    padding: 5%;
    height: auto;
    min-height: 100px;
    box-shadow: 0 0 10px rgba(0,0,0,.1);
    border-radius: 10px;
    margin: 20px auto;
  }
</style>
