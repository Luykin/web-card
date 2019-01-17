<template>
  <div class="user-router">
    <router-link tag='div' :to='item.path' class="user-router-item flex cur" v-for="item in router" :key='path'>
      <span v-if="item">{{item.name}}</span>
    </router-link>
  </div>
</template>

<script>
  export default {
    name: "user-router",
    data() {
      return {
        router: [{
          name: '收藏列表',
          path: '/user/collection'
        }, {
          name: '我的训练集',
          path: '/user/myTraining'
        }]
      }
    }
  }
</script>

<style scoped>
  .user-router {
    width: 20%;
    height: auto;
    min-height: 400px;
  }

  .user-router-item {
    width: 60%;
    padding-right: 40%;
    height: 100px;
    color: #999;
    justify-content: flex-end;
  }

  .router-link-active {
    color: #367ABD;
  }
</style>
