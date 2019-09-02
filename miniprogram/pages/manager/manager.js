// pages/manager/manager.js
const db = wx.cloud.database();
const app = getApp();
const _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //劳保物资信息
    goodsName: '', //商品名
    goodsDesc: '', //商品描述
    tager1: '', //标签1
    tager2: '', //标签2
    remark: '', //备注
    festival: '',
    date: '',
    images: [],
    fileIds: [],
    isSelect: '',
    num: '',
    minNum: '',
    //isSelect选择器选项
    selectList: ['是', '否'],
    //festival选择器选项
    festivalList: ['春节', '元旦', '清明节', '妇女节', '劳动节', '端午节', '中秋节', '国庆节', '劳保', '其他'],
    //折叠面板控制
    activeNames: ['0'],
    activeNames1: ['0'],
    activeNames2: ['0'],
    activeNames3: ['0'],
    //加载数据库中的goods到页面
    allGoodsInfo: [],
    allGoodsIdList: [],
    goodsInfoShow: [],
    goodsNum: 0,
    goods: [],
    count: '',
    userInfo: '',
    preCount: '1',
    //配置信息
    isRegist: true,
    limitNum:''

  },

  onSwitch({ detail }) {
    // 需要手动对 checked 状态进行更新
    console.log(detail)
    this.setData({ isRegist: detail });
  },
  toMaxNum(event){
    this.setData({ limitNum: event.detail });  
  },
  changeParam(event){
    var that = this
    wx.cloud.callFunction({
      name:"changeParam",
      data:{
        limitNum:that.data.limitNum,
        isRegist:that.data.isRegist
      }
    }).then(res=>{console.log(res)}).catch(err=>{console.log(err)})
  },
  //选择节日
  bindFestival: function(event) {
    console.log(event.detail.value);
    this.setData({
      festival: this.data.festivalList[event.detail.value]
    })
  },
  //是否可选
  bindIsSelect: function(event) {
    console.log(event.detail.value);
    this.setData({
      isSelect: this.data.selectList[event.detail.value]
    })
  },
  //物资名称
  goodsNameChange: function(event) {
    this.setData({
      goodsName: event.detail
    });
  },
  //物资描述
  goodsDescChange: function(event) {
    this.setData({
      goodsDesc: event.detail
    });
  },
  //标签1
  tager1Change: function(event) {
    this.setData({
      tager1: event.detail
    });
  },
  //标签2
  tager2Change: function(event) {
    this.setData({
      tager2: event.detail
    });
  },
  //限制数量
  numChange: function(event) {
    this.setData({
      num: event.detail
    })
  },
  minNumChange: function(event) {
    this.setData({
      minNum: event.detail
    })
  },
  //备注
  remarkChange: function(event) {
    this.setData({
      remark: event.detail
    });
  },
  //节日
  festivalChange: function(event) {
    this.setData({
      festival: event.detail
    });
  },
  //添加日期
  dateChange: function(event) {
    this.setData({
      date: event.detail
    });
  },
  //上传图片
  uploadImg: function() {
    // 选择图片
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths);
        this.setData({
          images: this.data.images.concat(tempFilePaths)
        });
      }
    })
  },
  //提交物资信息
  submitGoodsInfo: function(event) {
    var that = this;
    // db.collection("GOODS_INFO").where({
    //   IS_SELECT: "是"
    // }).count().then(res => {
    //   console.log(res)
    //   if(res.total>=20){
    //     wx.showToast({
    //       title: '暂时只支持20个可选物资',
    //       icon: 'none',
    //     })
    //     return
    //   }
    // }).catch(err=>{
    //   console.log(err)
    // })
    wx.showLoading({
      title: '上传中···',
    })
    if ("" == this.data.goodsName) {
      wx.hideLoading();
      wx.showToast({
        title: '请输入物资名称',
        icon: 'none',
      })
    } else if ("" == this.data.goodsDesc) {
      wx.hideLoading();
      wx.showToast({
        title: '请输入物资描述',
        icon: 'none',
      })
    } else if ("" == this.data.tager1) {
      wx.hideLoading();
      wx.showToast({
        title: '请输入标签1',
        icon: 'none',
      })
    } else if ("" == this.data.tager2) {
      wx.hideLoading();
      wx.showToast({
        title: '请输入标签2',
        icon: 'none',
      })
    } else if ("" == this.data.num) {
      wx.hideLoading();
      wx.showToast({
        title: '请填写最大数量',
        icon: 'none',
      })
    } else if ("" == this.data.minNum) {
      wx.hideLoading();
      wx.showToast({
        title: '请填写最小数量',
        icon: 'none',
      })
    } else if (this.data.num * 1 < this.data.minNum * 1) {
      wx.hideLoading();
      wx.showToast({
        title: '最小值不能大于最大值',
        icon: 'none',
      })
    } else if ('' == this.data.festival) {
      wx.hideLoading();
      wx.showToast({
        title: '请输入节日',
        icon: 'none',
      })
    } else if ("" == this.data.date) {
      wx.hideLoading();
      wx.showToast({
        title: '请填写添加日期',
        icon: 'none',
      })
    } else if ("" == this.data.isSelect) {
      wx.hideLoading();
      wx.showToast({
        title: '请确认是否可选',
        icon: 'none',
      })
    } else if ("" == this.data.images) {
      wx.hideLoading();
      wx.showToast({
        title: '请至少上传一张照片',
        icon: 'none',
      })
    } else {
      // 上传图片到云存储
      let promiseArr = [];
      for (let i = 0; i < that.data.images.length; i++) {
        promiseArr.push(new Promise((reslove, reject) => {
          let item = that.data.images[i];
          let suffix = /\.\w+$/.exec(item)[0]; // 正则表达式，返回文件扩展名
          wx.cloud.uploadFile({
            cloudPath: new Date().getTime() + suffix, // 上传至云端的路径
            filePath: item, // 小程序临时文件路径
            success: res => {
              // 返回文件 ID
              console.log(res.fileID)
              that.setData({
                fileIds: that.data.fileIds.concat(res.fileID)
              });
              reslove();
            },
            fail: console.error
          })
        }));
      }

      Promise.all(promiseArr).then(res => {
        wx.cloud.callFunction({
            name: 'addGoods',
            data: {
              goodsName: that.data.goodsName,
              goodsDesc: that.data.goodsDesc,
              tager1: that.data.tager1,
              tager2: that.data.tager2,
              num: that.data.num,
              minNum: that.data.minNum,
              remark: that.data.remark,
              festival: that.data.festival,
              date: that.data.date,
              isSelect: that.data.isSelect,
              fileIds: that.data.fileIds,
            }
          })
          .then(res => {
            console.log(res);
            wx.hideLoading();
            wx.showToast({
              title: '物资添加成功',
            })
            var goodsTmp;
            var goodsTmpList = that.data.goods;
            console.log(goodsTmpList)
            goodsTmp = {
              GOODS_NAME: that.data.goodsName,
              GOODS_DESC: that.data.goodsDesc,
              TAGER1: that.data.tager1,
              TAGER2: that.data.tager2,
              NUM: that.data.num,
              MIN_NUM: that.data.minNum,
              REMARK: that.data.remark,
              FESTIVAL: that.data.festival,
              DATE: that.data.date,
              IS_SELECT: that.data.isSelect,
              FILEIDS: that.data.fileIds,
            };
            that.setData({
              images: [],
              fileIds: []
            });
            that.onLoad();
          }).catch(err => {
            console.log(err);
            wx.hideLoading();
            wx.showToast({
              title: '物资添加失败',
            })
          })

      });
    }
  },

  onChange(event) {
    this.setData({
      activeNames: event.detail
    });
  },

  onChange1(event) {
    this.setData({
      activeNames1: event.detail
    });
  },

  onChange2(event) {
    this.setData({
      activeNames2: event.detail
    });
  },
  onChange3(event) {
    this.setData({
      activeNames3: event.detail
    });
  },
  //获取物资信息
  getGoodsInfo: function(event) {
    db.collection("GOODS_INFO").where
  },

  //删除物资
  deleteGoods: function(event) {
    var that = this;
    console.log(event);
    var allGoodsInfo = that.data.allGoodsInfo;
    var allGoodsIdList = that.data.allGoodsIdList;
    var goodsid = event.target.dataset.goodsid;
    var goodsIndex = event.target.dataset.goodsindex;
    wx.showModal({
        title: '提示',
        content: '是否删除物资信息',
        success(res) {
          if (res.confirm) {
            //如果确定删除，需要删除云存储的图片
            wx.showLoading({
              title: '删除中···',
            })
            var goodsInfo;
            var fileIds = [];
            console.log(goodsid);
            fileIds = allGoodsInfo[goodsIndex].FILEIDS;
            console.log(fileIds)
            wx.cloud.deleteFile({
              fileList: fileIds,
              success: res => {
                console.log(res.fileList);
                console.log(fileIds)
              }
            })
           
            wx.cloud.callFunction({
              name: "deleteGoods",
              data: {
                goodsId: goodsid
              }
            }).then(res => {
              console.log(res)
              allGoodsInfo.splice(goodsIndex,1);
              allGoodsIdList.splice(goodsIndex,1);
              that.setData({
                allGoodsInfo:allGoodsInfo,
                allGoodsIdList:allGoodsIdList
              })
              wx.hideLoading();
              wx.showToast({
                title: '删除成功',
              })
              that.onLoad();
            }).catch(err => {
              console.log(err)
              wx.hideLoading();
              wx.showToast({
                title: '删除失败',
              })
            })
          }
          else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
    })    
},

//下拉加载更多
toShowMore: function(options) {
    //加载物资信息
    var count = this.data.count;
    var allGoodsInfo = this.data.allGoodsInfo;
    var goodsInfoShow = this.data.goodsInfoShow;
    if (0 < this.data.count && 0 < this.data.preCount) {
      console.log(allGoodsInfo)
      console.log(goodsInfoShow)
      var allGoodsInfoTmp = allGoodsInfo.slice(count, count + 5);
      console.log(allGoodsInfoTmp)
      this.setData({
        goodsInfoShow: goodsInfoShow.concat(allGoodsInfoTmp),
        count: count + goodsInfoShow.length,
        preCount: allGoodsInfoTmp.length
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //加载物资信息
    console.log(app.globalData)
    this.setData({
      isRegist: app.globalData.param.IS_REGIST,
      limitNum: app.globalData.param.LIMIT_NUM
    })
    var that = this;
    that.data.preCount='1';
    var allGoodsInfo = [];
      wx.cloud.callFunction({
        name: "getAllGoods"
      }).then(res => {
        allGoodsInfo = res.result.data;
        console.log(allGoodsInfo)
        var allGoodsIdList = [];
        for (let i = 0; i < allGoodsInfo.length; i++) {
          allGoodsIdList.push(allGoodsInfo[i]._id)
        }

        that.setData({
          allGoodsIdList: allGoodsIdList
        })

        var goodsInfoTmp = allGoodsInfo.slice(0, 5);
        that.data.allGoodsInfo = allGoodsInfo;
        console.log(goodsInfoTmp)
        that.setData({
          goodsInfoShow: goodsInfoTmp,
          count: goodsInfoTmp.length,
          goodsNum: allGoodsInfo.length
        })
      }).catch(err => {
        console.log(err)
      });
    
  },

  //添加日期
  bindDateChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function(options) {
    this.onLoad(options);
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

  },

  clear: function(event) {
    console.log(event)
  }
})