<template>
  <div class="popup" :class="{popupIn:popupIn, popupOut:popupOut}">
    <slot></slot>
  </div>
</template>
<script type="text/javascript">
export default {
  data() {
    return {
      popupIn: false,
      popupOut: false
    }
  },
  methods: {
    _showPopup() {
      this.popupIn = true
      this.popupOut = false
    },
    _hiddenPopup() {
      this.popupIn = false
      this.popupOut = true
    }
  }
}

</script>
<style type="text/css" scoped>
.popup {
  position: fixed;
  left: 50%;
  top: 0px;
  transform: translate3d(-50%, -200%, 0);
  flex-wrap: wrap;
  background: #fff;
  box-shadow: 0 0 5px rgba(0, 0, 0, .1);
  overflow: hidden;
  z-index: 99999;
  border-radius: 10px;
}

.popupIn {
  animation: popupIn .35s ease-in 1 forwards;
}

.popupOut {
  animation: popupOut .45s ease 1 forwards;
}

@keyframes popupIn {
  0% {
    transform: translate3d(-50%, -150%, 0);
  }
  100% {
    transform: translate3d(-50%, 25%, 0);
  }
}

@keyframes popupOut {
  0% {
    transform: translate3d(-50%, 25%, 0);
  }
  100% {
    transform: translate3d(-50%, -200%, 0);
  }
}

</style>
