const db = wx.cloud.database();
const app = getApp();
var goodsIdList = [];
var goodsCountList = [];
var cartGoods = [];
var cartGoodsCountList = [];
var cartGoodsIdList = [];
Page({
  onShareAppMessage() {
    return {
      title: '收货地址',
      path: 'pages/goods/goods'
    }
  },

  data: {
    addressInfo: null,
    goodsInfo: [],
    //全物资信息
    allGoodsInfo: [],
    allGoodsNum: 0,

    //可选物资信息
    goodsIsSelect: [],
    goodsIsSelectNum: 0,

    //用于显示的物资数组
    goodsIsSelectShow: [],
    count: '0',

    userInfo: null,
    //购物车商品个数
    cartGoodsNum: '0',
    cartGoodsPrice:'0',
    preCount: '1',

    cartId: '',

    //选择物资
    selectedGoodsIdList:[],
    selectedGoodsCountList:[]
  },


  chooseAddress() {
    wx.chooseAddress({
      success: (res) => {
        this.setData({
          addressInfo: res
        })
      },
      fail(err) {
        console.log(err)
      }
    })
  },


  //下拉加载更多
  toShowMore: function(options) {
    //加载物资信息
    var count = this.data.count;
    var goodsIsSelect = this.data.goodsIsSelect;
    var goodsIsSelectShow = this.data.goodsIsSelectShow;
    if (0 < this.data.count && 0 < this.data.preCount) {
      
      console.log(this.data.preCount)
      console.log(goodsIsSelectShow)
      var goodsIsSelectTmp = goodsIsSelect.slice(count, count + 5);
      console.log(goodsIsSelectTmp)
      this.setData({
        goodsIsSelectShow: goodsIsSelectShow.concat(goodsIsSelectTmp),
        count: count + goodsIsSelectTmp.length,
        preCount: goodsIsSelectTmp.length
      })
    }
  },


  onLoad: function(options) {
    this.data.preCount = '1';
    console.log("onload")
    var that = this;
    var allGoodsInfoOnload = [];
    var goodsIsSelect = [];
    var goodsIsSelectIdList = [];
    //加载全物资
    wx.cloud.callFunction({
      name: 'getAllGoods'
    }).then(res => {
      console.log(res)
      that.data.allGoodsInfo = res.result.data;
      allGoodsInfoOnload = res.result.data;
      that.data.allGoodsNum = res.result.data.length;
      console.log(allGoodsInfoOnload)
      wx.setStorageSync("allGoods",{
        allGoodsInfoStorage:allGoodsInfoOnload  
      })
      for (let i = 0; i <= allGoodsInfoOnload.length - 1; i++) {
        if (allGoodsInfoOnload[i].IS_SELECT == '是') {
          goodsIsSelect.push(allGoodsInfoOnload[i]);
        }
      }
      that.data.goodsIsSelectNum = goodsIsSelect.length;
      //首次初始化5个
      var goodsIsSelectTmp = goodsIsSelect.slice(0, 10);

      that.data.count = goodsIsSelectTmp.length;

      //渲染可选物资
      that.setData({
        goodsIsSelectShow: goodsIsSelectTmp,
        goodsIsSelect: goodsIsSelect
      })

      console.log(goodsIsSelect)
      for (let j = 0; j < goodsIsSelect.length; j++) {
        console.log(goodsIsSelect[j]._id)
        goodsIsSelectIdList.push(goodsIsSelect[j]._id)
      }
      console.log(goodsIsSelectIdList)
      //更新购物车
      db.collection("CART").get().then(res => {
        console.log(res)
        //若没有购物车，则不更新
        if (res.data.length <= 0) {
          return
        }
        var cartCountList = res.data[0].GOODS_COUNT_LIST;
        var cartIdList = res.data[0].CART_GOODS_ID_LIST;
        var cartGoodsInfo = res.data[0].CART_GOODS;
        var totalNum = res.data[0].TOTAL_NUM;
        var totalPrice = res.data[0].TOTAL_PRICE;
        console.log(res)
        let update = false
        console.log(goodsIsSelect)
        //若有购物车，检查购物车中是否有物资已经删除，或者为不可选，若有则删除
        for (let i = 0; i < cartIdList.length; i++) {
          let index = goodsIsSelectIdList.indexOf(cartIdList[i])
          if (index < 0) {
            update = true
            let c = cartCountList.splice(i, 1);
            cartIdList.splice(i, 1);
            var cartGoodsInfoSplice = cartGoodsInfo.splice(i, 1);
            totalNum = ~~totalNum - ~~c;
            totalPrice = ~~totalPrice - ~~c * cartGoodsInfoSplice.PRICE;
          }
        }

        //渲染购物车内物资数量
        that.setData({
          cartGoodsNum: totalNum,
          cartGoodsPrice: totalPrice,
          cartId: res.data[0]._id
        })

        //根据update变量，对购物车进行更新操作
        if (update) {
          db.collection("CART").doc(res.data[0]._id).update({
            data: {
              GOODS_COUNT_LIST: cartCountList,
              CART_GOODS_ID_LIST: cartIdList,
              CART_GOODS: cartGoodsInfo,
              TOTAL_NUM: totalNum,
              TOTAL_PRICE:totalPrice
            }
          }).then(res => {
            console.log(res)
          }).catch(err => {})
        }
      }).catch(err => {
        console.log(err)
      })
    }).catch(err=>{
      console.log(err)
    })
  },

  //物资选择
  changeGoodsNum: function(event) {
    var selectedGoodsIdList = this.data.selectedGoodsIdList;
    var selectedGoodsCountList = this.data.selectedGoodsCountList;
    let index = selectedGoodsIdList.indexOf(event.target.dataset.goodsid);
    if (index < 0) {
      selectedGoodsIdList.push(event.target.dataset.goodsid);
      selectedGoodsCountList.push(~~event.detail);
      console.log("物资id" + selectedGoodsIdList);
      console.log("物资数量" + selectedGoodsCountList)
    } else {
      selectedGoodsCountList[index] = ~~event.detail;
      console.log("物资id" + selectedGoodsIdList);
      console.log("物资数量" + selectedGoodsCountList)
    }
    this.setData({
      selectedGoodsIdList: selectedGoodsIdList,
      selectedGoodsCountList: selectedGoodsCountList
    })
  },

  //加入购物车
  packingIn: function(event) {
    wx.showLoading({
      title: '加入背包中...',
      mask: true
    })
    var packingInNum = 0;
    var packingInPrice = 0 ; 
    for (let i = 0; i < this.data.selectedGoodsCountList.length; i++) {
      packingInNum = ~~packingInNum + ~~this.data.selectedGoodsCountList[i];
    }
    var goodsListP = this.data.allGoodsInfo;
    var goodsIdListPackIn = this.data.selectedGoodsIdList;
    var goodsCountListPackIn = this.data.selectedGoodsCountList;
    var that = this;
    var cartGoodsListPackIn = [];
    var cartGoodsCountListPackIn = [];
    var cartGoodsIdListPackIn = [];
    if (goodsIdListPackIn.length == 0 || ~~packingInNum == 0) {
      wx.showToast({
        title: "请选择物资",
        icon: "none"
      })
      return
    }

    //可以优化，这里判断物资中心和购物车是否都有该商品，确定是购物车加商品，还是只改商品个数
    db.collection("CART").get().then(res => {
      if (res.data.length > 0) {
        cartGoodsListPackIn = res.data[0].CART_GOODS;
        cartGoodsCountListPackIn = res.data[0].GOODS_COUNT_LIST;
        cartGoodsIdListPackIn = res.data[0].CART_GOODS_ID_LIST;
        console.log(goodsIdListPackIn);
        for (let i = 0; i < goodsListP.length; i++) {
          let index1 = goodsIdListPackIn.indexOf(goodsListP[i]._id);
          let index2 = cartGoodsIdListPackIn.indexOf(goodsListP[i]._id)
          if (index1 >= 0 && index2 >= 0 && goodsCountListPackIn[index1] > 0) {
            console.log(goodsListP[i].MIN_NUM * 1)
            console.log(goodsCountListPackIn[index1])
            if (goodsListP[i].MIN_NUM * 1 > goodsCountListPackIn[index1]) {
              wx.hideLoading;
              wx.showToast({
                title: goodsListP[i].GOODS_NAME + '最少要' + goodsListP[i].MIN_NUM + "件",
                icon: "none"
              })
              return
            } else cartGoodsCountListPackIn[index2] = goodsCountListPackIn[index1];
          } else if (index1 >= 0 && index2 < 0 && goodsCountListPackIn[index1] > 0) {
            if (goodsListP[i].MIN_NUM * 1 > goodsCountListPackIn[index1]) {
              wx.hideLoading;
              wx.showToast({
                title: goodsListP[i].GOODS_NAME + '最少要' + goodsListP[i].MIN_NUM + "件哦",
                icon: "none"
              })
              return
            } else {
              cartGoodsIdListPackIn.push(goodsListP[i]._id);
              cartGoodsCountListPackIn.push(goodsCountListPackIn[index1]);
              cartGoodsListPackIn.push(goodsListP[i])
            }
          }
        }
        var totalNum = 0;
        var totalPrice = 0;
        for (let n = 0; n < cartGoodsCountListPackIn.length; n++) {
          totalNum = ~~totalNum + ~~cartGoodsCountListPackIn[n];
          totalPrice = ~~totalPrice + ~~cartGoodsListPackIn[n].PRICE * ~~cartGoodsCountListPackIn[n]
        }
        console.log(totalNum);
        console.log(totalPrice);
        db.collection("CART").doc(res.data[0]._id).update({
          data: {
            CART_GOODS: cartGoodsListPackIn,
            GOODS_COUNT_LIST: cartGoodsCountListPackIn,
            CART_GOODS_ID_LIST: cartGoodsIdListPackIn,
            TOTAL_NUM: totalNum,
            TOTAL_PRICE: totalPrice,
            LAST_UPDATE_DATE: new Date()
          }
        }).then(res => {
          console.log(res)
          that.setData({
            cartGoodsNum: totalNum,
            cartGoodsPrice:totalPrice
          })
          wx.hideLoading;
          wx.showToast({
            title: '加入成功',
            icon: 'success',
          })
        }).catch(err => {
          console.log(err)
          wx.hideLoading;
          wx.showToast({
            title: '加入失败',
            icon: "none"
          })
        })
      } else {
        for (let i = 0; i < goodsListP.length; i++) {
          let index = goodsIdList.indexOf(goodsListP[i]._id);
          console.log(index)
          if (index >= 0 && goodsCountList[index] > 0) {
            cartGoodsListPackIn.push(goodsListP[i]);
            cartGoodsCountListPackIn.push(goodsCountList[index]);
            cartGoodsIdListPackIn.push(goodsListP[i]._id);
          }
        }
        var totalNum = 0;
        var totalPrice = 0 ;
        for (let n = 0; n < cartGoodsCountListPackIn.length; n++) {
          totalNum = ~~totalNum + ~~cartGoodsCountListPackIn[n],
            totalPrice = ~~totalPrice + ~~cartGoodsCountListPackIn[n] * cartGoodsListPackIn[n].PRICE
        }
        db.collection("CART").add({
          data: {
            CART_GOODS: cartGoodsListPackIn,
            GOODS_COUNT_LIST: cartGoodsCountListPackIn,
            CART_GOODS_ID_LIST: cartGoodsIdListPackIn,
            TOTAL_NUM: totalNum,
            TOTAL_PRICE:totalPrice,
            LAST_UPDATE_DATE: new Date(),
            CREATE_DATE: new Date()
          }
        }).then(res => {
          console.log(res)
          that.setData({
            cartGoodsNum: totalNum,
            cartGoodsPrice:totalPrice,
            cartId: res._id
          })
          console.log(res)
          wx.hideLoading;
          wx.showToast({
            title: '加入成功',
            icon: 'success',
          })
        }).catch(err => {
          console.log(err)
          wx.hideLoading;
          wx.showToast({
            title: '加入失败',
            icon: "none"
          })
        })
      }
    })



  },

  packageGoInit: function() {
    var goodsListP = this.data.allGoodsInfo;
    for (let i = 0; i < goodsListP.length; i++) {
      let index = this.data.selectedGoodsIdList.indexOf(goodsListP[i]._id);
      if (goodsListP[i].MIN_NUM * 1 > 0 && index < 0) {
        this.data.selectedGoodsIdList.push(goodsListP[i]._id);
        this.data.selectedGoodsCountList.push(0);
      }
    }
  },

  packageGo: function(event) {
    this.packageGoInit();
    console.log(event);
    var that = this
    var cartUserId;
    //最小选择提示
    var goodsListP = [];
    goodsListP = this.data.goodsIsSelect;
    console.log(goodsListP)
    for (let i = 0; i < goodsListP.length; i++) {
      let index = this.data.selectedGoodsIdList.indexOf(goodsListP[i]._id);
      if ((goodsListP[i].MIN_NUM * 1 > this.data.selectedGoodsCountList[index])) {
        wx.showToast({
          title: goodsListP[i].GOODS_NAME + '最少选' + goodsListP[i].MIN_NUM * 1 + "件",
          icon: 'none',
          duration: 2000
        })
        return
      }
    }
    //更新购物车
    console.log(cartGoods)
    cartGoods = [];
    cartGoodsCountList = [];
    cartGoodsIdList = [];
    for (let i = 0; i < goodsListP.length; i++) {
      let index = that.data.selectedGoodsIdList.indexOf(goodsListP[i]._id);
      console.log(index)
      if (index >= 0 && that.data.selectedGoodsCountList[index] > 0) {
        cartGoods.push(goodsListP[i]);
        cartGoodsCountList.push(that.data.selectedGoodsCountList[index]);
        cartGoodsIdList.push(goodsListP[i]._id);
      }
    }
    console.log(cartGoods)
    console.log(cartGoodsCountList)
    console.log(cartGoodsIdList)

    var totalNum = 0;
    var totalPrice = 0;
    for (let n = 0; n < cartGoodsCountList.length; n++) {
      totalNum = ~~totalNum + ~~cartGoodsCountList[n],
        totalPrice = ~~totalPrice + ~~cartGoodsCountList[n] * cartGoods[n].PRICE
    }
    if (totalNum == 0 ){
      wx.showModal({
        title: '提示',
        content: '没有搜集到物资哦，赶快去搜集物资吧',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      return
    }
    wx.setStorageSync("cart", {
      cartGoodsStorage: cartGoods,
      cartGoodsCountListStorage: cartGoodsCountList,
      cartGoodsIdListStorage: cartGoodsIdList,
      cartGoodsTotalNumStorage: totalNum,
      cartGoodsTotalPriceStorage : totalPrice
    })
    wx.navigateTo({
      url: '../cart/cart?scence=2',
    })

  },

  onShow(options) {
    console.log("onshow")
    this.onLoad();
  },

  //这里也可优化，购物车在页面加载时已将购物车信息加载
  openPackage: function() {
    var that = this
    db.collection("CART").get().then(res => {
      if (res.data.length == 0 || this.data.cartGoodsNum == 0) {
        wx.showModal({
          title: '提示',
          content: '背包没有物资哦，赶快去搜集物资吧',
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      } else {
        wx.setStorageSync("cart", {
          cartGoodsStorage: res.data[0].CART_GOODS,
          cartGoodsCountListStorage: res.data[0].GOODS_COUNT_LIST,
          cartGoodsIdListStorage: res.data[0].CART_GOODS_ID_LIST,
          cartGoodsTotalNumStorage: res.data[0].TOTAL_NUM,
          cartGoodsTotalPriceStorage: res.data[0].TOTAL_PRICE,
          cartIdStorage: res.data[0]._id
        })
        wx.navigateTo({
          url: '../cart/cart?scence=1',
        })
      }
    }).catch(err => {
      console.log(err)
    })
  }
})