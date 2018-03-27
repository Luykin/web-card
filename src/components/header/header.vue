<template>
  <div>
    <header class="header flex">
      <nav class="phone-nav flex" id="phone-nav" @click="_showSidebar">
        <i class="iconfont icon-gengduo"></i>
      </nav>
      <div class="logo flex">最专业的网红助手平台</div>
      <nav class="pc-nav flex" id="pc-nav">
        <div class="nav-ul flex">
          <el-menu :default-active="$route.path" class="el-menu-demo" mode="horizontal" @select="handleSelect" text-color="#000" active-text-color="#ff9430">
            <el-menu-item index="/">提交订单</el-menu-item>
            <el-submenu index="/order">
              <template slot="title">我的订单</template>
              <el-menu-item index="/order/1">选项1</el-menu-item>
              <el-menu-item index="/order/2">选项2</el-menu-item>
              <el-menu-item index="/order/3">选项3</el-menu-item>
            </el-submenu>
            <!-- disabled -->
            <el-menu-item index="/score-record">积分记录</el-menu-item>
            <el-submenu index="4">
              <template slot="title">我的账户</template>
              <el-menu-item index="4-1" class='phone-item disable'>177484156</el-menu-item>
              <el-menu-item index="4-2" class='phone-item disable'>我的积分</el-menu-item>
              <el-menu-item index="/modify-password">修改密码</el-menu-item>
              <el-menu-item index="4-4">选项3</el-menu-item>
            </el-submenu>
             <el-menu-item index="/login">登陆帐号</el-menu-item>
          </el-menu>
        </div>
      </nav>
    </header>
    <sidebar ref="sidebar">
      <el-row class="tac">
        <el-col>
          <el-menu default-active="2" class="el-menu-vertical-demo"  @select="handleSelect" text-color="#000" active-text-color="#ff9430">
            <el-menu-item index="/">提交订单</el-menu-item>
            <el-submenu index="/order">
              <template slot="title">我的订单</template>
              <el-menu-item index="/order/1">选项1</el-menu-item>
              <el-menu-item index="/order/2">选项2</el-menu-item>
              <el-menu-item index="/order/3">选项3</el-menu-item>
            </el-submenu>
            <!-- disabled -->
            <el-menu-item index="/score-record">积分记录</el-menu-item>
            <el-submenu index="4">
              <template slot="title">我的账户</template>
              <el-menu-item index="4-1" class='phone-item disable'>177484156</el-menu-item>
              <el-menu-item index="4-2" class='phone-item disable'>我的积分</el-menu-item>
              <el-menu-item index="/modify-password">修改密码</el-menu-item>
              <el-menu-item index="4-4">选项3</el-menu-item>
            </el-submenu>
             <el-menu-item index="/login">登陆帐号</el-menu-item>
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
      sidebar: false
    }
  },
  methods: {
    _showSidebar() {
      this.sidebar = true
      this.$nextTick(() => {
        this.$refs.sidebar._showSidebar()
        this.$refs.interlayer._showLayer()
      })
    },
    _hiddenSidebar() {
      this.sidebar = false
      this.$refs.sidebar._hiddenSidebar()
      this.$refs.interlayer._hiddenLayer()
    },
    handleSelect(key, keyPath) {
      // console.log(key, keyPath)
      this.$router.replace({
        path: key
      })
      if (this.sidebar) {
        this._hiddenSidebar()
      }
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
.iconfont{
  color: #000;
}
</style>
