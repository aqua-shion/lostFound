// miniprogram/pages/message/send.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uid: '',
    content: ''
  },
  handleInput(e) {
    this.setData({
      content: e.detail.value
    })
  },
  async save() {
    console.log('save')
    if (!this.data.content) {
      return wx.showToast({
        title: '请输入内容',
        icon: 'none'
      })
    }
    wx.showLoading({
      title: '正在发送电磁波...',
    })
    const userInfo = wx.getStorageSync('userinfo')
    const res = await wx.cloud.callFunction({
      name: 'message',
      data: {
        $url: 'sendMessage',
        content: this.data.content,
        to: this.data.uid,
        nickName: userInfo.nickName,
        avatarUrl: userInfo.avatarUrl
      }
    })
    if(res.result.code === 200){
      wx.showToast({
        title: '发送成功',
      })
      wx.navigateBack()
    }
    wx.hideLoading()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    const uid = options.uid
    this.setData({
      uid
    })
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