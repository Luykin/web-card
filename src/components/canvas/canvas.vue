<template>
  <canvas class="x-canvas" id="x-canvas" ref="canvas"></canvas>
</template>
<script type="text/javascript">
const arryFlower = []
const color = ['rgba(255,255,255,.3)', 'rgba(255,255,255,.4)', 'rgba(250,250,250,.5)', 'rgba(255,255,255,.6)', 'rgba(255,255,255,.7)', 'rgba(255,255,255,.8)']
const size = [3.2, 3.4, 3.6, 3.8, 4, 4.2, 4.4, 4.6]
const speed = 1.8
const header = 65
const footer = 135
const margin = 0
const H = header + footer + margin
const TPI = Math.PI * 2
export default {
  data() {
    return {
      ctx: false,
      bg: false,
        allNumber: 55,
      time: false
    }
  },
  created() {
    const that = this
    this.$root.eventHub.$on('canvas', (res) => {
      that._changeSize(that, res)
    })
    this._windowReady()
  },
  mounted() {
    const that = this
    window.onresize = () => {
      that._changeSize(that)
    }
  },
  methods: {
    _changeSize(that, reload) {
      requestAnimationFrame(() => {
        if (this.time) {
          clearTimeout(this.time)
        }
        this.time = setTimeout(() => {
          if ((that.$refs.canvas.height !== (document.body.offsetHeight - H)) || reload) {
            that.$refs.canvas.width = window.screen.width
            that.$refs.canvas.height = document.body.offsetHeight - H
          }
        }, 300)
      })
    },
    _windowReady() {
      window.onload = () => {
        this.$refs.canvas.width = window.screen.width
        this.$refs.canvas.height = document.body.offsetHeight - H
        this.ctx = this.$refs.canvas.getContext('2d')
        this._initCanvas()
        this._start(this.ctx)
      }
    },
    _initCanvas() {
      // this.bg = new Image()
      // this.bg.src = "http://ozp5yj4ke.bkt.clouddn.com/bg.c72fa3d.png"
      let width = this.$refs.canvas.width
      let height = this.$refs.canvas.height
      // 设置雪花个数
      if (width < 420) {
        this.allNumber = 20
      }
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
      for (let i = 0; i < this.allNumber; i++) {
        let index = Math.floor((Math.random() * color.length))
        const c = color[index]
        index = Math.floor((Math.random() * size.length))
        const s = size[index]
        const x = Math.floor((Math.random() * width))
        const y = Math.floor((Math.random() * height))
        let vx = Math.random() * speed.toFixed(2)
        let vy = Math.random() * speed.toFixed(2)
        if (vx * vy < speed * 0.04) {
          vy = speed * 0.5
        }
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
    _drawImg(ctx, img, x, y) {
      // background: url('http://ozp5yj4ke.bkt.clouddn.com/bg.c72fa3d.png') no-repeat fixed top;
      ctx.drawImage(img, x, y)
    },
    _start(ctx) {
      window.requestAnimationFrame(() => {
        this.$refs.canvas.width = window.screen.width
        // this._drawImg(ctx, this.bg, 0, 0)
        arryFlower.forEach((item) => {
          if (item.x > this.$refs.canvas.width) {
            item.x = this.$refs.canvas.width - 1
            item.reverseX()
          }
          if (item.x < 0) {
            item.x = 0
            item.reverseX()
          }
          if (item.y > this.$refs.canvas.height) {
            item.y = this.$refs.canvas.height - 1
            item.reverseY()
          }
          if (item.y < 0) {
            item.y = 0
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
