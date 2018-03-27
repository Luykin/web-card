<template>
  <div>
    <header class="header flex">
      <nav class="phone-nav flex" id="phone-nav" @click="_showSidebar">
        <i class="el-icon-more" style="font-size:20px"></i>
      </nav>
      <div class="logo flex">最专业的网红助手平台</div>
      <nav class="pc-nav flex" id="pc-nav">
        <div class="nav-ul flex">
          <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect" text-color="#000" active-text-color="#ff9430">
            <el-menu-item index="1"><router-link tag='div' to='/'>提交订单</router-link></el-menu-item>
            <el-submenu index="2">
              <template slot="title">我的订单</template>
              <el-menu-item index="2-1">选项1</el-menu-item>
              <el-menu-item index="2-2">选项2</el-menu-item>
              <el-menu-item index="2-3">选项3</el-menu-item>
              <el-submenu index="2-4">
                <template slot="title">选项4</template>
                <el-menu-item index="2-4-1">选项1</el-menu-item>
                <el-menu-item index="2-4-2">选项2</el-menu-item>
                <el-menu-item index="2-4-3">选项3</el-menu-item>
              </el-submenu>
            </el-submenu>
            <!-- disabled -->
            <el-menu-item index="3">积分记录</el-menu-item>
            <el-submenu index="4">
              <template slot="title">我的账户</template>
              <el-menu-item index="4-1" class='phone-item disable'>177484156</el-menu-item>
              <el-menu-item index="4-2" class='phone-item disable'>我的积分</el-menu-item>
              <el-menu-item index="4-3">
                <router-link tag='div' to='/modify-password'>修改密码</router-link></el-menu-item>
              <el-menu-item index="4-4">选项3</el-menu-item>
            </el-submenu>
          </el-menu>
        </div>
      </nav>
    </header>
    <sidebar ref="sidebar">
      <el-row class="tac">
        <el-col>
          <el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" text-color="#000" active-text-color="#ff9430">
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>导航一</span>
              </template>
              <el-menu-item-group>
                <template slot="title">分组一</template>
                <el-menu-item index="1-1">选项1</el-menu-item>
                <el-menu-item index="1-2">选项2</el-menu-item>
              </el-menu-item-group>
              <el-menu-item-group title="分组2">
                <el-menu-item index="1-3">选项3</el-menu-item>
              </el-menu-item-group>
              <el-submenu index="1-4">
                <template slot="title">选项4</template>
                <el-menu-item index="1-4-1">选项1</el-menu-item>
              </el-submenu>
            </el-submenu>
            <el-menu-item index="2">
              <i class="el-icon-menu"></i>
              <span slot="title">导航二</span>
            </el-menu-item>
            <el-menu-item index="3" disabled>
              <i class="el-icon-document"></i>
              <span slot="title">导航三</span>
            </el-menu-item>
            <el-menu-item index="4">
              <i class="el-icon-setting"></i>
              <span slot="title">导航四</span>
            </el-menu-item>
          </el-menu>
        </el-col>
      </el-row>
    </sidebar>
    <interlayer ref="interlayer" @close="_hiddenSidebar"></interlayer>
  </div>
</template>
<script type="text/javascript" scoped>
import sidebar from 'components/sidebar/sidebar'
import interlayer from 'base/interlayer/interlayer'
export default {
  data() {
    return {
      activeIndex: '1'
    }
  },
  methods: {
    _showSidebar() {
      this.$nextTick(() => {
        this.$refs.sidebar._showSidebar()
        this.$refs.interlayer._showLayer()
      })
    },
    _hiddenSidebar() {
      this.$refs.sidebar._hiddenSidebar()
      this.$refs.interlayer._hiddenLayer()
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath)
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath)
    }
  },
  components: {
    sidebar,
    interlayer
  }
}

</script>
<style type="text/css" scoped>
.header {
  height: auto;
  min-height: 65px;
  width: 100%;
  flex-wrap: wrap;
  background: #fff;
  box-shadow: 0px 1px 10px rgba(0, 0, 0, .1);
  overflow: hidden;
}

.phone-nav {
  width: 50px;
  height: 65px;
  flex-shrink: 0;
}

.pc-nav {
  height: 65px;
  flex-grow: 1;
  min-width: 30%;
  max-width: 100%;
  flex-shrink: 0;
}

.logo {
  height: 65px;
  max-width: 100%;
  min-width: 240px;
  flex-shrink: 0;
  flex-grow: 1;
}

.phone-item{
  color: #777 !important;
  font-size: 13px;
}
.phone-item:hover{
  color: #777 !important;
}
.disable{
  cursor: default;
  pointer-events: none;
}
</style>
