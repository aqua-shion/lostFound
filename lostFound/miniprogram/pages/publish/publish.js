// miniprogram/pages/publish/publish.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    concats: [{
      name: '手机号',
      value: 'mobile',
      checked: 'true'
    }, {
      name: '微信',
      value: 'wechat',
      checked: 'true'
    }, {
      name: '站内信',
      value: 'message',
      checked: true,
      disable: true
    }, ],
    rawDate: '',
    showDate: {},
    tmpImgs: [],
    person: null,
    info: {
      title: '',
      date: '',
      desc: '',
      place: '',
      imgs: [],
      concat: {}, // 联系方式
      type: ''
    }
  },
  async save() {
    if (!this.data.info.title) {
      return wx.showToast({
        title: '请输入物品名称',
        icon: 'none'
      })
    }
    if (!this.data.info.place) {
      return wx.showToast({
        title: '请输入地点',
        icon: 'none'
      })
    }
    if (this.data.tmpImgs.length === 0) {
      return wx.showToast({
        title: '必须有一张图片',
        icon: 'none'
      })
    } else {
      wx.showLoading({
        title: '正在上传图片',
      })
      let list = []
      for (let i = 0, len = this.data.tmpImgs.length; i < len; i++) {
        let item = this.data.tmpImgs[i]
        const filenameArr = item.split('/')
        const filename = filenameArr[filenameArr.length - 1]
        let res = null
        try {
          res = await wx.cloud.uploadFile({
            cloudPath: 'lostAndFound/uploads/' + (new Date()).getFullYear() + '/' + filename,
            filePath: item, // 文件路径
          })
        } catch (err) {
          wx.hideLoading()
          wx.showToast({
            title: '图片上传失败',
            icon: 'none'
          })
          console.log(err)
          return
        }
        if (res.statusCode === 204) {
          list.push(res.fileID)
        } else {
          wx.hideLoading()
          return wx.showToast({
            title: '图片上传失败',
            icon: 'none'
          })
        }
      }
      this.setData({
        'info.imgs': list
      })
      wx.hideLoading()
    }

    wx.showLoading({
      title: '正在保存...',
    })
    const db = wx.cloud.database()
    const res = await db.collection('list').add({
      data: this.data.info
    })
    wx.hideLoading()
    if (res) {
      console.log(res)
      wx.showToast({
        title: '保存成功',
      })
      wx.switchTab({
        url: '/pages/index/index',
      })
      return
    } else {
      return wx.showToast({
        title: '保存失败...',
        icon: 'none'
      })
    }
  },
  checkboxChange: function (e) {
    const value = e.detail.value
    const concat = {}
    if (value.indexOf('wechat') !== -1) {
      concat.wechat = this.data.person.wechat
    }
    if (value.indexOf('mobile') !== -1) {
      concat.mobile = this.data.person.mobile
    }
    this.setData({
      'info.concat': concat
    })
  },
  handelInput(e) {
    const id = e.currentTarget.id
    const value = e.detail.value
    const obj = {}
    obj['info.' + id] = value
    this.setData(obj)
  },
  delPic(e) {
    const index = e.currentTarget.dataset.index
    const list = [...this.data.tmpImgs]
    list.splice(index, 1)
    this.setData({
      tmpImgs: list
    })
  },
  selcetPics() {
    console.log(3 - this.data.tmpImgs.length);

    if (this.data.tmpImgs.length < 3) {
      wx.chooseImage({
        count: 3 - this.data.tmpImgs.length,
        success: (res) => {
          console.log(res)
          if (res.tempFilePaths.length > 0) {
            this.setData({
              tmpImgs: [...this.data.tmpImgs, ...res.tempFilePaths]
            })
          }
        },
      })
    }
  },
  bindDateChange(e) {
    this._setDate(e.detail.value)
  },
  _setDate(rawDate) {
    // rawDate 是任意可以转换为Date对象的数据
    const date = new Date(rawDate)
    const showDate = {
      y: this._toTwo(date.getFullYear()),
      m: this._toTwo(date.getMonth() + 1),
      d: this._toTwo(date.getDate())
    }
    this.setData({
      showDate,
      rawDate,
      'info.date': date
    })
  },
  _toTwo(value) {
    return (value + '').length < 2 ? '0' + value : value + ''
  },
  async _loadPersonalInfo() {
    const db = wx.cloud.database();
    let user;
    try {
      user = await db.collection('users').get()
    } catch (err) {
      wx.showToast({
        title: '加载个人信息失败，请重启小程序',
        icon: 'none'
      })
      wx.navigateBack()
    }

    console.log(user)
    if (user.data.length > 0) {
      const userInfo = user.data[0]
      if (!userInfo.mobile || !userInfo.wechat) {
        wx.showToast({
          title: '还没有完善个人信息，请先完善个人信息',
          icon: 'none'
        })
        wx.redirectTo({
          url: '/pages/profile/profile',
        })
      }
      this.setData({
        person: userInfo,
        'info.concat': {
          mobile: userInfo.mobile,
          wechat: userInfo.wechat
        }
      })
    } else {
      wx.showToast({
        title: '登录后才可以使用发布功能哦~',
        icon: 'none'
      })
      wx.navigateBack()
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this._loadPersonalInfo()

    this.setData({
      'info.type': options.type
    })
    this._setDate((new Date).getTime())
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