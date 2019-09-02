// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: "dev-public-13d6j" })

const db = cloud.database({ env: "dev-public-13d6j" })

// 云函数入口函数
exports.main = async(event, context) => {
 return await db.collection("SYSTEM_PARAM").get().then(res => {
    console.log(res)
    if(res.data.length==0){
            db.collection("SYSTEM_PARAM").add({
              data:{
                LIMIT_NUM:event.limitNum,
                IS_REGIST:event.isRegist
              }
            }).then(res=>{
              console.log(res)
            }).catch(err=>{
              console.log(err)
            })
    }else{
      db.collection("SYSTEM_PARAM").doc(res.data[0]._id).update({
        data:{
          LIMIT_NUM: event.limitNum,
          IS_REGIST: event.isRegist
        }
      }).then(res => {
        console.log(res)
      }).catch(err => {
        console.log(err)
      })
    }
  }).catch(err => {
    console.log(err)
  })
}