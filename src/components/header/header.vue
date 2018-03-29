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
            <el-submenu index="5" v-show="user">
              <template slot="title">我的账户</template>
              <el-menu-item index="/none" class='phone-item disable'>{{user.phone}}</el-menu-item>
              <el-menu-item index="/none" class='phone-item disable'>我的积分<span class="green-text">{{user.score}}</span></el-menu-item>
              <el-menu-item index="/modify-password">修改密码</el-menu-item>
              <el-menu-item index="/none">
                <div class="log-out" @click="_logout">注销</div>
              </el-menu-item>
            </el-submenu>
            <el-menu-item index="/login" v-show="!user">登录帐号</el-menu-item>
          </el-menu>
        </div>
      </nav>
    </header>
    <sidebar ref="sidebar">
      <el-row class="tac">
        <el-col>
          <el-menu :default-active="$route.path" class="el-menu-vertical-demo" @select="handleSelect" text-color="#000" active-text-color="#ff9430">
            <el-menu-item index="/">
              <i class="iconfont icon-tijiaodingdan"></i> 提交订单
            </el-menu-item>
            <el-submenu index="/order">
              <template slot="title">
                <i class="iconfont icon-unie64a"></i> 我的订单
              </template>
              <el-menu-item index="/order/1">选项1</el-menu-item>
              <el-menu-item index="/order/2">选项2</el-menu-item>
              <el-menu-item index="/order/3">选项3</el-menu-item>
            </el-submenu>
            <!-- disabled -->
            <el-menu-item index="/score-record">
              <i class="iconfont icon-jilu"></i> 积分记录
            </el-menu-item>
            <el-submenu v-show="user" index="5">
              <template slot="title">
                <i class="iconfont icon-zhanghu"></i> 我的账户
              </template>
              <el-menu-item index="/none" class='phone-item disable'>{{user.phone}}</el-menu-item>
              <el-menu-item index="/none" class='phone-item disable'><i class="iconfont icon-jifen"></i>我的积分<span class="green-text">{{user.score}}</span></el-menu-item>
              <el-menu-item index="/modify-password">修改密码</el-menu-item>
              <el-menu-item index="/none">
                <div class="log-out" @click="_logout">注销</div>
              </el-menu-item>
            </el-submenu>
            <el-menu-item index="/login" v-show="!user">
              <i class="iconfont icon-msnui-user"></i> 登录帐号
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
import { mapGetters, mapMutations } from 'vuex'
import interlayer from 'base/interlayer/interlayer'
export default {
  data() {
    return {
      sidebar: false
    }
  },
  created() {
    this.$root.eventHub.$on('user', () => {
      this._updataUser()
    })
  },
  computed: {
    ...mapGetters([
      'user'
    ])
  },
  methods: {
    _logout() {
      this.setUser(false)
      this.setToken(false)
      this.$message({
        showClose: true,
        message: '已注销',
        type: 'success'
      })
      this.$router.replace({
        path: '/login'
      })
    },
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
      if (key === '/none') {
        return false
      }
      this.$router.replace({
        path: key
      })
      if (this.sidebar) {
        this._hiddenSidebar()
      }
    },
    _updataUser(data) {
      console.log('shoudao')
    },
    ...mapMutations({
      setToken: 'SET_TOKEN',
      setUser: 'SET_USER'
    })
  },
  components: {
    sidebar,
    interlayer
  }
}

</script>
<style type="text/css" scoped>
.iconfont {
  font-size: 20px;
  margin: 0 10px 0 0;
}

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

.phone-item {
  color: #777 !important;
  font-size: 13px;
}

.phone-item:hover {
  color: #777 !important;
}

.icon-jifen {
  color: #777 !important;
}

.disable {
  cursor: default;
  pointer-events: none;
}

.iconfont {
  color: #000;
}

.log-out {
  height: 100%;
  width: 100%;
}

.green-text {
  display: inline-block;
  font-size: 15px;
  color: #4CAF50;
  margin: -5px 10px 0;
}

</style>
