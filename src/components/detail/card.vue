<template>
  <div class="index">
    <div class="index-main">
      <crumbs :crumbs="crumbs_list"></crumbs>
      <empty v-show="!list.length"></empty>
      <div class="flex card js cur" v-for="(item,index) in list" @click="_toCard(index)">
        <img src="../../assets/card.jpg"/>
        <div class="flex card-right fw">
          <div class="flex tb-item-right-title js">{{item.title}}</div>
          <div class="flex tb-item-right-info js">{{item.min_title}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import crumbs from 'base/crumbs/crumbs'
  import {card_list} from 'api/index'
  import empty from 'base/empty/empty'

  export default {
    name: "card",
    data() {
      return {
        crumbs_list: [{
          name: '训练首页',
          path: '/trainingSet'
        }, {
          name: '卡片集',
          path: '/trainingSet/cardSet'
        }, {
          name: '卡片列表',
          path: null
        }],
        list: []
      }
    },
    created() {
      if (!this.$route.params.id) {
        this.$router.replace({
          name: `train-index`
        });
        return false
      }
      this.crumbs_list[1].path = {
        name: 'cardSet',
        params: this.$route.params.cardSetParams
      };
      console.log(this.$route.params);
      this.getCardList(this.$route.params.id)
    },
    methods: {
      async getCardList(id) {
        this.$root.eventHub.$emit('loading', true);
        const ret = await card_list(id);
        this.$root.eventHub.$emit('loading', null);
        if (ret.status === 200 && ret.data.state === 200) {
          this.list = ret.data.rows
        }
      },
      _toCard(index) {
        this.$root.exercise_group = this.list;
        // JSON.stringify()
        try {
          localStorage.setItem('exercise_group', JSON.stringify(this.list));
        } catch(e) {
          console.log(e)
        }
        this.$router.push({
          name: `card-detail`,
          params: {
            info_index: index,
            params: this.$route.params
          }
        })
      }

    },
    components: {
      crumbs,
      empty
    }
  }
</script>

<style scoped>
  .card {
    width: 70%;
    padding: 20px 5%;
    height: 170px;
    box-shadow: 0 0 10px rgba(0, 0, 0, .1);
    margin: 15px 0 0 5%;
    border-radius: 6px;
  }

  .card img {
    width: 200px;
    height: auto;
    max-height: 170px;
  }

  .card-right {
    padding: 0 5%;
    height: 100%;
    align-content: flex-start;
    align-items: flex-start;
  }

  .tb-item-right-title {
    font-weight: 600;
    font-size: 20px;
    height: 60px;
    color: rgb(235, 123, 45);
    transition: all .3s;
  }

  .tb-item-right-title:hover {
    color: #F0A32F;
  }

  .tb-item-right-info {
    word-break: break-all;
    font-size: 15px;
    min-height: 100px;
    max-height: 130px;
  }

  .tb-item-right-num span {
    width: 0;
    flex-grow: 1;
    color: #999;
    text-indent: 40px;
  }
</style>
