const db = wx.cloud.database;
const app = getApp();

Page({
  data: {
    background: ['../../images/1.png', '../../images/2.png', '../../images/3.png'],
  },


  toWeb:function(event){
    console.log(event);
  },

  toGoods: function (event){
    console.log(event);
    wx.navigateTo({
      url: '../goods/goods',
    })
  },

  //该方法暂时不用，待有管理页面时在使用
  changeImages : function(event){
        console.log(event)
    wx.chooseImage({
      count: 9,
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
        db.collection("background").where({
          _openid: this.data.openid
        }).get().then(res => {
          console.log(res);
          //若背景图片中存在图片
          if (res.data.length > 0) {
            this.setData({
              fileID: res.data[0].fileIds,
            });
          }
          if (this.data.fileID != '') {
            wx.cloud.deleteFile({
              fileList: [this.data.fileID],
              success: res => {
                // handle success
                console.log(res)
              },
              fail: console.error
            })
          }

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
                    fileIds: (res.fileID)
                  });
                  reslove();
                },
                fail: err => {
                  console.error

                }
              })
            }));
          }

          Promise.all(promiseArr).then(res => {
            // 插入数据
            wx.cloud.callFunction({
              name: "batchDelete",
              data: {
                _openid: this.data.openid
              }
            }).then(res => {
              console.log(res);
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
            }).catch(err => {
              console.log(err);
            });
          });
        }).catch(err => {
          console.log(err);
        });
      }
    })
  },

  onLoad:function(options){
     console.log(app.globalData.userInfo)
    
     
  },
  toPersonInfo(event){
     wx.navigateTo({
       url: '../personInfo/personInfo'
     })
  }

})
