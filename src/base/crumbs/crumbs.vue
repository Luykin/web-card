<template>
  <div class="crumbs flex js">
    <router-link tag='span' :to='item.path' :params="item.params" :key="item.name" class="crumbs-active cur" v-for="item in crumbs" v-if="item.path">
      {{item.name}} >
    </router-link>
    <span>{{crumbs[crumbs.length - 1].name}}</span>
  </div>
</template>

<script>
    export default {
      props: {
        crumbs: {
          type: [Array],
          default: [{
            name: '首页',
            path: '/index'
          },{
            name: '现在',
            path: null
          }]
        }
      },
      data() {
        return{

        }
      }
    }
</script>

<style scoped>
  .crumbs{
    width: 90%;
    padding: 0 5%;
    height: 50px;
    color: #999;
    font-size: 14px;
  }
  .crumbs-active{
    color: #367abd;
  }
</style>
