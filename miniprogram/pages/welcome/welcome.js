// miniprogram/pages/welcome.j
const updateManager = wx.getUpdateManager();
const db = wx.cloud.database();
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    usrInfo:{
      isCY58: '1'
    },
    item:{
      
    },
    birthDay:{
      birthDay: '请输入您的生日，非必填',
      tager: '长银五八精英'
    },

    userOpenId: '',
    userName: '',
    nickName: '',
    gender: '',
    dbAccount: '',
    telNo: '',
    permiss:'',
    addTime:''
  },
 
  
  toMainPage : function(){
    wx.switchTab({
      url: '../../pages/main/main',
      success(res){
        console.log(res)
      }
    })
  },

 //点击问号的提示
  onClickIcon:function(){
    wx.showToast({
      title: '请输入您的生日，生日当天工会将送出精美礼物，非必填',
      icon: 'none',
      duration: 6000
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let openId  
    wx.cloud.callFunction({
      name: "login"
    }).then(res => {
      console.log(res);
      this.setData({
        userOpenId: res.result.openid,
        openId: res.result.openid
    });
    })
    db.collection("user").where({
      userOpenId: openId
    }).get().then(res=>{
      if (res.data.length>0){
        this.setData({
          usrInfo: {
            isCY58: res.data[0].isCY58,
          },
          birthDay:{
            birthDay:res.data[0].birthDay,
            tager:res.data[0].tager
          }
        })
        app.globalData.userInfo = res.data[0];
        console.log(app.globalData.userInfo)
        if (app.globalData.userInfo.isCY58 == 1)
        setTimeout(function () {
          wx.switchTab({
            url: '../../pages/main/main',
          })
        },
          3000)
      }else{
        this.setData({
          usrInfo: {
            isCY58: '0',
            tager: '游客'
          }
        })
      }
      
    })
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })

    wx.cloud.callFunction({
      name: "getParam"
    }).then(res => {
      app.globalData.param = res.result.data[0];
    })
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  //获取用户姓名
  onNameChange: function (event) {
    this.setData({
      userName: event.detail
    });
  },

  //获取用户多宝号
  onDbAccountChange: function (event) {
    console.log(event.detail)
    this.setData({
      dbAccount: event.detail
    });
  },

  //获取用户手机号
  onTelChange: function (event) {
    console.log(event.detail)
    this.setData({
      telNo: event.detail
    });
  },

  //获取用户的信息
  onGotUserInfo: function (event) {
    var isCY58='';
    if (app.globalData.param.IS_REGIST){
      isCY58 = '1'
    }else(
      isCY58 = '0'
    )
    wx.showLoading({
      title: '提交中',
    })
    if ('' == this.data.username) {
      wx.hideLoading();
      wx.showToast({
        title: '请输入您的姓名',
        icon: 'none',
      })
    } 
    if ('' == this.data.dbAccount) {
      wx.hideLoading();
      wx.showToast({
        title: '请输入您的多宝号',
        icon: 'none',
      })
    } 
    if ('' == this.data.telNo) {
      wx.hideLoading();
      wx.showToast({
        title: '请输入您的手机号',
        icon: 'none',
      })
    }
    if ('' != this.data.telNo && '' != this.data.dbAccount && '' != this.data.username) {
      console.log(event.detail.userInfo);
      db.collection("user").where({
        userOpenId: this.data.userOpenId
      }).get().then(res => {
        console.log(res);
        if (res.data.length > 0) {
          //客户如果有变更了昵称或性别等信息
          
          db.collection("user").doc(res.data[0]._id).update({
            data: {
              nickName: event.detail.userInfo.nickName,
              gender: event.detail.userInfo.gender,
              tager: this.data.usrInfo.tager,
              userName: this.data.userName,
              dbAccount: this.data.dbAccount,
              isCY58: isCY58,
              telNo:this.data.telNo,
              userOpenId:this.data.userOpenId,
              birthDay:this.data.birthDay.birthDay,
              permiss:'2',
              addTime: new Date()
            }
          }).then(res => {
            db.collection('user').get().then(res => {
              console.log(res)
              app.globalData.userInfo = res.data[0],
                console.log(app.globalData.userInfo)
            })
            wx.hideLoading();
            wx.showToast({
              title: '恭喜您加入成功',
              icon: 'none',
            })
          }).catch(err => {
            console.log(err)
            wx.hideLoading();
            wx.showToast({
              title: '加入失败，请联系管理员@鸿TEL',
              icon: 'none',
            })
          });
        } else {
          let gen 
          if ('1'==event.detail.userInfo.gender){
            gen = '男'
          }else{
            gen='女'
          }
          
          db.collection("user").add({
            data: {
              nickName: event.detail.userInfo.nickName,
              gender: gen,
              tager: '长银五八精英',
              userName: this.data.userName,
              dbAccount: this.data.dbAccount,
              isCY58: isCY58,
              telNo: this.data.telNo,
              userOpenId: this.data.userOpenId,
              birthDay: this.data.birthDay.birthDay,
              permiss:'2',
              addTime: new Date()
            }
          }).then(res => {
            db.collection('user').get().then(res => {
              console.log(res)
              app.globalData.userInfo = res.data[0],
                console.log(app.globalData.userInfo)
            })
            console.log(res)
            this.setData({
              nickName: event.detail.userInfo.nickName,
              gender: event.detail.userInfo.gender,
            })
            wx.hideLoading();
            wx.showToast({
              title: '欢迎您加入长银五八工会',
              icon: 'none',
              
            })
            
          }).catch(err => {
            console.log(err)
            wx.hideLoading();
            wx.showToast({
              title: '加入失败，请联系管理员@鸿',
              icon: 'none',
            })
          })
        }
      }).catch(err => {
        console.log(err);
      })

   
      if (app.globalData.param.IS_REGIST){
      setTimeout(function () {
        wx.switchTab({
          url: '../../pages/main/main',
        })
      },
      1000)}else{
        wx.showToast({
          title: '已暂停注册，加入失败，请联系管理员@鸿',
          icon: 'none',
        })
      }
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  //生日选择
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      birthDay:{
        birthDay: e.detail.value,
        tager: '长银五八精英'
      } 
    })
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