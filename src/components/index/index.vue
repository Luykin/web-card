<template>
  <transition name="layer">
    <div class="index">
      <swiper :options="swiperOption" ref="mySwiper" class="swiper-box">
        <swiper-slide class="swiper-item" v-for="item in banner" :key="item" v-if="item.image">
          <img :src="item.image">
        </swiper-slide>
        <!--<div class="swiper-pagination" slot="pagination"></div>-->
      </swiper>
      <div class="index-main">
        <div class="main-title flex">
          我们的优势
        </div>
        <div class="flex index-info" v-if="$root.app_info">
          <img :src="$root.app_info.index_card_image"/>
          <div class="flex fw index-info-text-warp">
            <span class="flex index-info-text-title">{{$root.app_info.index_card_title}}</span>
            <span class="flex index-info-text-detail">{{$root.app_info.index_card_text}}</span>
          </div>
        </div>
        <div class="main-title flex">
          视频介绍
        </div>
        <div class="audio-warp" v-if="$root.app_info">
          <!--controls-->
          <video controls :src="$root.app_info.index_audio">
          </video >
        </div>
        <div class="main-title flex">
          学员口碑
        </div>
        <div v-if="$root.app_info" class="flex">
          <img :src="$root.app_info.index_praise"/>
        </div>
      </div>
      <router-view></router-view>
    </div>
  </transition>
</template>

<script>
  import {app_info} from 'api/index'
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
            image: '',
            path: 'index-banner',
            info: 'info'
          },{
            image: '',
            path: 'index-banner',
            info: 'info'
          },{
            image: '',
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
      mounted() {
        vm = this;
        if (!this.$root || !this.$root.app_info) {
          this._getAppinfo()
        } else {
          this._setApp()
        }
      },
      methods: {
        // app_info
        async _getAppinfo() {
          this.$root.eventHub.$emit('loading', true);
          const ret = await app_info();
          this.$root.eventHub.$emit('loading', null);
          if (ret.status === 200 && ret.data.state === 200) {
            this.$root.app_info = ret.data;
            this._setApp()
          }
        },
        _setApp() {
          this.banner[0].image = this.$root.app_info.index_banner1;
          this.banner[1].image = this.$root.app_info.index_banner2;
          this.banner[2].image = this.$root.app_info.index_banner3;
          this.banner[0].info = this.$root.app_info.index_path1;
          this.banner[1].info = this.$root.app_info.index_path2;
          this.banner[2].info = this.$root.app_info.index_path3;
        },
        _toBanner(item){
          if (item.info.indexOf('http') > -1) {
            console.log(item.info)
            this.$router.push({
              name: item.path,
              params: {
                path: item.info
              }
            })
          } else {
            this.$router.push({
              path: `/${item.info}`,
            })
          }
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
