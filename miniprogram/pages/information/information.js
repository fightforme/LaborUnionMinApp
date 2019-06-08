// pages/information/information.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    dbAccount: "",
    tel: '',
    address: '',
    image: ['../../images/head.jpg'], // 上传的图片
    images: [],
    fileIds: [],
    isCY58:'0',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  onNameChange: function(event) {
    this.setData({
      name: event.detail
    });
  },
  onAddressChange: function(event) {
    this.setData({
      address: event.detail
    });
  },
  onDbAccountChange: function(event) {
    this.setData({
      dbAccount: event.detail
    });
  },
  submit: function() {
    wx.showLoading({
      title: '提交中',
    })
    console.log(this.data.name)
    if ('' == this.data.name){
      wx.hideLoading();
      wx.showToast({
        title: '请输入姓名',
        icon:'none',
      })
    } else if ('' == this.data.dbAccount){
      wx.hideLoading();
      wx.showToast({
        title: '请输入多宝账号',
        icon: 'none',
      })
    } else if ('' == this.data.tel) {
      wx.hideLoading();
      wx.showToast({
        title: '请输入手机号码',
        icon: 'none',
      })
    }
    else if ('' == this.data.address) {
      wx.hideLoading();
      wx.showToast({
        title: '请输入邮寄地址',
        icon: 'none',
      })
    }else{
    let promiseArr = [];
    Promise.all(promiseArr).then(res => {
      // 插入数据
      db.collection('information').add({
        data: {
          name: this.data.name,
          tel: this.data.tel,
          address: this.data.address,
          dbAccount: this.data.dbAccount,
        }
      }).then(res => {
        wx.hideLoading();
        wx.showToast({
          title: '提交成功',
        })
      }).catch(err => {
        console.log(err)
        wx.hideLoading();
        wx.showToast({
          title: '提交失败，请查询多宝账户是否重复',
          icon: 'none',
        })
      })

    });}

  },
  //更新背景图
  upLoadImg: function() {
    wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success: res => {
          // tempFilePath可以作为img标签的src属性显示图片

          const tempFilePaths = res.tempFilePaths
          this.setData({
            images: (tempFilePaths)
          });
          wx.showLoading({
            title: '更换背景中',
          })
           // 上传图片到云存储
          let promiseArr = [];
          for (let i = 0; i < this.data.images.length; i++) {
            promiseArr.push(new Promise((reslove, reject) => {
              let item = this.data.images[i];
              let suffix = /\.\w+$/.exec(item)[0]; // 正则表达式，返回文件扩展名
              wx.cloud.uploadFile({
                cloudPath: new Date().getTime() + suffix, // 上传至云端的路径
                filePath: item, // 小程序临时文件路径
                success: res => {
                  // 返回文件 ID
                 
                  console.log(res.fileID)
                  this.setData({
                    fileIds: this.data.fileIds.concat(res.fileID)
                  });
                  reslove();
                },
                fail: err => {
                  console.error
                 
                }
              })
            }
            ));
          }
          Promise.all(promiseArr).then(res => {
            // 插入数据
            db.collection('background').add({
              data: {
                fileIds: this.data.fileIds,
              }
            }).then(res => {
              wx.hideLoading();
              wx.showToast({
                title: '更新成功',
              })
            }).catch(err => {
              wx.hideLoading();
              wx.showToast({
                title: '更新失败',
              })
            })
          });
        }
      })
  },
  
  onTelChange: function(event) {
    this.setData({
      tel: event.detail
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     wx.cloud.callFunction({
       name : "login"
     }).then(res=>{
       console.log(res.result.openid);
       db.collection("openID").where({
         _openid: res.result.openid
       }).get().then(res=>{
         if(res.data.length == 1){
            this.setData({
               isCY58 : '1'
            });
          }
       }).catch(err=>{
         console.log(err);
       })
     }).catch(err=>{
       console.log(err);
     });
  },

  onAeraConfirm: function(event) {

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})