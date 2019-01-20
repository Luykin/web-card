<template>
  <transition name="layer">
    <div class="layer flex" @click.self="_close">
      <!--{{$route.params.path}}-->
      <img :src="$route.params.path" class="banner-img"/>
    </div>
  </transition>
</template>

<script>
    export default {
        name: "banner",
      created() {
          if (!this.$route.params.path) {
            this.$router.replace({
              path: '/index'
            })
          }
          // console.log(this.$route)
      },
        methods: {
          _close() {
            this.$router.back()
          }
        }
    }
</script>

<style scoped>
.banner-img{
  max-width: 1080px;
  height: auto;
}
</style>
