// miniprogram/pages/cart/cart.js

const db = wx.cloud.database();
const app = getApp();
var scence;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModalStatus: false,
    cartGoodsIdList: [],
    userInfo: '',
    cartGoodsCountList: [],
    cartGoodsInfo: [],
    cartGoods: [],
    userOpenId: '',
    allAddress:'',
    address: {
      provinceName: '请选择收货地址'
    },
    totalNum: 0,
    canSubmit: '',

    limitNum: 5,
    cartId: '',

    buttonName: '全部打包',

    addressId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log("onLoad")
    this.setData({
      limitNum: app.globalData.param.LIMIT_NUM
    })
    console.log("cart onLoad")
    console.log(options)
    this.data.canSubmit = true
    scence = options.scence;
    if (options.scence == 1) {

      wx.setNavigationBarTitle({
        title: '背包'
      })

    } else if (options.scence == 3) {
       this.data.addressId = options.addressId
      

    } else {
      this.setData({
        buttonName: '打包带走'
      })
      wx.setNavigationBarTitle({
        title: '立即打包'
      })
    }
    this.data.userInfo = app.globalData.userInfo;
    var that = this
    var cartGoodsInfo = wx.getStorageSync('cart');

    that.setData({
      cartGoodsCountList: cartGoodsInfo.cartGoodsCountListStorage,
      totalNum: cartGoodsInfo.cartGoodsTotalNumStorage,
      cartGoodsIdList: cartGoodsInfo.cartGoodsIdListStorage,
      cartGoods: cartGoodsInfo.cartGoodsStorage,
      cartGoodsInfo: cartGoodsInfo,
    })
    if (scence == 1) {
      this.data.cartId = cartGoodsInfo.cartIdStorage
    }
    if (this.data.totalNum > this.data.limitNum) {
      that.setData({
        canSubmit: true
      })
    }
    //加载地址信息
    db.collection("ADDRESS").get().then(res => {
      if (res.data.length > 0) {
        that.data.allAddress = res.data;
        for (let i = 0; i < res.data.length; i++) {
          if (scence == 3 && res.data[i]._id == that.data.addressId){
            that.setData({
              address: res.data[i].ADDRESS_INFO
            })
            return
          }
          if (scence != 3&&res.data[i].IS_DEFAULT == '是') {
            that.setData({
              address: res.data[i].ADDRESS_INFO
            })
            return
          }
         
        }

        if (that.data.address.provinceName.includes("请选择收货地址")){
          that.setData({
            address: res.data[0].ADDRESS_INFO
          })
        }
      }
    }).catch(err => {
      console.log(err)
    })
    console.log(cartGoodsInfo)
  },

  selectAddress: function(event) {
    var that = this
    wx.navigateTo({
      url: '../address/address?addressScence=1',
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
  onShow: function() {
    var addressInfo = wx.getStorageSync("selectAddressInfo");
    console.log(addressInfo);
    if (addressInfo!=''){
      this.setData({
        address: addressInfo.addressInfoStorage.ADDRESS_INFO
      })
    } else{
      var options={
        scence:this.data.scence
      }
      this.onLoad(options);
    }
    wx.removeStorageSync('selectAddressInfo');

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    console.log("cart onHide")
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    console.log("cart onUnload")
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

  deleteCartGoods: function(options) {
    console.log(options)
    var cartGoodsCountList = this.data.cartGoodsCountList
    var cartGoodsIdList = this.data.cartGoodsIdList
    var cartGoods = this.data.cartGoods
    var totalNum = this.data.totalNum
    var canSubmit = false
    let index = options.target.dataset.index;

    let num = cartGoodsCountList[index]
    cartGoodsCountList.splice(index, 1);
    cartGoodsIdList.splice(index, 1);
    cartGoods.splice(index, 1);
    num = ~~totalNum - ~~num;
    if (num > this.data.limitNum) {
      canSubmit = true
    }
    if (num == 0) {
      canSubmit = true
    }
    this.setData({
      cartGoodsCountList: cartGoodsCountList,
      cartGoodsIdList: cartGoodsIdList,
      cartGoods: cartGoods,
      totalNum: num,
      canSubmit: canSubmit
    })

    if (scence == 1) {
      db.collection("CART").doc(this.data.cartId).update({
        data: {
          CART_GOODS: cartGoods,
          CART_GOODS_ID_LIST: cartGoodsIdList,
          GOODS_COUNT_LIST: cartGoodsCountList,
          TOTAL_NUM: num,
          LAST_UPDATE_DATE: new Date()
        }
      }).then(res => {
        console.log(res)
      }).catch(err => {
        console.log(err)
      })
    }
  },

  onClickButton: function(event) {
    console.log(event)
    var that = this
    //分场景，如果是购物车点进去，然后提交订单，应该清空购物车

    if (that.data.address.provinceName.includes("请选择收货地址")) {
      wx.showToast({
        title: "请选择收货地址",
        icon: "none"
      })
      return
    }
    wx.showLoading({
      title: '订单提交中...',
      mask: true
    })
    if (that.data.totalNum == 0) {
      wx.hideLoading;
      wx.showToast({
        title: '背包是空的哦',
        icon: 'none',
      })
      return
    }
    // wx.setStorageSync('order', {
    //   orderGoodsStorage: that.data.cartGoods,
    //   orderGoodsCountListStorage: that.data.cartGoodsCountList,
    //   orderGoodsIdListStorage: that.data.cartGoodsIdList,
    //   orderTotalNumStorage: that.data.totalNum
    // })
    if (scence == 1) {
      db.collection("CART").doc(this.data.cartId).update({
        data: {
          CART_GOODS: [],
          CART_GOODS_ID_LIST: [],
          GOODS_COUNT_LIST: [],
          TOTAL_NUM: 0,
          LAST_UPDATE_DATE: new Date()
        }
      }).then(res => {
        console.log(res)
        wx.navigateTo({
          url: '../order/order?scence=1',
        })
        db.collection("ORDER").add({
          data: {
            ORDER_GOODS: that.data.cartGoods,
            ORDER_GOODS_COUNT_LIST: that.data.cartGoodsCountList,
            ORDER_GOODS_ID_LIST: that.data.cartGoodsIdList,
            ORDER_TOTAL_NUM: that.data.totalNum,
            CREATE_DATE: new Date(),
            LAST_UPDATE_DATE: new Date(),
            ORDER_STATUS: '待收货',
            ADDRESS_INFO: that.data.address,
            USER_INFO: that.data.userInfo
          }
        }).then(res => {
          console.log(res)
          wx.hideLoading;
          wx.showToast({
            title: '订单提交成功',
            icon: 'success',
          })
        }).catch(err => {
          console.log(err)
          wx.hideLoading;
          wx.showToast({
            title: '订单提交失败',
            icon: 'none',
          })
        })

      }).then(res => {
        console.log(res)
        wx.hideLoading;
        wx.showToast({
          title: '订单提交成功',
          icon: 'success',
        })
      })

    } else {
      wx.navigateTo({
        url: '../order/order?scence=2',
      })
      db.collection("ORDER").add({
        data: {
          ORDER_GOODS: that.data.cartGoods,
          ORDER_GOODS_COUNT_LIST: that.data.cartGoodsCountList,
          ORDER_GOODS_ID_LIST: that.data.cartGoodsIdList,
          ORDER_TOTAL_NUM: that.data.totalNum,
          CREATE_DATE: new Date(),
          LAST_UPDATE_DATE: new Date(),
          ORDER_STATUS: '待收货',
          ADDRESS_INFO: that.data.address,
          USER_INFO: that.data.userInfo
        }
      }).then(res => {
        console.log(res)
        wx.hideLoading;
        wx.showToast({
          title: '订单提交成功',
          icon: 'success',
        })
      }).catch(err => {
        console.log(err)
        wx.hideLoading;
        wx.showToast({
          title: '订单提交失败',
          icon: 'none',
        })
      })
    }
  },
  
  submitForm(event){
    console.log(event)
    var that = this
    //分场景，如果是购物车点进去，然后提交订单，应该清空购物车

    if (that.data.address.provinceName.includes("请选择收货地址")) {
      wx.showToast({
        title: "请选择收货地址",
        icon: "none"
      })
      return
    }
    wx.showLoading({
      title: '订单提交中...',
      mask: true
    })
    if (that.data.totalNum == 0) {
      wx.hideLoading;
      wx.showToast({
        title: '背包是空的哦',
        icon: 'none',
      })
      return
    }
    var goodsInfo='';
    for(let i=0;i<that.data.cartGoods.length;i++){
        goodsInfo=goodsInfo+that.data.cartGoods[i].GOODS_NAME+"("+that.data.cartGoodsCountList[i]+"件);";
    }
    var date = new Date();
    console.log(event.detail.formId);
    console.log(goodsInfo);
    var month = ~~date.getMonth()+1;
    var orderDate = (date.getFullYear() + "-" + month+"-"+date.getDate()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds());
    console.log(orderDate)
    wx.cloud.callFunction({
      name:"sendOrderMessage",
      data:{
        formId: event.detail.formId,
        orderDate: orderDate,
        name:that.data.address.userName,
        telNumber:that.data.address.telNumber,
        addressInfo:that.data.address.provinceName+" "+that.data.address.cityName+" "+that.data.address.countyName+" "+that.data.address.detailInfo,
        goodsInfo:goodsInfo,
        userName:app.globalData.userInfo.userName
      }
    }).then(res=>{console.log(res)}).catch(err=>{console.log(err)})
  },

  powerDrawer: function (e) {
    var currentStatu = e.currentTarget.dataset.statu;
    this.util(currentStatu)
  },
  util: function (currentStatu) {
    /* 动画部分 */
    // 第1步：创建动画实例   
    var animation = wx.createAnimation({
      duration: 200,  //动画时长  
      timingFunction: "linear", //线性  
      delay: 0  //0则不延迟  
    });

    // 第2步：这个动画实例赋给当前的动画实例  
    this.animation = animation;

    // 第3步：执行第一组动画  
    animation.opacity(0).rotateX(-100).step();

    // 第4步：导出动画对象赋给数据对象储存  
    this.setData({
      animationData: animation.export()
    })

    // 第5步：设置定时器到指定时候后，执行第二组动画  
    setTimeout(function () {
      // 执行第二组动画  
      animation.opacity(1).rotateX(0).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象  
      this.setData({
        animationData: animation
      })

      //关闭  
      if (currentStatu == "close") {
        this.setData(
          {
            showModalStatus: false
          }
        );
      }
    }.bind(this), 200)

    // 显示  
    if (currentStatu == "open") {
      this.setData(
        {
          showModalStatus: true
        }
      );
    }
  },

  
})