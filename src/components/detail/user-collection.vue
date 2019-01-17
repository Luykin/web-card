<template>
  <transition name="layer">
    <div class="index-main flex fw">
      <userrouter></userrouter>
      <div class="collection" v-if="$root.user">
        <!--<div v-for="item in $root.user.cards">{{item.title}}</div>-->
        <empty v-show="!$root.user.cards.length"></empty>
        <div class="flex card js cur" v-for="(item,index) in $root.user.cards" @click="_toCard(index)">
          <img src="../../assets/card.jpg"/>
          <div class="flex card-right fw">
            <div class="flex tb-item-right-title js">{{item.title}}</div>
            <div class="flex tb-item-right-info js">{{item.min_title}}</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import userrouter from './user-router'
  import empty from 'base/empty/empty'
  export default {
    name: "user-collection",
    methods: {
      _toCard(index) {
        this.$root.exercise_group = this.$root.user.cards;
        // JSON.stringify()
        try {
          localStorage.setItem('exercise_group', JSON.stringify(this.$root.exercise_group));
        } catch(e) {
          console.log(e)
        }
        // console.log(index, '第几个');
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
</style>
