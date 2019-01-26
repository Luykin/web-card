<template>
  <transition name="layer">
    <div class="index-main flex fw">
      <userrouter></userrouter>
      <div class="collection">
        <div class="sub-header-warp flex">
          <div v-for="item in sub_list" class="flex sub-item js cur ell" v-if="item.show === 0" :class="{'active-sub': choseId === item.id}" @click="_choseItem(item)">{{item.name}}</div>
        </div>
        <empty v-show="!collectionlist.length"></empty>
        <div class="flex card js cur" v-for="(item,index) in collectionlist" @click="_toCard(index)" ref="cards">
          <img src="../../assets/card.jpg"/>
          <div class="flex card-right fw">
            <div class="flex tb-item-right-title js">{{item.card_info.title}}</div>
            <div class="flex tb-item-right-info js">{{item.card_info.min_title}}</div>
            <div class="flex tb-item-right-info js">难度：{{item.difficulty === 0 ? '简单': item.difficulty === 1 ? '普通': '困难'}}</div>
          </div>
        </div>
        <el-pagination
          layout="prev, pager, next"
          :total="total" page-size="4" :current-page="page + 1" @current-change="currentChange" class="flex">
        </el-pagination>
      </div>
      <div class="fix-btn flex ell cur" @click="_start">开始复习</div>
    </div>
  </transition>
</template>

<script>
  import userrouter from './user-router'
  import empty from 'base/empty/empty'
  export default {
    name: "user-collection",
    props: {
      collectionlist: [],
      sub_list: [],
      total: 0,
      page: 0
    },
    data() {
      return{
        choseId: 'all',
      }
    },
    created() {
      // this._getSubject()
    },
    methods: {
      _start() {
        // console.log(this.$refs.cards);
        if (this.$refs.cards.length) {
          this.$refs.cards[0].click()
        } else {
          this.$message({
            message: '没有可以训练的卡片哟',
            type: 'warning'
          });
        }
      },
      _choseItem(item, must) {
        this.$emit('chose', {
          item,
          callback: () => {
            this.choseId = item.id;
          },
          must
        });
      },
      currentChange(value) {
        // this.page
        this.$emit('pageChange', {
          value,
          choseId: this.choseId
        })
      },
      _toCard(index) {
        this.$root.exercise_group = this.collectionlist;
        // JSON.stringify()
        try {
          localStorage.setItem('exercise_group', JSON.stringify(this.$root.exercise_group));
        } catch(e) {
          console.log(e)
        }
        this.$router.push({
          name: `/user/card`,
          params: {
            info_index: index,
          }
        })
      }
    },
    components: {
      empty,
      userrouter
    }
  }
</script>

<style scoped>
  .index-main{
    align-items: flex-start;
    align-content: flex-start;
  }
  .sub-header-warp{
    height: 50px;
    width: 70%;
    margin-top: 10px;
    padding: 0 5%;
  }
  .sub-item{
    height: 100%;
  }
  .active-sub{
    color: #EB7B2D;
  }
  .el-pagination{
    margin-top: 25px;
  }
  .fix-btn{
    position: fixed;
    right: 20%;
    bottom: 10%;
    width: 120px;
    height: 45px;
    border-radius: 1000px;
    background: #EB7B2D;
    color: #fff;
    font-size: 17px;
    font-weight: 600;
  }
</style>
