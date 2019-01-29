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
            <i class="iconfont icon-vip1"></i>VIP到期时间：{{user_vip}}
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
      <router-view ref="routerview" :collectionlist="collectionlist" :sub_list="sub_list" :page="page" :total="total"
                   @chose="chose_sub" @pageChange="pageChange"></router-view>
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
  import {user_info, collection_list, subject_list} from 'api/index'

  export default {
    name: "user",
    data() {
      return {
        dialogVisible: false,
        collectionlist: [],
        sub_list: [],
        page: 0,
        total: 0,
        nowChose: {
          name: '全部',
          id: 'all',
          show: 0
        }
      }
    },
    created() {
      Date.prototype.format = function (fmt) { //author: meizz
        let o = {
          "M+": this.getMonth() + 1,                 //月份
          "d+": this.getDate(),                    //日
          "h+": this.getHours(),                   //小时
          "m+": this.getMinutes(),                 //分
          "s+": this.getSeconds(),                 //秒
          "q+": Math.floor((this.getMonth() + 3) / 3), //季度
          "S": this.getMilliseconds()             //毫秒
        };
        if (/(y+)/.test(fmt))
          fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (let k in o)
          if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
      };
      setTimeout(() => {
        this._updateUserInfo(this.$root.user.id)
      }, 300);
      this._getSubject();
      this.$root.eventHub.$on('updateUser', () => {
        console.log('更新收藏列表');
        let timer = setTimeout(() => {
          if (this.$refs.routerview && this.$refs.routerview._choseItem) {
            this.$refs.routerview._choseItem(this.nowChose, true)
          }
          clearTimeout(timer);
        }, 200);
      })
    },
    computed: {
      user_vip() {
        if (!this.$root.user.membership_exp_time) {
          return '非VIP'
        } else {
          const exp_time = parseInt(this.$root.user.membership_exp_time) + 28800000;
          return new Date(exp_time).format("yyyy-MM-dd");
        }
      }
    },
    methods: {
      pageChange(info) {
        this.page = info.value - 1;
        this._getCollectionList(info.choseId, true);
      },
      chose_sub({item, callback, must}) {
        this.page = 0;
        this._getCollectionList(item.id, must);
        this.nowChose = item;
        if (callback) {
          callback()
        }
      },
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
          this._getCollectionList('all');
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
      async _getCollectionList(id, must) {
        if (!this.$root.user) {
          return false
        }
        // if (this.collcache[id] && !must) {
        //   console.log('缓存', id);
        //   this.collectionlist = this.collcache[id].value;
        //   this.total = this.collcache[id].total;
        //   return false
        // }
        this.$root.eventHub.$emit('loading', true);
        const ret = await collection_list(this.$root.user.id, 4, this.page * 4, id);
        this.$root.eventHub.$emit('loading', null);
        if (ret.status === 200 && ret.data.state === 200) {
          this.collectionlist = ret.data.rows;
          // this.collcache[id] = {};
          // this.collcache[id].value = ret.data.rows;
          // this.collcache[id].total = ret.data.count;
          this.total = ret.data.count
        }
      },
      async _getSubject(id) {
        this.$root.eventHub.$emit('loading', true);
        const ret = await subject_list(id);
        this.$root.eventHub.$emit('loading', null);
        if (ret.status === 200 && ret.data.state === 200) {
          this.sub_list = [{
            name: '全部',
            id: 'all',
            show: 0
          }, ...ret.data.rows];
          console.log(this.sub_list)
        }
      },
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

  .ip-user {
    color: rgba(255, 255, 255, 0.35);
    font-size: 12px;
    margin: 0 10px;
  }
</style>
