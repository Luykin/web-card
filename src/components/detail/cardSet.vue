<template>
  <transition name="layer">
    <div class="index">
      <div class="card-set-header flex">
        <img :src="setImage($route.params.Introduction_picture)"/>
        <div class="csh-btn-warp flex fw" v-if="!$route.params.free">
          <div class="csh-price">现价：{{$route.params.current_price}}元<span v-if="$route.params.current_price>$route.params.original_price">原价{{$route.params.original_price}}元</span></div>
          <div class="flex csh-btn cur">立即购买</div>
          <router-link tag='div' to='/vip' class="csh-btn flex cur">更多优惠</router-link>
        </div>
      </div>
      <div class="index-main">
        <crumbs :crumbs="crumbs_list"></crumbs>
        <div class="main-title flex">
          {{$route.params.Internal_headings}}
        </div>
        <div class="card-set-warp flex fw js">
          <div class="card-set-item" v-for="item in list" :style="`background:url(${item.image}) no-repeat; background-size:100% 100%;`">
            <div class="card-num flex">
              <i class="iconfont icon-shijuan"></i>
              {{item.card_num}}张
            </div>
            <span class="flex csw-title">{{item.name}}</span>
            <span class="flex csw-describe">{{item.describe}}</span>
            <div class="csw-btn cur" @click="_toCard(item.id)">开始训练</div>
          </div>
        </div>
        <!--<div class="main-title flex">-->
          <!--{{$route.params.video_title}}-->
        <!--</div>-->
        <!--<div class="audio-warp" v-if="this.$route.params.video_introduction">-->
          <!--&lt;!&ndash;controls&ndash;&gt;-->
          <!--<video controls :src="this.$route.params.video_introduction">-->
          <!--</video >-->
        <!--</div>-->
      </div>
    </div>
  </transition>
</template>

<script>
    import crumbs from 'base/crumbs/crumbs'
    import { cardSet_list } from 'api/index'
    export default {
        name: "card-set",
        data() {
          return{
            crumbs_list: [{
              name: '训练首页',
              path: '/trainingSet'
            },{
              name: '卡片集',
              path: null
            }],
            list: []
          }
        },
        created() {
          // console.log(this.$route.params)
          if (!this.$route.params.id) {
            this.$router.replace({
              name: `train-index`
            });
            return false
          }
          this._getCardSetList(this.$route.params.id);
          document.documentElement.scrollTop = 0;
        },
        computed: {
          setImage() {
            return (pic) => {
              return pic || 'http://cdn.01icon.xingkwh.com/carset.e0a01ae.jpg'
            }
          }
        },
        methods: {
          async _getCardSetList(id) {
            this.$root.eventHub.$emit('loading', true);
            const ret = await cardSet_list(id);
            this.$root.eventHub.$emit('loading', null);
            if (ret.status === 200 && ret.data.state === 200) {
              // console.log(ret)
              this.list = ret.data.rows
            }
          },
          _toCard(id) {
            this.$router.push({
              name: `card`,
              params: {
                id,
                cardSetParams: this.$route.params
              }
            })
          },
        },
        components: {
          crumbs
        }
    }
</script>

<style scoped>
  .card-set-header{
    height: 430px;
    min-width: 1920px;
    position: relative;
  }
  .csh-btn-warp{
    width: 400px;
    position: absolute;
    left: 50%;
    bottom: 10%;
    height: 120px;
    transform: translate(-50%, 0);
  }
  .csh-price{
    width: 100%;
    font-size: 26px;
    font-weight: 600;
    color: #EB7B2D;
    margin-bottom: 35px;
    vertical-align: bottom;
    text-align: center;
  }
  .csh-price span{
    text-decoration: line-through;
    font-size: 18px;
    font-weight: 400;
    margin-left: 10px;
  }
  .csh-btn{
    width: 140px;
    height: 45px;
    border-radius: 1000px;
    background: #EB7B2D;
    color: #fff;
    font-size: 15px;
    font-weight: 600;
    box-sizing: border-box;
    transition: all .3s;
    margin: 0 auto;
  }
  .card-set-header img{
    width: 100%;
    height: 100%;
    pointer-events: none;
  }
  .card-set-warp{
    margin-top: 20px;
    min-height: 500px;
  }
  .card-set-item{
    width: 20%;
    padding: 0 2%;
    height: 270px;
    color: #777;
    box-shadow: 0 0 15px rgba(0,0,0,.2);
    border-radius: 4px;
    margin: 20px 4.665%;
    background: rgba(235, 123, 45, 0.41);
    background: linear-gradient(to right, rgba(235, 123, 45, 0.41), rgba(240, 163, 47, 0.4));
    transition: all .3s;
    position: relative;
    overflow: hidden;
  }
  .card-num{
    position: absolute;
    top: 0;
    left: 0;
    width: 70px;
    height: 40px;
    color: #fff;
    font-size: 14px;
  }
  .icon-shijuan{
    font-size: 20px;
  }
  .card-set-item:hover{
    transform: translate(0, -10px);
    box-shadow: 0 0 30px rgba(0,0,0,.25);
  }
  .csw-title{
    height: 60px;
    margin-top: 30px;
    color: #fff;
    font-weight: 600;
    font-size: 16px;
  }
  .csw-describe{
    color: #f6f6f6;
    font-size: 13px;
    margin-top: 20px;
    word-break: break-all;
  }
  .csw-btn{
    background: #eb7b2d;
    width: 45%;
    height: 38px;
    line-height: 38px;
    text-align: center;
    border-radius: 1000px;
    color: #fff;
    position: absolute;
    bottom: 10%;
    left: 50%;
    transform: translate(-50%, 0);
    transition: all .3s;
  }
  .csw-btn:hover, .csh-btn:hover{
    color: #fff;
    background: #eb531c;
    border: 1px solid #eb7b2d;
  }
</style>
