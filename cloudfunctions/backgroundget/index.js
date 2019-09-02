// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
     console.log(event,context)
    try{
        db.collection("background").where({
        data: {
          _openid: 'oOsOf4usgYl7-S9s_RmHHd6We9QY',
        }
      }).get().then(res=>{
        console.log('res:'+res.data[0]);
        return res;
      });
    }catch(e){
      console.error(e)
    }
}