// miniprogram/pages/profile/profile.js
const CONFIG = require('../../config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mobile: '',
    wechat: ''
  },
  save() {
    console.log('save');
    console.log(CONFIG);
    if (!this._validatePhoneNumber(this.data.mobile)) {
      return wx.showToast({
        title: '手机号格式错误',
        icon: 'none'
      })
    }
    if (this.data.wechat.trim().length === 0) {
      return wx.showToast({
        title: '请输入微信号',
        icon: 'none'
      })
    }

    wx.showLoading({
      title: '正在保存...',
    })
    wx.cloud.callFunction({
      name: "user",
      data: {
        $url: 'updateMobieAndWechat',
        mobile: this.data.mobile,
        wechat: this.data.wechat
      }
    }).then(res => {
      console.log(res);
      let tips = ''
      if (res.result.updated === 0) {
        tips = '保存失败！'
      } else if (res.result.updated === 1) {
        tips = '保存成功'
      }
      wx.hideLoading()
      wx.showToast({
        title: tips,
        duration: 1500,
        success: function () {
          wx.navigateBack()
        }
      })

    })

  },
  _validatePhoneNumber(str) {
    const reg = /^[1][3|4|5|6|7|8|9][0-9]{9}$/
    return reg.test(str)
  },
  handleMobieInput: function (e) {
    this.setData({
      mobile: e.detail.value
    })
  },
  handleWechatInput: function (e) {
    this.setData({
      wechat: e.detail.value
    })
  },
  async _loadData() {
    wx.showLoading({
      title: '加载中...',
    })
    wx.cloud.init({
      env: CONFIG.ENV
    })
    const db = wx.cloud.database()
    const res = await db.collection('users').get()
    console.log("22222222222",res);
    if (res.data.length > 0) {
      wx.hideLoading()
      this.setData({
        mobile: res.data[0].mobile ? res.data[0].mobile : '',
        wechat: res.data[0].wechat ? res.data[0].wechat : ''
      })
    } else {
      wx.showToast({
        title: '未登录！',
        icon: 'none'
      })
      setTimeout(function(){
        wx.switchTab({
          url: '/pages/mine/mine',
        })
      },1000)
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._loadData()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})