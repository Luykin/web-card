<template>
  <div class="edit-box">
    <div class="edit-content" v-if="user">
      <div class="edit-logo" :style="siteLogo">
        <input type="file" name="selectLogo" class="file-input" ref="fileInput" @change='_uplodeQiniu'>
        <div class="jindu flex">{{Process}}</div>
        <div class="zushi shpc">注：推荐尺寸150*45图片，不能超过1M。</div>
      </div>
      <div class="cr-item flex">
        <div class="cr-box-tit ellipsis flex">分站名称:</div>
        <div class="cr-box-min flex">
          <input type="text" v-model="siteName" class="edit-input" min="1" max="10">
        </div>
      </div>
      <div class="cr-item flex">
        <div class="cr-box-tit ellipsis flex">我的分站:</div>
        <div class="cr-box-min flex">{{user.agency.sub_domain}}</div>
      </div>
      <div class="cr-item flex">
        <div class="cr-box-tit ellipsis flex">标题后缀:</div>
        <div class="cr-box-max flex">
          <textarea type="text" v-model="siteFix" class="edit-textarea" min="0" max="80"></textarea>
        </div>
      </div>
      <div class="cr-item flex">
        <div class="cr-box-tit ellipsis flex">首页公告:</div>
        <div class="cr-box-max flex">
          <!-- <textarea type="text" v-model="siteAnnouncement" class="edit-textarea" min="0" max="80"></textarea> -->
          <vue-editor v-model="siteAnnouncement" :editorToolbar="customToolbar"></vue-editor>
        </div>
      </div>
      <div class="cr-item flex">
        <div class="cr-box-tit ellipsis flex">联系客服:</div>
        <div class="cr-box-min flex">
          <input type="text" v-model="sitFooter" class="edit-input" min="0" max="12">
        </div>
      </div>
      <div class="cr-item flex">
        <div class="cr-box-tit ellipsis flex">联系邮箱:</div>
        <div class="cr-box-min flex">
          <input type="text" v-model="sitFooterEmail" class="edit-input" min="0" max="20">
        </div>
      </div>
      <div class="cr-item flex">
        <div class="cr-box-tit ellipsis flex"></div>
        <div class="btn-box flex">
          <div class="mg-btn flex cursor" @click="_submit">确认修改</div>
          <div class="mg-btn flex cancle cursor" @click="_cancle">取消</div>
        </div>
      </div>
      <!--       <div class="btn-box flex">
        <div class="mg-btn flex cursor" @click="_submit">确认修改</div>
        <div class="mg-btn flex cancle cursor" @click="_cancle">取消</div>
      </div> -->
    </div>
  </div>
</template>
<script type="text/javascript">
import { setSiteinfo } from 'api/site'
import { mapGetters, mapMutations } from 'vuex'
import { testToken } from 'common/js/util'
import { SUCCESS_CODE } from 'api/config'
import CryptoJS from 'crypto-js'
import { VueEditor } from 'vue2-editor'

