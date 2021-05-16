//app.js
const CONFIG = require('config.js')
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: CONFIG.ENV,
        traceUser: true,
      })
    }
    //隐藏系统tabbar
    wx.hideTabBar();
    //获取设备信息
    this.getSystemInfo();
  },
  onShow: function () {
    //隐藏系统tabbar
    wx.hideTabBar();
  },
  getSystemInfo: function () {
    let t = this;
    wx.getSystemInfo({
      success: function (res) {
        t.globalData.systemInfo = res;
      }
    });
  },
  editTabbar: function () {
    let tabbar = this.globalData.tabBar;
    let currentPages = getCurrentPages();
    let _this = currentPages[currentPages.length - 1];
    let pagePath = _this.route;
    (pagePath.indexOf('/') != 0) && (pagePath = '/' + pagePath);
    for (let i in tabbar.list) {
      tabbar.list[i].selected = false;
      (tabbar.list[i].pagePath == pagePath) && (tabbar.list[i].selected = true);
    }
    _this.setData({
      tabbar: tabbar
    });
  },
  async login(successCallBack, noAuthCallBack) {
    let userInfo = wx.getStorageSync('userinfo')

    const plogin = new Promise((resolve, reject) => {
      wx.getSetting({
        success: res => {
          console.log(res);
          if (res.errMsg['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            wx.getUserProfile({
              desc: '用于完善会员资料',
              success: res => {
                resolve(res.userInfo)
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
          } else {
            reject('还未授权')
          }
        }
      })
    })

    if (!userInfo) {
      try {
        userInfo = await plogin
      } catch (e) {
        console.log(e)
        noAuthCallBack && noAuthCallBack()
        return
      }
    }
    if (userInfo) {
      wx.cloud.callFunction({
        name: 'user',
        data: {
          $url: 'login',
          userInfo
        },
        success: res => {
          console.log('[云函数] [user] : ', res)
          successCallBack && successCallBack(userInfo)
        },
        fail: err => {
          console.error('[云函数] [login] 调用失败', err)
          wx.showToast({
            title: '登陆失败，请检查微信版本是否为最新',
            icon: 'loading'
          })
        }
      })
      wx.setStorageSync('userinfo', userInfo)
      return userInfo
    }
  },
  globalData: {
    systemInfo: null, //客户端设备信息
    a1: null,
    tabBar: {
      "backgroundColor": "#ffffff",
      "color": "#979795",
      "selectedColor": "#1c1c1b",
      "list": [{
          "pagePath": "/pages/index/index",
          "iconPath": "icon/icon_home.png",
          "selectedIconPath": "icon/icon_home_HL.png",
          "text": "首页"
        },
        {
          "pagePath": "/pages/middle/middle",
          "iconPath": "icon/icon_release.png",
          "isSpecial": true,
          "text": "发布"
        },
        {
          "pagePath": "/pages/mine/mine",
          "iconPath": "icon/icon_mine.png",
          "selectedIconPath": "icon/icon_mine_HL.png",
          "text": "我的"
        }
      ]
    }
  }
})