<template>
  <transition name="layer">
    <div class="index">
      <div class="flex course-header">
        <div v-for="item in course_type_list" v-if="item.show === 0" class="course-header-item flex cur" :class="{'active-chi': activeId=== item.id}" @click="_chose(item)">{{item.name}}</div>
      </div>
      <div class="course-warp flex fw">
        <div v-for="item in list" v-if="item.link" class="course cur" @click="_window(item)">
          <!--:style="`background: url(${item.image}) no-repeat; background-size: cover;`"-->
          <img :src="item.image" v-if="item.image"/>
          <div class="course-name flex">{{item.name}}</div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import {course_type_list, course_list} from '../../api/index'
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
        }],
        course_type_list: [],
        activeId: 0,
        list: [],
        cacheList: {}
      }
    },
    computed: {
      swiper() {
        return this.$refs.mySwiper.swiper
      }
    },
    created() {
      vm = this;
      this._getSubList()
    },
    methods: {
      _toBanner(item){
        this.$router.push({
          path: item.path
        })
      },
      _chose(item) {
        this.activeId = item.id;
        this._courseList()
      },
      async _courseList() {
        if (this.cacheList[this.activeId]) {
          this.list = this.cacheList[this.activeId];
          return false
        }
        this.$root.eventHub.$emit('loading', true);
        const ret = await course_list(this.activeId);
        this.$root.eventHub.$emit('loading', null);
        if (ret.data.state === 200) {
          this.list = ret.data.rows;
          this.cacheList[this.activeId] = ret.data.rows
        }
      },
      async _getSubList() {
        this.$root.eventHub.$emit('loading', true);
        const ret = await course_type_list();
        this.$root.eventHub.$emit('loading', null);
        if (ret.data.state === 200) {
          this.course_type_list = ret.data.rows;
          if (ret.data.rows.length) {
            this.activeId = ret.data.rows[0].id;
            this._courseList()
          }
        }
      },
      _window(item) {
        window.open(item.link)
      }
    }
  }
</script>

<style scoped>
  .index{
    width: 100%;
    max-width: none;
  }
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
  .course-header{
    /*margin-top: 20px;*/
    width: 60%;
    padding: 0 20%;
    height: 100px;
    justify-content: flex-start;
    background: #f8f8f8;
  }
  .course-header-item{
    width: 0;
    flex-grow: 1;
    color: #9c9c9c;
    font-size: 18px;
    max-width: 140px;
    /*border-radius: 100px;*/
    /*border: 1px solid #d2d2d2;*/
    height: 40px;
    margin: 0 10px;
    justify-content: flex-start;
    /*border-bottom: 1px solid #eb7b2d;*/
  }
  .course-header-item:hover{
    /*background: #eb7b2d;*/
    color: #eb7b2d;
  }
  .active-chi{
    color: #eb7b2d;
    /*background: #eb7b2d;*/
  }
  .course-warp{
    width: 60%;
    padding: 40px 20% 20px;
    min-height: 200px;
    border-radius: 10px;
    box-shadow: 0 0 6px rgba(0,0,0,.1);
    justify-content: flex-start;
    position: relative;
  }
  .course-warp:after{
    content: '';
    position: absolute;
    width: 100%;
    bottom: 0;
    left: 0;
    height: 5px;
    background: #fff;
    transform: translate(0, 100%);
  }
  .course{
    width: 242px;
    height: 301px;
    background: #f8f8f8;
    margin: 0 40px 20px 0;
    position: relative;
    box-shadow: 0 0 8px rgba(0,0,0,.1);
    color: #666;
    transition: all .3s;
  }
  .course img{
    width: 100%;
    height: 100%;
  }
  .course:hover{
    box-shadow: 0 0 16px rgba(0,0,0,.1);
    transform: translate(0, -10px);
  }
  .course-name{
    width: 90%;
    position: absolute;
    bottom: 0;
    left: 0;
    padding: 10px 5%;
    justify-content: flex-start;
    min-height: 70px;
    height: auto;
    max-height: 90%;
    background: rgba(255,255,255,.88);
  }
</style>
