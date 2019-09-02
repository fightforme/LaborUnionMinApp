// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: "dev-public-13d6j" })

const db = cloud.database({ env: "dev-public-13d6j" })
// 云函数入口函数
exports.main = async (event, context) => {
  var goodsId = event.goodsId;
  console.log(goodsId)
  try{

  return await  db.collection("GOODS_INFO").doc(goodsId).remove()
  }catch(e){console.error(e)}
}