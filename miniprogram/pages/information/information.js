// pages/information/information.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
    name: '',
    tel: '',
    address: '',
    image: [], // 上传的图片
    images: [],
    fileIds: [],
    fileID: '',
    isCY58: '3',
    openid: '',
    username:''
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
    if ('' == this.data.name) {
      wx.hideLoading();
      wx.showToast({
        title: '请输入收件人姓名',
        icon: 'none',
      })
    } else if ('' == this.data.tel) {
      wx.hideLoading();
      wx.showToast({
        title: '请输入收件人手机号码',
        icon: 'none',
      })
    } else if ('' == this.data.address) {
      wx.hideLoading();
      wx.showToast({
        title: '请输入邮寄地址',
        icon: 'none',
      })
    } else {
      let promiseArr = [];
      Promise.all(promiseArr).then(res => {
        // 插入数据
        //首先查有没有该用户
        db.collection('information').where({
          _openid: this.data.openid
        }).get().then(res => {
          console.log(res);
          if (res.data.length >= 1) {
            db.collection('information').doc(res.data[0]._id).update({
              data: {
                name: this.data.name,
                tel: this.data.tel,
                address: this.data.address,
                username:this.data.username
              }
            }).then(res => {
              console.log(res);
              wx.hideLoading();
              wx.showToast({
                title: '提交成功'
              })
            }).catch(err => {
              wx.hideLoading();
              wx.showToast({
                title: '提交失败'
              })
            });
          } else {
            db.collection('information').add({
              data: {
                name: this.data.name,
                tel: this.data.tel,
                address: this.data.address,
                username: this.data.username
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
            });
          }
        }).catch(err => {
          console.log(err);
        });
      });
    }

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
        db.collection("background").where({
          _openid: this.data.openid
        }).get().then(res => {
          console.log(res);
          //若背景图片中存在图片
          if (res.data.length>0){
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

  onTelChange: function(event) {
    this.setData({
      tel: event.detail
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.cloud.callFunction({
      name: "login"
    }).then(res => {
      console.log(res.result);
      this.setData({
        openid: res.result.openid
      });
      let _openid = res.result.openid;
      console.log(_openid);
      db.collection("user").where({
        _openid: res.result.openid
      }).get().then(res => {
        if (res.data.length >= 1) {
          this.setData({
            isCY58: '1',
          });
        } else {
          this.setData({
            isCY58: '0',
          });
        }
        //若为公司员工，加载员工信息
        db.collection("information").where({
          _openid: this.data.openid
        }).get().then(res => {
          //查询到数据加载数据与图片
          console.log(res);
          if (res.data.length > 0) {
            console.log(res.data[0]);
            let info = res.data[0];
            this.setData({
              name: info.name,
  
              tel: info.tel,
              address: info.address,
            });
            //加载员工姓名
            db.collection('user').where({
              _openid:this.data.openid
            }).get().then(res=>{
              console.log(res);
                 this.setData({
                 //  username:res.data[0].name
                 });
            }).catch(err=>{
              console.log(err);
            })
            //加载背景图片
            db.collection("background").where({
              _openid: this.data.openid
            }).get().then(res => {
              if (res.data.length >= 1) {
                console.log(res);
                this.setData({
                  fileID: res.data[0].fileIds
                });
                wx.cloud.downloadFile({
                  fileID: this.data.fileID, // 文件 ID
                  success: res => {
                    // 返回临时文件路径
                    this.setData({
                      images: (res.tempFilePath)
                    });
                  },
                  fail: console.error
                })
              } else {
                this.setData({
                  image: "../../images/head.jpg"
                });
              }
            }).catch(err => {
              console.log(err);
            });
          }else{
            //加载员工姓名
            db.collection('user').where({
              _openid: this.data.openid
            }).get().then(res => {
              console.log(res);
              this.setData({
               // username: res.data[0].name
              });
            }).catch(err => {
              console.log(err);
            })
            this.setData({
              image: "../../images/head.jpg"
            });
          }
        }).catch(err => {
          console.log(err);
        });
      }).catch(err => {
        console.log(err);
      });
    }).catch(err => {
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
    this.onLoad(),
    wx.stopPullDownRefresh()
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