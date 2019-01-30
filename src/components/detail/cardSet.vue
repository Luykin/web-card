<template>
  <transition name="layer">
    <div class="index">
      <div class="card-set-header flex">
        <img :src="setImage($route.params.Introduction_picture)"/>
        <div class="csh-btn-warp flex fw" v-if="$route.params.free">
          <div class="csh-price">现价：{{$route.params.current_price}}元<span>原价{{$route.params.original_price}}元</span>
          </div>
          <div class="flex csh-btn cur" @click="add_order">立即购买</div>
          <router-link tag='div' to='/vip' class="csh-btn flex cur">更多优惠</router-link>
        </div>
      </div>
      <div class="index-main">
        <crumbs :crumbs="crumbs_list"></crumbs>
        <div class="main-title flex">
          {{$route.params.Internal_headings}}
        </div>
        <div class="card-set-warp flex fw js">
          <div class="card-set-item" v-for="item in list"
               :style="`background:url(${item.image}) no-repeat; background-size:100% 100%;`">
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
        <el-dialog title="微信支付" :visible.sync="dialogTableVisible" :show-close="false">
          <div v-if="payInfo">
            <div class="flex">商品名称:<span class="ori">{{payInfo.other_info.body}}</span></div>
            <div class="flex">商品价钱:<span class="ori">{{parseFloat(payInfo.other_info.total_fee/100)}}元</span></div>
            <div class="flex">订单号:{{payInfo.other_info.out_trade_no}}</div>
          </div>
          <img :src="payImg" class="pay-img">
          <div class="flex">请用微信扫码支付</div>
          <span slot="footer" class="dialog-footer">
                <el-button @click="_close">取 消</el-button>
                <el-button type="success" @click="_surePay">确定已完成支付</el-button>
            </span>
        </el-dialog>
      </div>
    </div>
  </transition>
</template>

<script>
  import crumbs from 'base/crumbs/crumbs'
  import {cardSet_list, buy_tran, order_query } from 'api/index'
  import QRCode from 'qrcode'
  export default {
    name: "card-set",
    data() {
      return {
        crumbs_list: [{
          name: '训练首页',
          path: '/trainingSet'
        }, {
          name: '卡片集',
          path: null
        }],
        list: [],
        dialogTableVisible: null,
        payImg: null,
        payInfo: null,
        timeCunt: 0,
        timer: null
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
      async add_order() {
        if (!('id' in this.$route.params)) {
          return false
        }
        this.$root.eventHub.$emit('loading', true);
        const ret = await buy_tran(this.$root.user.id, this.$route.params.id);
        this.$root.eventHub.$emit('loading', null);
        if (ret.status === 200 && ret.data.state === 200) {
          if (ret.data.code_url && ret.data.prepay_id) {
            this.payInfo = ret.data;
            this.changeUrlToQrcode(this.payInfo.code_url)
          }
        }
      },
      changeUrlToQrcode(pay_url) {
        const opts = {
          type: 'image/jpeg'
        };
        QRCode.toDataURL(pay_url, opts, (err, url) => {
          if (err) {
            console.log(err, '二维码错误')
          } else {
            this.payImg = url;
            this.dialogTableVisible = true;
            this.timer = setInterval(() => {
              this.timeCunt++;
              this._paySuc();
              if (this.timeCunt >= 50) {
                this._close()
              }
            }, 3000)
          }
        })
      },
      async _paySuc() {
        const ret = await order_query(this.payInfo.other_info.out_trade_no);
        if (ret.status === 200 && ret.data.state === 200) {
          this._close();
          this.$message({
            message: '购买成功',
            type: 'success',
            duration: 1000
          });
          // let timer = setTimeout(() => {
          //   this.$root.eventHub.$emit('updateUser');
          //   clearTimeout(timer)
          // }, 500);
        }
      },
      _surePay() {
        this._close();
        this.$root.eventHub.$emit('updateUser');
      },
      _close() {
        this.dialogTableVisible = false;
        this.payImg = null;
        this.timeCunt = 0;
        clearInterval(this.timer);
      },
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
  .card-set-header {
    height: 430px;
    min-width: 1920px;
    position: relative;
  }

  .csh-btn-warp {
    width: 400px;
    position: absolute;
    left: 50%;
    bottom: 10%;
    height: 120px;
    transform: translate(-50%, 0);
  }

  .csh-price {
    width: 100%;
    font-size: 26px;
    font-weight: 600;
    color: #EB7B2D;
    margin-bottom: 35px;
    vertical-align: bottom;
    text-align: center;
  }

  .csh-price span {
    text-decoration: line-through;
    font-size: 18px;
    font-weight: 400;
    margin-left: 10px;
  }

  .csh-btn {
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

  .card-set-header img {
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

  .card-set-warp {
    margin-top: 20px;
    min-height: 500px;
  }

  .card-set-item {
    width: 20%;
    padding: 0 2%;
    height: 270px;
    color: #777;
    box-shadow: 0 0 15px rgba(0, 0, 0, .2);
    border-radius: 4px;
    margin: 20px 4.665%;
    background: rgba(235, 123, 45, 0.41);
    background: linear-gradient(to right, rgba(235, 123, 45, 0.41), rgba(240, 163, 47, 0.4));
    transition: all .3s;
    position: relative;
    overflow: hidden;
  }

  .card-num {
    position: absolute;
    top: 0;
    left: 0;
    width: 70px;
    height: 40px;
    color: #fff;
    font-size: 14px;
  }

  .icon-shijuan {
    font-size: 20px;
  }

  .card-set-item:hover {
    transform: translate(0, -10px);
    box-shadow: 0 0 30px rgba(0, 0, 0, .25);
  }

  .csw-title {
    height: 60px;
    margin-top: 30px;
    color: #fff;
    font-weight: 600;
    font-size: 16px;
  }

  .csw-describe {
    color: #f6f6f6;
    font-size: 13px;
    margin-top: 20px;
    word-break: break-all;
  }

  .csw-btn {
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

  .csw-btn:hover, .csh-btn:hover {
    color: #fff;
    background: #eb531c;
    border: 1px solid #eb7b2d;
  }

  .pay-img {
    display: block;
    margin: 0 auto 10px;
  }

  .ori {
    color: #EB7B2D;
  }
</style>
