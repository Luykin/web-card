<template>
  <div class="index">
    <div class="index-main">
      <crumbs :crumbs="crumbs_list"></crumbs>
      <div class="card-detail-warp" v-if="info">
        <div v-html="info.content"></div>
        <div class="el-switch-warp flex">
          <span v-show="disabled">3s之后可查看答案</span>
          <el-switch
            v-model="detail"
            active-color="#13ce66"
            inactive-color="#ededed"
            :active-value="active_value"
            :inactive-value="inactive_value" :disabled="disabled">
          </el-switch>
        </div>
      </div>
      <div class="card-detail-warp hidden-answer" :class="{'show-answer': detail}" v-if="info">
        <div v-html="info.answer"></div>
      </div>
      <div class="flex">
        <div class="flex">
          <el-button type="primary" round @click="_pre">上一题</el-button>
        </div>
        <div class="flex">
          <el-button type="primary" v-if="info" round @click="_collection" :class="{'disable': info.collection}">
            <i class="icon-icon-test iconfont"></i>{{info.collection?'已收藏': '收藏本卡片'}}
          </el-button>
        </div>
        <div class="flex">
          <el-button type="primary" round @click="_next">下一题</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import crumbs from 'base/crumbs/crumbs'
  import {card_id, collection} from 'api/index'

  export default {
    name: "card-dettail",
    data() {
      return {
        active_value: true,
        inactive_value: false,
        detail: false,
        disabled: true,
        crumbs_list: [{
          name: '个人中心',
          path: '/user'
        }, {
          name: '收藏卡片',
          path: null
        }],
        info: {
          answer: '',
          content: ''
        },
        exercise_group_index: 0,
        timer: null
      }
    },
    created() {
      if ('info_index' in this.$route.params) {
        this.exercise_group_index = this.$route.params.info_index;
        localStorage.setItem('exercise_group_index', this.$route.params.info_index)
      } else {
        this.exercise_group_index = localStorage.getItem('exercise_group_index') || 0;
      }
      if (this.$root.exercise_group.length) {
        this.info = this.$root.exercise_group[this.exercise_group_index]
      } else {
        try {
          this.$root.exercise_group = JSON.parse(localStorage.getItem('exercise_group')) || []
        } catch (err) {
          console.log(err)
        }
        if (this.$root.exercise_group.length) {
          this.info = this.$root.exercise_group[this.exercise_group_index]
        } else {
          this.$router.replace({
            name: `train-index`
          });
          return false
        }
      }
      // console.log(this.info, this.exercise_group_index, this.$root.exercise_group);
      this._init(300)
    },
    methods: {
      _init(time) {
        if (!this.info || !this.info.id) {
          this.$router.replace({
            name: `train-index`
          });
          return false
        }
        setTimeout(() => {
          this._getCardDetail(this.info.id);
          this._setDisable()
        }, time || 0);
      },
      _next() {
        if (this.exercise_group_index >= this.$root.exercise_group.length - 1) {
          this.$message({
            message: '已经是最后一题啦',
            type: 'warning'
          });
          return false
        } else {
          this.disabled = true;
          this.detail = false;
          this.exercise_group_index += 1;
          this.info = this.$root.exercise_group[this.exercise_group_index];
          // console.log(this.$root.exercise_group, this.exercise_group_index, this.info)
          this._init(0)
        }
      },
      _pre() {
        if (this.exercise_group_index <= 0) {
          this.$message({
            message: '已经是第一题啦',
            type: 'warning'
          });
          return false
        } else {
          this.disabled = true;
          this.detail = false;
          this.exercise_group_index -= 1;
          this.info = this.$root.exercise_group[this.exercise_group_index];
          // console.log(this.$root.exercise_group, this.exercise_group_index, this.info)
          this._init(0)
        }
      },
      async _collection() {
        this.$root.eventHub.$emit('loading', true);
        const ret = await collection(this.$root.user.id, this.info.id, this.info.collection);
        this.$root.eventHub.$emit('loading', null);
        if (ret.status === 200 && ret.data.state === 200) {
          if (!this.info.collection) {
            this.$message({
              message: '收藏成功',
              type: 'success'
            });
          } else {
            this.$message({
              message: '已经取消收藏',
              type: 'success'
            });
          }
          this._getCardDetail(this.info.id);
        } else {
          this.$message({
            message: '收藏失败',
            type: 'warning'
          });
        }
      },
      async _getCardDetail(id) {
        if (!id || !this.$root.user) {
          this.$router.replace({
            name: `train-index`
          });
          return false
        }
        this.$root.eventHub.$emit('loading', true);
        const ret = await card_id(id, this.$root.user.id);
        this.$root.eventHub.$emit('loading', null);
        if (ret.status === 200 && ret.data.state === 200) {
          this.info = ret.data
        }
      },
      _setDisable() {
        if (this.timer) {
          this.disabled = true;
          clearTimeout(this.timer)
        }
        this.timer = setTimeout(() => {
          this.disabled = false
        }, 3000)
      },
    },
    components: {
      crumbs
    }
  }
</script>

<style scoped>
  .index-main {
    position: relative;
  }

  .card-detail-warp {
    width: 70%;
    padding: 3% 5%;
    height: auto;
    /*min-height: 70px;*/
    box-shadow: 0 0 10px rgba(0, 0, 0, .1);
    border-radius: 10px;
    margin: 20px auto;
    position: relative;
  }

  .el-switch-warp {
    width: auto;
    position: absolute;
    right: 3%;
    top: 10%;
    color: #999;
  }

  .el-switch {
    margin: 0 10px;
  }

  .hidden-answer {
    transition: all .2s;
    /*transform: translate(-50%, 0) scale(1, 0);*/
    /*position: absolute;*/
    /*left: 50%;*/
    /*top: 50%;*/
    height: 0;
    padding: 0 5%;
    transform-origin: top center;
    opacity: 0;
  }

  .show-answer {
    /*transform: translate(0, 0) scale(1, 1);*/
    /*left: 0;*/
    /*top: 0;*/
    /*position: relative;*/
    height: auto;
    padding: 3% 5%;
    transform-origin: top center;
    opacity: 1;
  }

  .disable {
    background: #67c23a !important;
    /*pointer-events: none;*/
  }
  /*.disable .icon-icon-test{*/
  /*color: ;*/
  /*}*/
</style>
