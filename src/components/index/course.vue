<template>
  <transition name="layer">
    <div class="index">
      <swiper :options="swiperOption" ref="mySwiper" class="swiper-box">
        <swiper-slide class="swiper-item" v-for="item in banner" :key="item">
          <img :src="item.image">
        </swiper-slide>
        <!--<div class="swiper-pagination" slot="pagination"></div>-->
      </swiper>
      <router-view></router-view>
    </div>
  </transition>
</template>

<script>
  let vm = null;
  export default {
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
          path: '/banner',
          info: 'info'
        },{
          image: require('../../assets/banner.jpg'),
          path: '/banner',
          info: 'info'
        },{
          image: require('../../assets/banner.jpg'),
          path: '/banner',
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
          path: item.path
        })
      }
    }
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
</style>
