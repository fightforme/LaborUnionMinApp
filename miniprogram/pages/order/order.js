// miniprogram/pages/order/order.js
const db = wx.cloud.database();
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    allOrder: [],
    waitOrder: [],
    finishOrder: [],
    cancelOrder: [],
    allOrderNum: '',
    watiOrderNum: '',
    finishOrderNum: '',
    cancelOrderNum: '',
    userInfo: app.globalData.userInfo,
    userOpenId: app.globalData.userInfo.userOpenId,
    scence: '0',
    orderNum: ''
  },

  deleteOrderAll: function(options) {
    var that = this
    var orderStatus = options.target.dataset.orderstatus;
    var orderId = options.target.dataset.orderid;
    var orderIndex = options.target.dataset.orderindex;
    console.log(orderId)
    wx.showModal({
      title: '提示',
      content: '确定要删除该订单吗？',
      success(res) {
        if (res.confirm) {
          db.collection("ORDER").doc(orderId).remove().then(res => {
            console.log(res);
            that.onLoad("");
          }).catch(err => {
            console.log(err)
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  deleteOrder: function(options) {
    var that = this
    var orderStatus = options.target.dataset.orderstatus;
    var orderId = options.target.dataset.orderid;
    var orderIndex = options.target.dataset.orderindex;
    wx.showModal({
      title: '提示',
      content: '确定要删除该订单吗？',
      success(res) {
        if (res.confirm) {
          db.collection("ORDER").doc(orderId).remove().then(res => {
            console.log(res);
            that.onLoad("");
          }).catch(err => {
            console.log(err)
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  cancelOrderAll: function(options) {
    var that = this
    var orderStatus = options.target.dataset.orderstatus;
    var orderId = options.target.dataset.orderid;
    var orderIndex = options.target.dataset.orderindex;
    console.log(orderStatus)
    console.log(orderId)
    console.log(orderIndex)
    wx.showModal({
      title: '提示',
      content: '确定要取消该订单吗？',
      success(res) {
        if (res.confirm) {
          db.collection("ORDER").doc(orderId).update({
            data: {

              ORDER_STATUS: "已取消"
            }
          }).then(res => {
            console.log(res);
            that.onLoad("");
          }).catch(err => {
            console.log(err)
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
   
  },
  cancelOrder: function(options) {
    var that = this
    var orderStatus = options.target.dataset.orderstatus;
    var orderId = options.target.dataset.orderid;
    var orderIndex = options.target.dataset.orderindex;
    wx.showModal({
      title: '提示',
      content: '确定要取消该订单吗？',
      success(res) {
        if (res.confirm) {
          db.collection("ORDER").doc(orderId).update({
            data: {
              ORDER_STATUS: "已取消"
            }
          }).then(res => {
            console.log(res);
            that.onLoad("");
          }).catch(err => {
            console.log(err)
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
   

  },
  getGoods: function (options){
    var that = this
    var orderStatus = options.target.dataset.orderstatus;
    var orderId = options.target.dataset.orderid;
    var orderIndex = options.target.dataset.orderindex;
    var orderStatus = options.target.dataset.orderstatus;
    var orderId = options.target.dataset.orderid;
    var orderIndex = options.target.dataset.orderindex;
    wx.showModal({
      title: '提示',
      content: '若没有收到货，请点击取消',
      success(res) {
        if (res.confirm) {
          db.collection("ORDER").doc(orderId).update({
            data: {
              ORDER_STATUS: "已完成"
            }
          }).then(res => {
            console.log(res);
            that.onLoad("");
          }).catch(err => {
            console.log(err)
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
   
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var allOrder_tmp = [];
    var waitOrder_tmp = [];
    var finishOrder_tmp = [];
    var cancelOrder_tmp = [];
    var allOrderNum = 0;
    var waitOrderNum = 0;
    var finishOrderNum = 0;
    var cancelOrderNum = 0;
    console.log(options)
    if(options != "")
    this.setData({
      scence: options.scence
    })
    const result = wx.cloud.callFunction({
      name: 'getAllOrder'
    }).then(res => {
      console.log(res)
      allOrder_tmp = res.result.data;
      allOrderNum = res.result.data.length;
      allOrder_tmp.reverse();
      for (let i = 0; i < allOrderNum; i++) {
        if (allOrder_tmp[i].ORDER_STATUS == "待收货") {
          waitOrder_tmp.push(allOrder_tmp[i])
          waitOrderNum == ~~waitOrderNum + 1
        } else if (allOrder_tmp[i].ORDER_STATUS == "已完成") {
          finishOrder_tmp.push(allOrder_tmp[i])
          finishOrderNum == ~~finishOrderNum + 1
        } else if (allOrder_tmp[i].ORDER_STATUS == "已取消") {
          cancelOrder_tmp.push(allOrder_tmp[i])
          cancelOrderNum == ~~cancelOrderNum + 1
        }
      }
      that.setData({
        allOrder: allOrder_tmp,
        waitOrder: waitOrder_tmp,
        finishOrder: finishOrder_tmp,
        cancelOrder: cancelOrder_tmp,
        allOrderNum: allOrderNum,
        waitOrderNum: waitOrderNum,
        finishOrderNum: finishOrderNum,
        cancelOrderNum: cancelOrderNum
      })
    }).catch(err => {
      console.log(err)
    })
    console.log(result)
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
  onHide: function(options) {
    // console.log("onhide")
    // if (this.data.scence != 3)
    //   wx.redirectTo({
    //     url: '../goods/goods',
    //   })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    console.log("onUnload")
    if (this.data.scence == 1 || this.data.scence == 2)
      wx.navigateBack({
        url: '../goods/goods',
      })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function(options) {
    console.log(options)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  onClick: function(event) {
    var index = (event.detail.index);
    if (index == 0) {

      this.setData({
        orderNum: this.data.allOrderNum
      })
    } else if (index == 1) {
      this.setData({
        orderNum: this.data.watiOrderNum
      })
    } else if (index == 2) {
      this.setData({
        orderNum: this.data.finishOrderNum
      })
    } else {
      this.setData({
        orderNum: this.data.cancelOrderNum
      })
    }
  },

})