export default {
  data() {
    return {
      siteInfo: false,
      uploding: false,
      logoUrl: false,
      bgPath: null,
      siteName: "",
      siteFix: '',
      siteAnnouncement: '',
      sitFooter: '',
      sitFooterEmail: '',
      customToolbar: [
        [{ 'size': ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'strike'],
        // [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
        // [{ 'indent': '-1'}, { 'indent': '+1' }],
        // ['link', 'image'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'direction': 'rtl' }]
      ],
      Process: '点击上传Logo'
    }
  },
  created() {
    const that = this
    this._editInit()
    that.$root.eventHub.$on('updataEditInfo', (res) => {
      that._updataEditInfo(that)
    })
  },
  computed: {
    siteLogo() {
      if (this.logoUrl) {
        return `background: url(${this.logoUrl}) no-repeat;`
      } else {
        if (this.user.agency.sub_site && this.user.agency.sub_site.icon) {
          return `background: url(${this.user.agency.sub_site.icon}) no-repeat;`
        } else {
          return `background: url(${require('../../assets/logo.png')}) no-repeat;`
        }
      }
    },
    ...mapGetters([
      'user',
      'token',
      'tokenTime',
      'app'
    ])
  },
  components: {
    VueEditor
  },
  methods: {
    _editInit() {
      this.siteName = this.user.agency.sub_site.site_name
      this.siteFix = this.user.agency.sub_site.title_suffix
      this.siteAnnouncement = this.user.agency.sub_site.announcement
      this.sitFooter = this.user.agency.sub_site.contact
      this.sitFooterEmail = this.user.agency.sub_site.email
      this.logoUrl = this.user.agency.sub_site.icon || 'http://p8sxtcg6t.bkt.clouddn.com/defual.png'
    },
    _uplodeQiniu() {
      if (!this.$refs.fileInput.files[0]) {
        // this.$parent._open('请先上传文件')
        return false
      }
      console.log(this.$refs.fileInput.files[0])
      if (this.$refs.fileInput.files[0].type !== 'image/png' && this.$refs.fileInput.files[0].type !== 'image/jpeg') {
        this.$parent._open('文件格式不支持')
        return false
      }
      if (this.$refs.fileInput.files[0].size > 900000) {
        this.$parent._open('请上传小于900kb的图片')
        return false
      }
      this.uploding = true
      const that = this
      let name = this.$refs.fileInput.files[0].name
      let time = Date.parse(new Date()) / 1000 + 10800
      let blob = this.$refs.fileInput.files[0]
      let scopeName = time + name
      let config = {
        useCdnDomain: true,
        region: null
      }
      let putExtra = {
        fname: scopeName,
        params: {},
        mimeType: ["image/png", "image/jpeg"] || null
      }
      let putPolicy = {
        "scope": `pc-user-logo`,
        "deadline": time
      }
      let encodedPutPolicy = this.base64encode(this.utf16to8(JSON.stringify(putPolicy)))
      let hash = CryptoJS.HmacSHA1(encodedPutPolicy, "sXTfD5jT3qnnSMkQgZdo9Zyvxysh5EFCHk-Qmj0a")
      let sign = hash.toString(CryptoJS.enc.Base64)
      let observer = {
        next(res) {
          console.log(res)
          console.log(parseInt(res.total.percent))
          that.Process = res.total.percent
        },
        error(err) {
          console.log(err)
          that.uploding = false
          that.$parent._open('出错了:' + err.code)
          that.Process = '上传失败'
        },
        complete(res) {
          that.uploding = false
          console.log(res)
          if (res.key) {
            that.logoUrl = 'http://p8sxtcg6t.bkt.clouddn.com/' + res.key
            that.Process = '上传成功'
          }
        }
      }
      let uploadToken = 'wSsxSgwTV7Pv8KfA0ZZutipdT4w4WTL0RfhuBxzv' + ':' + this.safe64(sign) + ':' + encodedPutPolicy
      let observable = window.qiniu.upload(blob, name, uploadToken, putExtra, config)
      let subscription = observable.subscribe(observer)
    },
    _updataEditInfo() {
      this.$root.eventHub.$emit('user')
      this._editInit()
    },
    base64encode(str) {
      let base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"
      var out, i, len
      var c1, c2, c3
      len = str.length
      i = 0
      out = ""
      while (i < len) {
        c1 = str.charCodeAt(i++) & 0xff
        if (i == len) {
          out += base64EncodeChars.charAt(c1 >> 2)
          out += base64EncodeChars.charAt((c1 & 0x3) << 4)
          out += "=="
          break
        }
        c2 = str.charCodeAt(i++)
        if (i == len) {
          out += base64EncodeChars.charAt(c1 >> 2)
          out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4))
          out += base64EncodeChars.charAt((c2 & 0xF) << 2)
          out += "="
          break
        }
        c3 = str.charCodeAt(i++)
        out += base64EncodeChars.charAt(c1 >> 2)
        out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4))
        out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6))
        out += base64EncodeChars.charAt(c3 & 0x3F)
      }
      return out
    },
    utf16to8(str) {
      var out, i, len, c
      out = ""
      len = str.length
      for (i = 0; i < len; i++) {
        c = str.charCodeAt(i)
        if ((c >= 0x0001) && (c <= 0x007F)) {
          out += str.charAt(i)
        } else if (c > 0x07FF) {
          out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F))
          out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F))
          out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F))
        } else {
          out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F))
          out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F))
        }
      }
      return out
    },
    safe64(base64) {
      base64 = base64.replace(/\+/g, "-")
      base64 = base64.replace(/\//g, "_")
      return base64
    },
    _submit() {
      if (!this.$refs.fileInput.files[0] && !this.user.agency.sub_site.icon) {
        this.$parent._open('请先上传文件')
        return false
      }
      if (this.uploding) {
        this.$parent._open('图标正在上传，请稍候。')
        return false
      }
      if (!this.siteName) {
        this.$parent._open('请填写网站名称')
        return false
      }
      if (!this.sitFooter) {
        this.$parent._open('请填写尾页联系人')
        return false
      }
      if (!this.sitFooterEmail) {
        this.$parent._open('请填写尾页邮箱')
        return false
      }
      if (!this.checkTock()) {
        return false
      }
      setSiteinfo(this.token, this.logoUrl, this.siteName, this.siteFix, this.siteAnnouncement, this.sitFooter, this.sitFooterEmail).then((res) => {
        if (res.data.err_code === SUCCESS_CODE) {
          this.$root.eventHub.$emit('user')
          this.$parent._open('设置成功')
          this.$router.replace({
            path: '/management'
          })
        } else {
          if (res.data.err_msg) {
            this.$parent._open(this.$root.errorCode[res.data.err_code])
            this.$router.replace({
              path: '/management'
            })
          } else {
            this.$parent._open('似乎出错了')
            this.$router.replace({
              path: '/management'
            })
          }
        }
      })
    },
    _cancle() {
      this.$router.replace({
        path: '/management'
      })
    },
    checkTock() {
      if (!this.user) {
        this.$parent._open('请登录')
        this.$router.replace({
          path: '/login'
        })
        return false
      }
      if (!testToken(this.tokenTime)) {
        this.setUser(false)
        this.setToken(false)
        this.setTokenTime(false)
        this.$router.replace({
          path: '/login'
        })
        return false
      }
      return true
    },
    ...mapMutations({
      setToken: 'SET_TOKEN',
      setUser: 'SET_USER',
      setScorerate: 'SET_SCORERATE',
      setTokenTime: 'SET_TOKENTIME'
    })
  },
  beforeCreate: function() {
    document.getElementsByTagName("body")[0].className = "add_bg"
  }
}

