// pages/mine/mine.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //tabbar
    tabbar: {},
    userInfo: null,
    modalShow: false,
    messageCount: 0
  },
  toMessageList(){
    console.log('bbb');
    
    wx.navigateTo({
      url: '/pages/message/list',
    })
  },
  _loadMessageCount() {
    wx.cloud.callFunction({
      name: 'message',
      data: {
        $url: 'getMessageCount'
      }
    }).then(res => {
      console.log(res)
      if (res.result) {
        this.setData({
          messageCount: res.result.count
        })
      }
    })
  },
  login() {
    app.login((userInfo) => {
      console.log('success Userinfo', userInfo)
      this.setData({
        userInfo
      })
      this._loadMessageCount()
    }, () => {
      this.setData({
        modalShow: true
      })
    })
  },

  onLoginSuccess(event) {
    console.log(event)
    app.login((userInfo) => {
      console.log('success Userinfo', userInfo)
      this.setData({
        userInfo
      })
    })
    this._loadMessageCount()
  },
  onLoginFail() {
    wx.showModal({
      title: '授权用户才能发布',
      content: '',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.editTabbar();
    const userInfo = wx.getStorageSync('userinfo')
    if (userInfo) {
      this.setData({
        userInfo
      })
      this._loadMessageCount()
    }
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
    wx.setBackgroundColor({
      backgroundColor: '#000', // 窗口的背景色为白色
    })
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