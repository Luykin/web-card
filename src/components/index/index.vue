<template>
  <transition name="layer">
    <div class="index">
      <swiper :options="swiperOption" ref="mySwiper" class="swiper-box">
        <swiper-slide class="swiper-item" v-for="item in banner" :key="item">
          <img :src="item.image">
        </swiper-slide>
        <!--<div class="swiper-pagination" slot="pagination"></div>-->
      </swiper>
      <div class="index-main">
        <div class="main-title flex">
          我们的优势
        </div>
        <div class="flex index-info">
          <img src="../../assets/ex.png"/>
          <div class="flex fw index-info-text-warp">
            <span class="flex index-info-text-title">标题标题</span>
            <span class="flex index-info-text-detail">描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述</span>
          </div>
        </div>
        <div class="main-title flex">
          视频介绍
        </div>
        <div class="audio-warp">
          <!--controls-->
          <video src="http://cdn.jiangzhifan.com/video_20190114_003323.mp4">
          </video >
        </div>
        <div class="main-title flex">
          学员口碑
        </div>

      </div>
      <router-view></router-view>
    </div>
  </transition>
</template>

<script>
  let vm = null;
    export default {
      name: "index",
      data() {
        return{
          swiperOption: {
            direction: 'horizontal',
            slidesPerView: 1,
            spaceBetween: 30,
            // pagination: {
            //   el: '.swiper-pagination',
            //   clickable: false
            // },
            autoplay: {
              delay: 8000,
            },
            loop: true,
            on: {
              click: function(){
                vm._toBanner(vm.banner[this.realIndex]);
              }
            }
          },
          banner: [{
            image: require('../../assets/banner.jpg'),
            path: 'index-banner',
            info: 'info'
          },{
            image: require('../../assets/banner.jpg'),
            path: 'index-banner',
            info: 'info'
          },{
            image: require('../../assets/banner.jpg'),
            path: 'index-banner',
            info: 'info'
          }]
        }
      },
      computed: {
        swiper() {
          return this.$refs.mySwiper.swiper
        }
      },
      created() {
        vm = this;
      },
      methods: {
        _toBanner(item){
          this.$router.push({
            name: item.path,
            params: item.info
          })
        }
      },
    }
</script>

<style scoped>
  .swiper-box {
    width: 100%;
    height: 430px;
    margin: 0 auto;
  }
  .swiper-item {
    width: 100%;
    height: 100%;
  }
  .swiper-item img{
    display: block;
    width: auto;
    height: 100%;
    margin: 0 auto;
  }
  .index-info{
    width: 100%;
    height: 370px;
    overflow: hidden;
  }
  .index-info img{
    width: 569px;
    height: auto;
  }
  .index-info-text-warp{
    width: 500px;
    height: 100%;
    margin: 0 50px;
    align-content: flex-start;
    align-items: flex-start;
  }
  .index-info-text-title{
    height: 100px;
    font-size: 18px;
    font-weight: 600;
    color: #367abd;
    justify-content: flex-start;
  }
  .index-info-text-detail{
    font-size: 14px;
    color: #666;
    height: auto;
    word-break: break-all;
  }
</style>
