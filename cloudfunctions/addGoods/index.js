// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

const _ = db.command

// 云函数入口函数
exports.main = async(event, context) => {
  try {
   return await db.collection("GOODS_INFO").add({
      data: {
        GOODS_NAME: event.goodsName,
        GOODS_DESC: event.goodsDesc,
        TAGER1: event.tager1,
        TAGER2: event.tager2,
        NUM: event.num,
        MIN_NUM: event.minNum,
        REMARK: event.remark,
        FESTIVAL: event.festival,
        DATE: event.date,
        IS_SELECT: event.isSelect,
        FILEIDS: event.fileIds,
        VERSION: _.inc(1)
      }
    })
  }catch(e){
    console.log(e)
  }
}