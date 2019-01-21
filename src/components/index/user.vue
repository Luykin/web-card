<template>
  <transition name="layer">
    <div class="index" v-if="$root.user">
      <div class="user-header flex js">
        <div class="user-pic-bg">
          <img :src="$root.user.icon" class="user-avatar"/>
        </div>
        <div class="user-name flex fw js">
          <span class="flex js"><i class="iconfont icon-yonghu"></i>用户： {{$root.user.name}}</span>
          <router-link tag='span' to='/vip' class="flex js vip-router">
            <i class="iconfont icon-vip1"></i>到期时间：{{user_vip}}
          </router-link>
        </div>
        <div class="header-other flex">
          <!--<span class="ip-user">上次登录IP地址: {{$root.user.ip}}</span>-->
          <div class="flex login-out-btn cur" @click="dialogVisible = true">退出登录</div>
        </div>
      </div>
      <!--<div class="">-->
        <!--<div v-for="item in $root.user.cards">{{item.title}}</div>-->
      <!--</div>-->
      <router-view></router-view>
      <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose">
        <span>是否退出登录</span>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="_sure()">确 定</el-button>
         </span>
      </el-dialog>
    </div>
  </transition>
</template>

<script>
  import {user_info} from 'api/index'
  export default {
    name: "user",
    data() {
      return {
        dialogVisible: false
      }
    },
    created() {
      setTimeout(() => {
        // this._getCollectionList()
        // console.log(this.$root.user)
        this._updateUserInfo(this.$root.user.id)
      }, 300);
    },
    computed: {
      user_vip() {
        if (!this.$root.user.membership_exp_time) {
          return '非VIP'
        } else {
          return this.$root.user.membership_exp_time
        }
      }
    },
    methods: {
      async _updateUserInfo(id) {
        if (!id && id !== 0) {
          return false
        }
        this.$root.eventHub.$emit('loading', true);
        const ret = await user_info(id);
        this.$root.eventHub.$emit('loading', null);
        if (ret.status === 200 && ret.data.state === 200) {
          this.$root.user = ret.data;
          localStorage.setItem('user-info', encodeURIComponent(JSON.stringify(ret.data)));
          return false
        } else {
          // console.log(ret)
          if (ret.data.state === 435) {
            this.$message({
              message: '登录已失效',
              type: 'warning'
            });
            this.$router.replace({
              path: '/login'
            });
            this.dialogVisible = false;
            this.$root.user = null;
            localStorage.setItem('user-info', null);
          }
        }
      },
      _sure() {
        this.$router.replace({
          path: '/index'
        });
        this.dialogVisible = false;
        this.$root.user = null;
        localStorage.setItem('user-info', null);
      },
      // async _getCollectionList() {
      //   if (!this.$root.user) {
      //     return false
      //   }
      //   this.$root.eventHub.$emit('loading', true);
      //   const ret = await collection_list(this.$root.user.id);
      //   this.$root.eventHub.$emit('loading', null);
      //   if (ret.status === 200 && ret.data.state === 200) {
      //     this.list= res.data.rows
      //   }
      // },
    }
  }
</script>

<style scoped>
  .user-header {
    width: 70%;
    padding: 0 15%;
    height: 200px;
    background: url("http://cdn.jiangzhifan.com/user.png") no-repeat;
    background-size: 100% 100%;
    color: #fff;
  }

  .user-avatar {
    width: 100%;
    height: 100%;
    border-radius: 1000px;
  }

  .user-pic-bg {
    border: 4px solid #fff;
    box-shadow: 0 4px 10px 0 rgba(7, 17, 27, .12);
    width: 100px;
    height: 100px;
    /*position: relative;*/
    border-radius: 100%;
    background: #fff;
    margin: 0 10px;
    flex-shrink: 0;
    flex-grow: 0;
  }

  .user-name {
    padding: 0 15px;
    width: auto;
    min-width: 100px;
    height: 100%;
    font-weight: 600;
    font-size: 16px;
  }

  .vip-router {
    width: auto;
    font-weight: 400;
    font-size: 13px;
    margin-top: 8px;
  }

  .vip-router:hover {
    color: #EB7B2D;
    cursor: pointer;
  }

  .header-other {
    justify-content: flex-end;
    height: 100%;
  }

  .login-out-btn {
    /*width: 100px;*/
    width: auto;
    border-radius: 100px;
    padding: 8px 20px;
    border: 1px solid rgba(255, 255, 255, .45);
    font-size: 14px;
    color: rgba(255, 255, 255, .8);
    height: 20px;
  }

  .login-out-btn:hover {
    border: 1px solid rgba(255, 255, 255, .9);
  }
  .ip-user{
    color: rgba(255, 255, 255, 0.35);
    font-size: 12px;
    margin: 0 10px;
  }
</style>
