// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return db.collection('address').where({
      data: {
        _openid:event._openid
      }
    }).get().then(res => {
      console.log(res)
    })
  } catch (e) {
    console(e);
  }
}