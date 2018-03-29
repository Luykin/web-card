export const normalMixin = {
  methods: {
    _verifyPhone(phone) {
      if (!phone) {
        this.$message({
          showClose: true,
          message: '请填手机号哦',
          type: 'warning'
        })
        return false
      }
      let myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}|(19[0-9]{1})))+\d{8})$/
      if (!myreg.test(phone)) {
        this.$message({
          showClose: true,
          message: '请正确填写手机号哦',
          type: 'warning'
        })
        return false
      }
      return true
    },
    _verifyPassword(password) {
      if (!password) {
        this.$message({
          showClose: true,
          message: '请填写密码哦',
          type: 'warning'
        })
        return false
      }
      if (password.length < 6) {
        this.$message({
          showClose: true,
          message: '密码必须大于等于6位',
          type: 'warning'
        })
        return false
      }
      return true
    },
    _verifyRePassword(password, rePassword) {
      if (password !== rePassword) {
        this.$message({
          showClose: true,
          message: '两次密码不一致',
          type: 'warning'
        })
        return false
      }
      return true
    },
    _verifyCode(code) {
      if (!code) {
        this.$message({
          showClose: true,
          message: '请填写验证码',
          type: 'warning'
        })
        return false
      }
      return true
    }
  }
}
