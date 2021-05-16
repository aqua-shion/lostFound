// 云函数入口文件
const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router')

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database({
    env: cloud.DYNAMIC_CURRENT_ENV
  })
  const messagesCollection = db.collection('messages')
  const app = new TcbRouter({
    event
  })
  const wxContext = cloud.getWXContext()

  app.router('getMessageCount', async (ctx, next) => {
    const count = await messagesCollection.where({
      to: wxContext.OPENID,
      read: false
    }).count()
    console.log(count)
    ctx.body = {
      count: count.total,
      message: 'success'
    }
  })

  app.router('getMessageList', async (ctx, next) => {
    const skip = event.skip
    const res = await messagesCollection.where({
        to: wxContext.OPENID
      })
      .orderBy('create_time', 'desc')
      .skip(skip)
      .get()
    ctx.body = {
      data: res.data,
      message: 'success'
    }
  })

  app.router('sendMessage', async (ctx, next) => {
    const res = await messagesCollection.add({
      data: {
        from: wxContext.OPENID,
        to: event.to,
        content: event.content,
        nickName: event.nickName,
        avatarUrl: event.avatarUrl,
        read: false,
        create_time: db.serverDate(),
      }
    })
    ctx.body = {
      code: 200,
      message: 'success'
    }
  })

  app.router('read', async (ctx, next) => {
    const res = await messagesCollection.where({
        to: wxContext.OPENID,
        _id: event._id
      })
      .update({
        data: {
          read: true
        }
      })
    ctx.body = {
      data: res,
      message: 'success'
    }
  })

  return app.serve()
}