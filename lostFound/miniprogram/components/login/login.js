// components/login/login.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    modalShow: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onGotUserInfo(event) {
      wx.getUserProfile({
        desc: '用于完善会员资料',
        success: res => {
          // resolve(res.userInfo)
          this.setData({
            modalShow: false
          })
          wx.setStorageSync('userinfo', res.userInfo)
          this.triggerEvent('loginsuccess', res.userInfo)
        },
        fail: err => {
          console.log(err)
          wx.showToast({
            title: '获取个人信息失败，请重启小程序再试',
            icon: 'loading'
          })
          reject(err)
        }
      })
      // console.log(event)
      // const userInfo = event.detail.userInfo
      // // 允许授权
      // if (userInfo) {
      //   this.setData({
      //     modalShow: false
      //   })
      //   wx.setStorageSync('userinfo', userInfo)
      //   this.triggerEvent('loginsuccess', userInfo)
      // } else {
      //   this.triggerEvent('loginfail')
      // }
    }
  }
})