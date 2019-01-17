<template>
  <div class="header flex">
    <img src="../../assets/logo.png"/>
    <router-link tag='div' :to='item.path' class="header-item flex cur" v-for="item in header_config" :key='path'>
      <span v-if="item">{{item.name}}</span>
    </router-link>
  </div>
</template>

<script>
  const HEAD = [{
      name: '首页',
      path: '/index'
    }, {
      name: '训练',
      path: '/trainingSet'
    }, {
      name: '服务于价格',
      path: '/vip'
    }];
  // , {
  //   // name: '方法课',
  //   // path: '/course'
  // }
  export default {
    name: "header",
    data() {
      return {
      }
    },
    created() {
    },
    computed: {
      header_config() {
        return this.$root.user ? [...HEAD, {
          name: this.$root.user.name,
          path: '/user'
        }]: [...HEAD, {
          name: '登录 | 注册',
          path: '/login'
        }];
      },
    },
  }
</script>

<style scoped>
  .header {
    width: 100%;
    height: 80px;
    font-size: 16px;
    background: #fff;
    color: #494949;
    box-shadow: 0 0 10px rgb(0, 0, 0, .1);
    overflow: hidden;
  }

  .header img {
    width: 110px;
    height: auto;
    max-height: 70px;
    margin-right: 100px;
  }

  .header-item {
    height: 100%;
    width: 180px;
    font-weight: 400;
  }

  .header-item span {
    box-sizing: border-box;
    height: 40px;
    line-height: 40px;
    position: relative;
  }

  .header-item span::after {
    content: '';
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    height: 2px;
    border-radius: 100px;
    background: #367ABD;
    transform: scale(0, 1);
    transition: all .3s;
    transform-origin: center center;
  }

  .header-item:hover {
    color: #367ABD;
  }

  .router-link-active {
    color: #367ABD;
  }

  .router-link-active span::after {
    transform: scale(1, 1);
  }
</style>
