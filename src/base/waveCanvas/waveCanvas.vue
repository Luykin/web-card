<template>
  <canvas class="wave-canvas" ref="canvas" :width="cWidth" :height="cHeight"></canvas>
</template>
<script type="text/javascript">
const radius = 1
const spped = 10
const acceleration = -0.5
const TPI = Math.PI * 2
export default {
  props: {
    cWidth: {
      type: [Number, String],
      dafault: 70
    },
    cHeight: {
      type: [Number, String],
      dafault: 65
    },
    cid: {
      type: [Number],
      dafault: 0
    }
  },
  data() {
    return {
      ctx: false,
      r: radius,
      v: spped,
      a: acceleration,
      c: 'rgba(255, 255, 255, .2)',
      rc: '#ff6b4e'
    }
  },
  created() {
    // const that = this
    // this._waveInt()
  },
  methods: {
    // _waveInt() {
    //   const that = this
    //   window.onload = () => {
    //     that.ctx = that.$refs.canvas.getContext('2d')
    //   }
    // },
    _drawCircle(e, id) {
      if (id === this.cid) {
        this.$nextTick(() => {
          // this.$refs.canvas.width = this.cWidth
          console.log(this.$refs.canvas)
          const ctx = this.$refs.canvas.getContext('2d')
          this._start(e.offsetX, e.offsetY, ctx)
        })
      }
    },
    _draw(ctx, x, y, r, c) {
      ctx.beginPath()
      ctx.arc(x, y, r, 0, TPI, false)
      ctx.closePath()
      ctx.fillStyle = c
      ctx.fill()
    },
    _drawRect(ctx, x, y, w, h, c) {
      ctx.beginPath()
      ctx.rect(x, y, this.cWidth, this.cHeight)
      ctx.closePath()
      ctx.fillStyle = c
      ctx.fill()
    },
    _start(x, y, ctx) {
      window.requestAnimationFrame(() => {
        if (this.r < 80 && this.r > 0) {
          ctx.rect(0, 0, this.cWidth, this.cHeight)
          this._drawRect(ctx, 0, 0, this.cWidth, this.cHeight, this.rc)
          this._draw(ctx, x, y, this.r, this.c)
          this.r = this.r + this.v
          this.v = this.v + this.a
          this.a = this.a - 0.1
          window.requestAnimationFrame(() => {
            this._start(x, y, ctx)
          })
        } else {
          if (this.$refs.canvas) {
            this.$refs.canvas.width = this.cWidth
            this._drawRect(ctx, 0, 0, this.cWidth, this.cHeight, this.rc)
            this.r = radius
            this.v = spped
            this.a = acceleration
          } else {
            window.requestAnimationFrame(() => {
              this._start(x, y, ctx)
            })
          }
        }
      })
    }
  }
}

</script>
<style type="text/css" scoped>
.wave-canvas {
  position: absolute;
  z-index: 1;
  left: 0;
  top: 0;
}

</style>
