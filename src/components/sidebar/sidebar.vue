<template>
  <div class="siderbar" :class="{siderbarIn:siderbarIn, siderbarOut:siderbarOut}">
    <slot></slot>
  </div>
</template>
<script type="text/javascript">
export default {
  data () {
    return {
      siderbarIn: false,
      siderbarOut: false
    }
  },
  methods: {
    _showSidebar () {
      this.siderbarIn = true
      this.siderbarOut = false
    },
    _hiddenSidebar () {
      this.siderbarIn = false
      this.siderbarOut = true
    }
  }
}

</script>
<style type="text/css" scoped>
  .siderbar{
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    width: 300px;
    flex-wrap: wrap;
    background: #fff;
    z-index: 9999;
    box-shadow: 1px 0 5px rgba(0,0,0, .1);
    transform: translate3d(-300px, 0px, 0px);
    overflow: hidden;
  }
  .siderbarIn{
    animation: siderbarIn .25s ease-in 1 forwards;
  }
  .siderbarOut{
    animation: siderbarOut .25s ease 1 forwards;
  }
  @keyframes siderbarIn{
    0%{
      transform: translate3d(-300px, 0px, 0px);
    }
    100%{
      transform: translate3d(0px, 0px, 0px);
    }
  }
  @keyframes siderbarOut{
    0%{
      transform: translate3d(0px, 0px, 0px);
    }
    100%{
      transform: translate3d(-300px, 0px, 0px);
    }
  }
</style>
