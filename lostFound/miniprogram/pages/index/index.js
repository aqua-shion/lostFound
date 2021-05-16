//index.js
//获取应用实例
const app = getApp()
const MAX_LIMIT = 3;
Page({
  data: {
    //tabbar
    tabbar: {},
    lost: [],
    found: []
  },
  async _loadList() {
    wx.showLoading({
      title: '玩命加载中...',
    })
    const db = wx.cloud.database()
    const lost = await db.collection('list')

      .where({
        type: 'lost'
      })
      .limit(MAX_LIMIT)
      .orderBy('date', 'desc')
      .get()
    for (let o in lost.data) {
      lost.data[o].date = lost.data[o].date.getTime()
    }
    const found = await db.collection('list')
      .where({
        type: 'found'
      })
      .limit(MAX_LIMIT)
      .orderBy('date', 'desc')
      .get()
    for (let o in found.data) {
      found.data[o].date = found.data[o].date.getTime()
    }
    this.setData({
      lost: lost.data,
      found: found.data
    })
    wx.hideLoading()
    wx.stopPullDownRefresh()
  },
  onShow: function () {
    app.editTabbar()
    this._loadList()
  },
  onLoad: function () {},
  onPullDownRefresh(){
    this._loadList()
  },
})