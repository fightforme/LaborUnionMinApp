// miniprogram/pages/goodsDetail/goodsDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
     allGoodsInfoList:[],
     goodsId:'',
     goodsIndex:'',
     goodsInfo:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that = this;
    var allGoodsInfoList = wx.getStorageSync("allGoods");
    console.log(allGoodsInfoList);
    var allGoodsInfo = allGoodsInfoList.allGoodsInfoStorage;
    this.data.allGoodsInfoList = allGoodsInfo;
    console.log(allGoodsInfo)
    for (let i = 0; i < allGoodsInfo.length;i++){
      console.log(i)
       if(options.goodsid == allGoodsInfo[i]._id){
         this.setData({
            goodsInfo:allGoodsInfo[i],
            goodsId:options.goodsid,
            goodsIndex:options.index
         })
       }
    }
    wx.setNavigationBarTitle({
      title: that.data.goodsInfo.GOODS_NAME+'详情'
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

  },

  showPic(event){
     console.log(event);
     var that = this;
    var src = event.currentTarget.dataset.src;//获取data-src
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: that.data.goodsInfo.FILEIDS // 需要预览的图片http链接列表
    })
  },
  toOtherApp(event){
    wx.navigateToMiniProgram({
      appId: 'wxc94daee5c5b654ad',
      envVersion: 'release',
      success(res) {
        console.log(res);
      }
    })
  }
})