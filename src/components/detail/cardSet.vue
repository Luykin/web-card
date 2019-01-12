<template>
  <transition name="layer">
    <div class="index">
      <div class="card-set-header flex">
        <img src="../../assets/carset.jpg"/>
      </div>
      <div class="index-main">
        <crumbs :crumbs="crumbs_list"></crumbs>
        <div class="main-title flex">
          卡片集
        </div>
        <div class="card-set-warp flex fw js">
          <div class="card-set-item cur" v-for="item in list" @click="_toCard(item.id)">
            {{item.name}}
          </div>
        </div>
        <div class="main-title flex">
          视频介绍
        </div>
        <div class="audio-warp">
          <!--controls-->
          <video src="../../assets/index.mp4">
          </video >
        </div>
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
          this._getCardSetList(this.$route.params.id)
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
    width: 24%;
    height: 270px;
    color: #777;
    box-shadow: 0 0 15px rgba(0,0,0,.2);
    border-radius: 4px;
    margin: 20px 4.665%;
    background: rgba(235, 123, 45, 0.41);
    background: linear-gradient(to right, rgba(235, 123, 45, 0.41), rgba(240, 163, 47, 0.4));
    transition: all .3s;
  }
  .card-set-item:hover{
    transform: translate(0, -10px);
    box-shadow: 0 0 30px rgba(0,0,0,.25);
  }

</style>
