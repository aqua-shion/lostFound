// 云函数入口文件
const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router')
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({
    event
  })
  const type = event.type
  const wxContext = cloud.getWXContext()
  app.router('getMyList', async (ctx, next) => {
    const whereObj = {
      _openid: wxContext.OPENID
    }
    if (type === 'lost') {
      whereObj['type'] = 'lost'
    } else {
      whereObj['type'] = 'found'
    }

    let result = null
    try {
      result = await db.collection('list')
        .where(whereObj)
        .skip(event.skip ? event.skip : 0)
        .limit(event.limit ? event.limit : 10)
        .get()
      ctx.body = {
        code: 200,
        data: result.data
      }
    } catch (err) {
      console.log(err);
    }
  })

  return app.serve()
}