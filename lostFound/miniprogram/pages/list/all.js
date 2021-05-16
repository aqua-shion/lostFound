const CONFIG = require('../../config.js')
const MAX_LIMIT = 10
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: '',
    mine: 'no',
    list: []
  },

  async _loadData() {
    wx.showLoading({
      title: '加载中',
    })
    const db = wx.cloud.database()
    let res = null
    if (this.data.mine === 'no') {
      try {
        res = await db.collection('list').where({
            type: this.data.type
          })
          .skip(this.data.list.length)
          .limit(MAX_LIMIT)
          .orderBy('date', 'desc')
          .get()
      } catch (err) {
        wx.hideLoading()
        console.log(err)
      }
    } else if (this.data.mine === 'yes') {
      const r = await wx.cloud.callFunction({
        name: 'list',
        data: {
          $url: 'getMyList',
          type: this.data.type,
          skip: this.data.list.length,
          limit: MAX_LIMIT
        }
      })
      res = r.result
    }
    console.log(res)
    for (let o in res.data) {
      res.data[o].date = (new Date(res.data[o].date)).getTime()
    }
    this.setData({
      list: [...this.data.list, ...res.data]
    })
    wx.stopPullDownRefresh()
    wx.hideLoading()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const type = options.type
    const mine = options.mine ? options.mine : 'no'
    this.setData({
      type,
      mine
    })
    this._loadData()
    if (type === 'lost')
      wx.setNavigationBarTitle({
        title: '寻物启事',
      })
    else
      wx.setNavigationBarTitle({
        title: '失物招领',
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
    this.setData({
      list: []
    })
    this._loadData()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this._loadData()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})