<template>
  <transition name="layer">
    <div class="layer flex" @click.self="_close">
      banner 内容
    </div>
  </transition>
</template>

<script>
    export default {
        name: "banner",
      created() {
          console.log(this.$route)
      },
        methods: {
          _close() {
            this.$router.back()
          }
        }
    }
</script>

<style scoped>

</style>
