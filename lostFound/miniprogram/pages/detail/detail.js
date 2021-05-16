// miniprogram/pages/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    _id: null,
    pulisher: '',
    data: null,
    userInfo: null,
    ifmaster: false,
  },
 
  back(){
    wx.navigateBack()
  },
  sendMessage() {
    wx.navigateTo({
      url: '/pages/message/send?uid=' + this.data.pulisher,
    })
  },
  call() {
    wx.makePhoneCall({
      phoneNumber: this.data.data.concat.mobile
    })
  },
  copyWechat() {
    wx.setClipboardData({
      data: this.data.data.concat.wechat,
      success: () => {
        wx.showToast({
          title: '复制微信号成功',
        })
      }
    })
  },
  /**
 * 删除信息
  */
  async remove() {
    const db = wx.cloud.database()
    const res = await db.collection('list').doc(this.data._id).remove({
    })
    wx.hideLoading()
    if (res) {
      console.log(res)
      wx.showToast({
        title: '删除成功！',
      })
      setTimeout(function(){
        wx.switchTab({
          url: '/pages/index/index',
        })
      },2000)
      return
    } else {
      return wx.showToast({
        title: '删除失败了！',
        icon: 'none'
      })
    }
  },
  delm() {
    wx.showModal({
      title: '删除提示',
      content: '您确定要删除该数据嘛？',
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  
  showPic(e) {
    const index = e.currentTarget.dataset.index
    wx.previewImage({
      current: this.data.data.imgs[index],
      urls: this.data.data.imgs,
    })
  },

  async _loadData(_id) {
    wx.showLoading({
      title: '正在快马加编中..',
    })
    if (!_id) {
      _id = this.data._id
    }
    const db = wx.cloud.database()
    let res = null
    try {
      res = await db.collection('list').doc(_id).get()
    } catch (err) {
      console.log(err)
      wx.hideLoading()
      wx.showToast({
        title: '信息加载失败',
        icon: 'none'
      })
      wx.navigateBack()
    }
    console.log(res);
    wx.hideLoading()
    if (res) {
      res.data.date = (new Date(res.data.date)).getTime()
      this.setData({
        data: res.data,
        pulisher: res.data._openid
      })
    }
const resa = await db.collection('users').get()
if (resa.data[0]._id = "cbddf0af608ed8eb0593df625d9a113c") {
  this.setData({
  ifmaster : true,
  })
    }
        else{
      this.setData({
        ifmaster : false,
        })
      } 
    console.log(resa.data[0]._idr)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const _id = options.id.trim()
    console.log(_id);
    this.setData({
      _id
    })
    this._loadData(_id)
    const db = wx.cloud.database()

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