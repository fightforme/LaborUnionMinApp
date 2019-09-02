// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  try{
   return db.collection('address').add({
     data:{
       receiver:event.userName,
       postalCode:event.postalCode,
       provinceName:event.provinceName,
       cityName:event.cityName,
       countyName:event.countyName,
       detailInfo: event.detailInfo,
       nationalCode: event.nationalCode,
       receiverTel: event.telNumber,
       name: event.name
     }
   }).then(res=>{
     console.log(res)
   })
  }catch(e){
    console(e);
  }
 

  
}