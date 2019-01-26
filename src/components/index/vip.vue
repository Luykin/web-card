<template>
  <transition name="layer">
    <div class="index">
      <div class="card-set-header flex" v-if="$root.app_info">
        <img :src="$root.app_info.index_card_text"/>
      </div>
      <div class="index-main">
        <div class="main-title flex" v-if="$root.app_info">
          {{$root.app_info.vip_window_title1||'把训练集打包带回家'}}
        </div>
        <div class="good-list-warp flex">
          <div class="good-item flex cur fw" v-for="item in list">
            <span class="flex gi-title"><i class="iconfont icon-vip1"></i>{{item.name}}</span>
            <div class="duration flex">有效期:<span class="org">{{duration(item.duration)}}</span></div>
            <div class="describe-text" v-html="item.describe"></div>
            <p class="flex">现价: <span class="current-price">{{item.current_price}}元</span></p>
            <span class="flex original-price">原价: {{item.original_price}}元</span>
            <router-link tag='div' to='/vip/buy' class="gi-btn flex" :class="{'disable': item.duration < 0}">
              {{good_btn(item.duration)}}
            </router-link>
          </div>
        </div>
        <div class="main-title flex" v-if="$root.app_info">
          {{$root.app_info.vip_window_title2||'限时精品课程'}}
        </div>
        <div class="flex" v-if="$root.app_info && $root.app_info.vip_course_image">
          <img :src="$root.app_info.vip_course_image"/>
        </div>
        <div class="main-title flex" v-if="$root.app_info">
          {{$root.app_info.vip_window_title3||'联系我们'}}
        </div>
        <div class="flex" v-if="$root.app_info && $root.app_info.content_us">
          <img :src="$root.app_info.content_us"/>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import {good_list} from 'api/index'
  export default {
      name: "vip",
    data() {
        return{
          list: []
        }
    },
    computed: {
      duration() {
        return (item) => {
          return item < 0 ? '永久' : item + '天'
        }
      },
      good_btn() {
        return (item) => {
          return item < 0 ? '无需购买' : '立即购买'
        }
      }
    },
    created() {
      this._init();
      if (!this.$root.app_info) {
        this.$router.replace({
          path: '/index'
        });
        return false
      }
    },
    methods: {
      _init() {
        this._getGoodList()
      },
      async _getGoodList() {
        this.$root.eventHub.$emit('loading', true);
        const ret = await good_list();
        this.$root.eventHub.$emit('loading', null);
        if (ret.status === 200 && ret.data.state === 200) {
          // console.log(ret)
          this.list = ret.data.data
        }
      },
    }
  }
</script>

<style scoped>
  .card-set-header{
    height: 430px;
    min-width: 1920px;
    pointer-events: none;
  }
  .good-list-warp{
    width: 100%;
    height: 430px;
  }
  .good-item{
    padding: 20px 2%;
    width: 16%;
    flex-shrink: 0;
    flex-grow: 0;
    height: 82%;
    box-shadow: 0 0 10px rgba(235, 123, 45, 0.25);
    margin: 0 2%;
    transition: all .3s;
    border-radius: 4px;
    color: #999;
    align-items: flex-start;
    align-content: flex-start;
    position: relative;
    overflow: hidden;
  }
  .good-item:hover{
    box-shadow: 0 0 15px rgba(235, 123, 45, 0.6);
    transform: translate(0, -16px);
    border-radius: 10px;
  }
  .gi-title{
    font-weight: 600;
    font-size: 17px;
    height: 40px;
    color: rgb(235, 123, 45);
    margin-top: 4%;
  }
  .org{
    color: rgb(235, 123, 45);
  }
  .describe{
    padding: 15px 0;
    color: #777;
    min-height: 50px;
    height: auto;
  }
  .describe-text{
    padding: 15px 0;
    min-height: 50px;
    height: auto;
  }
  .original-price{
    text-decoration: line-through;
  }
  .current-price{
    font-size: 20px;
    font-weight: 600;
    color: rgb(235, 123, 45);
    text-indent: 5px;
  }
  .gi-btn{
    width: 45%;
    height: 38px;
    border-radius: 1000px;
    color: rgb(235, 123, 45);
    border: 1px solid rgb(235, 123, 45);
    /*margin-top: 20px;*/
    font-size: 15px;
    position: absolute;
    bottom: 10%;
    left: 50%;
    transform: translate(-50%, 0);
    transition: all .35s;
  }
  .gi-btn:hover{
    background:rgb(235, 123, 45);
    color: #fff;
    border: none;
  }
  .disable{
    background: #ededed;
    color: #999;
    border: 1px solid #ddd;
    pointer-events: none;
    user-select: none;
  }
  .disable:hover{
    background: #ededed;
    color: #999;
    border: 1px solid #ddd;
  }
</style>
