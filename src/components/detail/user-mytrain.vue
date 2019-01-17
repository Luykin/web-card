<template>
  <div class="index-main flex fw">
    <userrouter></userrouter>
    <div class="collection" v-if="$root.user">
      <empty></empty>
    </div>
  </div>
</template>

<script>
  import userrouter from './user-router'
  import empty from 'base/empty/empty'
  export default {
    name: "user-mytrain",
    components: {
      empty,
      userrouter
    }
  }
</script>

<style scoped>

</style>
