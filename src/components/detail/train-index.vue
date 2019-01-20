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
        <div class="chose-training-warp flex js">
          <div class="ctw-item flex cur" @click="_chose(item)" v-for="item in training_list" :class="{'ctw-active': item.id === activeId}">
            {{item.name}}
          </div>
        </div>
        <div class="training-body flex fw">
          <empty v-show="!list.length"></empty>
          <div class="tb-item flex" v-for="item in list">
            <div class="tb-item-left flex js">
              <img :src="item.image"/>
            </div>
            <div class="tb-item-right flex fw">
              <div class="flex tb-item-right-title js cur"  @click="_toCarSet(item)">{{item.name}}</div>
              <div class="flex tb-item-right-info js">{{item.describe}}</div>
              <div class="flex tb-item-right-num js">
                <div class="flex tb-item-right-btn cur" @click="_toCarSet(item)">查看全部</div>
                <span class="flex js">已有{{item.people_number}}人进行训练</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <router-view></router-view>
    </div>
  </transition>
</template>

<script>
  import {subject_list, train_list} from 'api/index'
  import {app_info} from 'api/index'
  import empty from 'base/empty/empty'
  let vm = null;
  export default {
    data() {
      return{
        training_list: [
          {
            name:'英语',
            id: 0
          },{
            name:'语文',
            id: 1
          },{
            name:'数学',
            id: 2
          },{
            name:'物理',
            id: 3
          },
        ],
        list: [],
        // cardSet: null,
        activeId: 0,
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
          path: 'tr-banner',
          info: 'info'
        },{
          image: '',
          path: 'tr-banner',
          info: 'info'
        },{
          image: '',
          path: 'tr-banner',
          info: 'info'
        }],
        trainListCache: []
      }
    },
    computed: {
      swiper() {
        return this.$refs.mySwiper.swiper
      }
    },
    mounted() {
      vm = this;
      this._init()
    },
    methods: {
      _init(){
        this._getSubject();
        if (!this.$root || !this.$root.app_info) {
          this._getAppinfo()
        } else {
          this._setApp()
        }
      },
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
        this.banner[0].image = this.$root.app_info.train_banner1;
        this.banner[1].image = this.$root.app_info.train_banner2;
        this.banner[2].image = this.$root.app_info.train_banner3;
        this.banner[0].info = this.$root.app_info.train_path1;
        this.banner[1].info = this.$root.app_info.train_path2;
        this.banner[2].info = this.$root.app_info.train_path3;
      },
      async _getSubject() {
        this.$root.eventHub.$emit('loading', true);
        const ret = await subject_list();
        this.$root.eventHub.$emit('loading', null);
        if (ret.status === 200 && ret.data.state === 200) {
          if (ret.data.count) {
            this.training_list = this._formatShow(ret.data.rows);
            this.activeId = this.training_list[0].id;
            this._getTrainList(this.activeId);
          }
        }
      },
      _formatShow(list) {
        if (!list || !list.length){
          return[]
        } else {
          let ret = [];
          list.forEach((item) => {
            // console.log(item.show)
            if (item.show === 0) {
              ret.push(item)
            }
          });
          return ret;
        }
      },
      async _getTrainList(id, must, sucess) {
        if (this.trainListCache[id] && !must) {
          this.list = this.trainListCache[id];
          sucess();
          return false
        }
        this.$root.eventHub.$emit('loading', true);
        const ret = await train_list(id);
        this.$root.eventHub.$emit('loading', null);
        if (ret.status === 200 && ret.data.state === 200) {
          this.list = ret.data.rows;
          this.trainListCache[id] = ret.data.rows;
          if (sucess) {
            sucess()
          }
        }
      },
      _chose(item) {
        this._getTrainList(item.id, null,() => {
          this.activeId = item.id
        });
      },
      _toCarSet(item) {
        this.$router.push({
          name: `cardSet`,
          params: item
        })
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
    components: {
      empty
      // swiper,
      // swiperSlide
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
  .chose-training-warp{
    width: 100%;
    height: 70px;
    background: #f8f8f8;
    margin-top: 20px;
    overflow: hidden;
    box-shadow: 0 0 10px rgba(0,0,0,.1);
  }
  .ctw-item{
    box-sizing: border-box;
    flex-grow: 1;
    max-width: 200px;
    height: 100%;
    color: #666666;
    font-size: 16px;
  }
  .ctw-item:hover{
    color: #367abd;
  }
  .ctw-active{
    border-top: 3px solid #367abd;
    border-right: 1px solid #ededed;
    border-left: 1px solid #ededed;
    background: #fff;
    color: #367abd;
    position: relative;
  }
  .ctw-active:after{
    content: '';
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    background: #fff;
    height: 10px;
    z-index: 99;
  }
  .training-body{
    width: 100%;
    height: auto;
    min-height: 200px;
    background: #fff;
    box-shadow: 0 0 10px rgba(0,0,0,.1);
    border-right: 1px solid #ededed;
    border-left: 1px solid #ededed;
    position: relative;
  }
  .training-body:before{
    content: '';
    position: absolute;
    top: 0;
    width: 100%;
    height: 10px;
    background: #f8f8f8;
    transform: translate(0, -100%);
  }

  .tb-item{
    width: 100%;
    height: 320px;
    border-bottom: 1px solid #ededed;
    overflow: hidden;
    margin-bottom: 10px;
  }
  .tb-item-left {
    width: 45%;
    height: 100%;
  }
  .tb-item-left img{
    width: 100%;
    height: 100%;
    user-select: none;
    pointer-events: none;
  }
  .tb-item-right {
    width: 45%;
    padding: 0 5%;
    height: 100%;
    background: rgba(235, 225, 225, 0.06);
    /*color: rgb(235, 123, 45);*/
    color: #777;
    align-items: flex-start;
    align-content: flex-start;
  }
  .tb-item-right-title{
    font-weight: 600;
    font-size: 20px;
    height: 100px;
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
  .tb-item-right-num{
    height: auto;
    margin-top: 25px;
  }
  .tb-item-right-btn{
    background: rgb(235, 123, 45);
    color: #fff;
    width: 130px;
    height: 42px;
    border-radius: 1000px;
    transition: all .3s;
  }
  .tb-item-right-btn:hover{
    background: #F0A32F;
  }
  .tb-item-right-num span{
    width: 0;
    flex-grow: 1;
    color: #999;
    text-indent: 40px;
  }
</style>
