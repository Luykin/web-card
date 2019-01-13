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
    created() {
      this.crumbs_list[1].path = {
        name: 'cardSet',
        params: this.$route.params.cardSetParams
      };
      this.crumbs_list[2].path = {
        name: 'card',
        params: this.$route.params
      };
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
