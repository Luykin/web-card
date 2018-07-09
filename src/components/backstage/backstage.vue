<template>
  <div id="main-body" ref='mainbody'>
    <div class="main-box flex" id="main-box" v-if="user">
      <b-agent></b-agent>
      <div class="back-servce-box">
        <div v-for="item in app.service_categories" class="service-item flex cursor" :class="{'activeCategory':activeCategory == item.id}">
          {{item.label}}
        </div>
        <div class="segmenting-line"></div>
      </div>
    </div>
  </div>
</template>
<script type="text/javascript">
import { mapGetters, mapMutations } from 'vuex'
import BAgent from 'components/backstage-banner/backstage-banner'
export default {
	data () {
		return {
			activeCategory: 1
		}
	},
  created() {
    console.log(1)
    // activeCategory: 1
  },
  computed: {
    ...mapGetters([
      'user',
      'token',
      'tokenTime',
      'app'
    ])
  },
  components: {
    BAgent
  },
}

</script>
<style type="text/css" scoped>
.main-box{
	justify-content: flex-start;
}
.back-servce-box {
  width: 22%;
  height: 100%;
  position: relative;
}

.segmenting-line {
  width: 20px;
  background: #F4F4F4;
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
}

.service-item {
	box-sizing: border-box;
  width: 100%;
  height: 50px;
  text-indent: -20px;
  border-bottom: 1px solid #F0F0F0;
}
.activeCategory{
	border-left: 2px solid rgba(255, 210, 54, 1);
}
</style>
