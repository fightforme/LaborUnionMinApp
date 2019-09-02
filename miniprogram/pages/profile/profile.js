// pages/profile/profile.js
const db = wx.cloud.database();
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
       openid : '',
       nickName : '',
       gender:'', 
       tager: '长银五八精英',
       isCY58:'3',
       dbAccount: "",
       name:"",
       userInfo:''

  },

  onNameChange: function (event) {
    this.setData({
      name: event.detail
    });
  },

  onDbAccountChange: function (event) {
    this.setData({
      dbAccount: event.detail
    });
  },


  onGotUserInfo: function (event) {
    wx.showLoading({
      title: '提交中',
    })
    if ('' == this.data.name) {
      wx.hideLoading();
      wx.showToast({
        title: '请输入您的姓名',
        icon: 'none',
      })
    } else if ('' == this.data.dbAccount) {
      wx.hideLoading();
      wx.showToast({
        title: '请输入您的多宝号',
        icon: 'none',
      })
    }else{
    console.log(event.detail.userInfo);
    db.collection("user").where({
       _openid : this.data.openid
    }).get().then(res=>{
        console.log(res);
        if(res.data.length > 0 ){
           this.setDate({
             nickName : event.detail.userInfo.nickName,
             gender : event.detail.userInfo.gender
           });
          db.collection("user").doc(res.data[0]._id).update({
             data:{
                nickName: this.data.nickName,
                gender:this.data.gender,
                tager:this.data.tager,
               // name:this.data.name,
                dbAccount:this.data.dbAccount
             }
          }).then(res=>{
            wx.hideLoading();
            wx.showToast({
              title: '恭喜您加入成功',
              icon: 'none',
            })
          }).catch(err=>{
            wx.hideLoading();
            wx.showToast({
              title: '加入失败，请联系管理员@鸿TEL',
              icon: 'none',
            })
          });
        }else{
          db.collection("user").add({
            data:{
              nickName: event.detail.userInfo.nickName,
              gender: event.detail.userInfo.gender,
              tager: "长银五八精英",
              name: this.data.name,
              dbAccount: this.data.dbAccount
            }
          }).then(res=>{
            wx.hideLoading();
            wx.showToast({
              title: '恭喜您加入成功',
              icon: 'none',
            })
            this.onLoad()
          }).catch(err=>{
            wx.hideLoading();
            wx.showToast({
              title: '加入失败，请联系管理员@鸿',
              icon: 'none',
            })
          })
        }
    }).catch(err=>{
        console.log(err);
    })
    }
   },

  getAddress:function(event){
    var that = this
    wx.navigateTo({
      url: '../address/address?addressScence=10',
    })
  },

  toManager: function (event){
      wx.navigateTo({
        url: '/pages/manager/manager',

      })
  },

  getBackground : function (){
    wx.navigateTo({
      url: '../order/order?scence=3',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      // wx.cloud.callFunction({
      //    name:"login"   
      // }).then(res=>{
      //   console.log(res);
      //   this.setData({
      //     openid : res.result.openid,
          
      //   });
      //   db.collection('user').where({
      //     _openid : this.data.openid
      //   }).get().then(res=>{
      //     console.log(res);
      //     if(res.data.length>0){
      //       this.setData({
      //         isCY58:'1',
      //         tager:res.data[0].tager,
      //        // name:res.data[0].name
      //       })
      //     }else{
      //       this.setData({
      //         isCY58: '0',
      //         tager:'游客'
      //       })
      //     }
      //   }).catch(err=>{
      //     console.log(res);
      //   })
         
      // }).catch(err=>{
      //    console.log(err);
      // })
    console.log(app.globalData)
      this.setData({

      userInfo : app.globalData.userInfo
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
       this.onLoad();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
     console.log("---")
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})