</script>
<style scoped>
.quillWrapper {
  width: 100%;
}

.edit-logo {
  width: 25%;
  padding-top: 10%;
  background: #eee;
  margin: 40px auto 60px;
  position: relative;
  background-size: 100% 100% !important;
}

.zushi {
  position: absolute;
  bottom: 0;
  left: -40px;
  right: -40px;
  height: 50px;
  line-height: 50px;
  transform: translate(0, 100%);
  text-align: center;
  font-size: 14px;
  color: #ff9100;
}

.edit-box {
  width: 100%;
  min-height: 950px !important;
  height: auto;
  opacity: .95;
  padding-top: 85px;
  /* background: #eee;*/
}

.edit-content {
  width: 90%;
  max-width: 850px;
  min-height: 800px;
  height: auto;
  margin: 0 auto 40px;
  /*transform: translate(0 , 10%);*/
  background: #fff;
  overflow: hidden;
}

.cr-item {
  width: 100%;
  margin-top: 40px;
}

.cr-box-min {
  width: 60%;
  flex-grow: 1;
  height: 40px;
  margin: 0 10px;
  margin-right: 5%;
  border-radius: 5px;
  background: #f4f4f4;
  text-indent: 10px;
  justify-content: flex-start;
  overflow: hidden;
  border: 1px solid #eee;
  font-size: 14px;
}

.cr-box-btn {
  width: 100px;
  margin-right: 20px;
}

.cr-box-max {
  min-height: 100px;
  width: 60%;
  height: auto;
  margin: 0 10px;
  border-radius: 5px;
  background: #f4f4f4;
  /*  text-indent: 10px;*/
  justify-content: flex-start;
  flex-grow: 1;
  margin-right: 5%;
  align-items: flex-start;
  /*line-height: 40px;*/
  overflow: hidden;
  border: 1px solid #eee;
}

.cr-box-tit {
  width: 20%;
  max-width: 80px;
  height: 100%;
  margin: 0 3%;
  font-size: 1rem;
}

.file-input {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  opacity: 0;
  z-index: 1000;
  cursor: pointer;
}

.btn-box {
  width: 100%;
  height: 100px;
  justify-content: flex-start;
}

.mg-btn {
  height: 45px;
  min-width: 90px;
  border-radius: 5px;
  background: rgba(255, 210, 54, 1);
  color: #333;
  width: 33%;
  margin: 0 40px 40px 1%;
}

.cancle {
  background: #A6A6A6;
  color: #fff;
}

.jindu {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 30%;
  opacity: .2;
  background: #444;
  color: #fff;
  z-index: 1;
}

.edit-input {
  border: none;
  outline: none;
  background: #f4f4f4;
  width: 98%;
  height: 100%;
  margin: 0 1%;
  font-size: 14px;
}

.edit-textarea {
  border: none;
  outline: none;
  background: #f4f4f4;
  width: 98%;
  height: 98%;
  margin: 1%;
  font-family: '微软雅黑';
  color: #000;
  resize: none;
  font-size: 14px;
}

</style>
