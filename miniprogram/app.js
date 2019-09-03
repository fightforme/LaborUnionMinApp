//app.js
App({
  globalData:{
    userInfo:'',
    param:''
  },
  onLaunch: function (event) {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
       
        traceUser: true,
        withShareTicket: true
      })
    }
  }
})
