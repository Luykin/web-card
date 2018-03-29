<template>
  <canvas class="x-canvas" id="x-canvas" ref="canvas"></canvas>
</template>
<script type="text/javascript">
const arryFlower = []
const allNumber = 60
const color = ['rgba(255,255,255,.4)', 'rgba(255,255,255,.5)', 'rgba(255,255,255,.6)', 'rgba(255,255,255,.7)']
const size = [3, 4, 5, 6]
const speed = 1.5
const headerHeight = 80
const TPI = Math.PI * 2
export default {
  data() {
    return {
      ctx: false,
      clientWidth: '1920px',
      clientHeight: '1080px'
    }
  },
  created() {
    this._windowReady()
  },
  mounted() {
    const that = this
    window.onresize = () => {
      requestAnimationFrame(() => {
        that.$nextTick(() => {
          that.$refs.canvas.width = document.body.clientWidth || window.screen.width
          that.$refs.canvas.height = (document.body.clientHeight || document.body.clientHeight) - headerHeight
        })
      })
    }
  },
  methods: {
    _windowReady() {
      window.onload = () => {
        this.$refs.canvas.width = document.body.clientWidth || window.screen.width
        this.$refs.canvas.height = (document.body.clientHeight || window.screen.height) - headerHeight
        this.ctx = this.$refs.canvas.getContext('2d')
        this._initCanvas()
        this._start(this.ctx)
      }
    },
    _initCanvas() {
      class Flower {
        constructor(x, y, r, vx, vy, c) {
          this.x = x
          this.y = y
          this.r = r
          this.c = c
          this.vx = vx
          this.vy = vy
        }
        reverseX() {
          this.vx = -this.vx
        }
        reverseY() {
          this.vy = -this.vy
        }
        move() {
          this.x = this.x + this.vx
          this.y = this.y + this.vy
        }
      }
      for (let i = 0; i < allNumber; i++) {
        let index = Math.floor((Math.random() * color.length))
        const c = color[index]
        index = Math.floor((Math.random() * size.length))
        const s = size[index]
        const x = Math.floor((Math.random() * this.$refs.canvas.width))
        const y = Math.floor((Math.random() * this.$refs.canvas.height))
        let vx = Math.random() * speed.toFixed(2)
        let vy = Math.random() * speed.toFixed(2)
        if (Math.random() > 0.5) {
          vx = -vx
        }
        if (Math.random() > 0.5) {
          vy = -vy
        }
        const floor = new Flower(x, y, s, vx, vy, c)
        arryFlower.push(floor)
      }
    },
    _draw(ctx, x, y, r, c) {
      ctx.beginPath()
      ctx.arc(x, y, r, 0, TPI, false)
      ctx.closePath()
      ctx.fillStyle = c
      ctx.fill()
    },
    _start(ctx) {
      window.requestAnimationFrame(() => {
        this.$refs.canvas.width = document.body.clientWidth || window.screen.width
        arryFlower.forEach((item) => {
          if (item.x >= this.$refs.canvas.width || item.x <= 0) {
            item.reverseX()
          }
          if (item.y > this.$refs.canvas.height || item.y <= 0) {
            item.reverseY()
          }
          item.move()
          this._draw(ctx, item.x, item.y, item.r, item.c)
        })
        window.requestAnimationFrame(() => {
          this._start(ctx)
        })
      })
    }
  }
}

</script>
<style type="text/css" scoped>
.x-canvas {
  position: absolute;
  top: 65px;
  left: 0;
  z-index: -1;
}

</style>
