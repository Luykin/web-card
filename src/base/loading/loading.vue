<template>
  <div class="body" v-if="show">
    <div class="loadEffect">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
  </div>
</template>
<script type="text/javascript">
  export default {
    data() {
      return {
        show: null
      }
    },
    created() {
    },
    methods: {
      _show() {
        this.show = true
      },
      _hidden() {
        this.show = null
      }
    }
  }
</script>
<style scoped>
  .body {
    position: fixed;
    z-index: 9999999999;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: #000;
    opacity: .9;
    user-select: none;
    /*overflow: hidden;*/
  }

  .loadEffect {
    width: 80px;
    height: 80px;
    margin: 0 auto;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .loadEffect span {
    display: inline-block;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #fff;
    position: absolute;
    -webkit-animation: load 1.04s ease infinite;
  }

  @-webkit-keyframes load {
    0% {
      opacity: 1;
      background: lightgreen;
    }
    100% {
      opacity: 0.3;
      background: #fff;
    }
  }

  .loadEffect span:nth-child(1) {
    left: 0;
    top: 50%;
    margin-top: -8px;
    -webkit-animation-delay: 0.13s;
  }

  .loadEffect span:nth-child(2) {
    left: 14px;
    top: 14px;
    -webkit-animation-delay: 0.26s;
  }

  .loadEffect span:nth-child(3) {
    left: 50%;
    top: 0;
    margin-left: -8px;
    -webkit-animation-delay: 0.39s;
  }

  .loadEffect span:nth-child(4) {
    top: 14px;
    right: 14px;
    -webkit-animation-delay: 0.52s;
  }

  .loadEffect span:nth-child(5) {
    right: 0;
    top: 50%;
    margin-top: -8px;
    -webkit-animation-delay: 0.65s;
  }

  .loadEffect span:nth-child(6) {
    right: 14px;
    bottom: 14px;
    -webkit-animation-delay: 0.78s;
  }

  .loadEffect span:nth-child(7) {
    bottom: 0;
    left: 50%;
    margin-left: -8px;
    -webkit-animation-delay: 0.91s;
  }

  .loadEffect span:nth-child(8) {
    bottom: 14px;
    left: 14px;
    -webkit-animation-delay: 1.04s;
  }
</style>
