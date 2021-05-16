// miniprogram/pages/message/list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: []
  },
  async toMessageDetail(e) {
    console.log(e);
    if(!e.currentTarget.dataset.read){
      wx.showLoading({
        title: '加载中...',
      })
      wx.cloud.callFunction({
        name: 'message',
        data: {
          $url: 'read',
          _id: e.currentTarget.id
        },
        success: (res) => {
          console.log('更新成功', res)
          wx.hideLoading()
        }
      })
    }

    wx.navigateTo({
      url: './send?uid=' + e.currentTarget.dataset.uid,
    })
  },
  async _loadData() {
    wx.showLoading({
      title: '正在加载',
    })
    const res = await wx.cloud.callFunction({
      name: 'message',
      data: {
        $url: 'getMessageList',
        skip: this.data.list.length
      }
    })
    this.setData({
      list: res.result.data
    })
    wx.hideLoading()
    wx.stopPullDownRefresh()
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
    this.setData({
      list: []
    })
    this._loadData()
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