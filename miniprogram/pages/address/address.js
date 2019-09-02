// miniprogram/pages/address.js
const db = wx.cloud.database();
const app = getApp();
import Dialog from '/vant-weapp/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: [],
    defaultAddressId: '',
    addressScence:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    if(options != "")
    that.data.addressScence = options.addressScence;
    db.collection('ADDRESS').get().then(res => {
      console.log(res)
      that.setData({
        address: res.data
      })
      that.data.defaultAddressId = '';
      for (let i = 0; i < res.data.length; i++) {
        if (res.data[i].IS_DEFAULT == '是') {
          console.log(res.data[i]._id)
          that.setData({
            defaultAddressId: res.data[i]._id
          })
        }
      }
    }).catch(err => {
      console.log(err)
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
  onShow: function (options) {
    this.onLoad("")
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
  onClose(event) {
    var that = this;
    var index ;
    var addressId;
    const {
      position,
      instance
    } = event.detail;
    console.log(event);
    index = event.target.dataset.index;
    addressId = event.target.dataset.addressid;
    console.log(index)
    switch (position) {
      case 'left':
        console.log("1");
        wx.setStorageSync("editAddressInfo", {
          addressInfoStorage: that.data.address[event.target.dataset.index],
          defaultAddressIdStorage: that.data.defaultAddressId
        })
        wx.navigateTo({
          url: '../addressEdit/addressEdit?scence=2',
        })
        instance.close();
        break;
      case 'cell':
        instance.close();
        console.log("2");
        break;
      case 'right':
        Dialog.confirm({
          message: '确定删除吗？'
        }).then(res => {
          console.log(res)
          that.data.address.splice(index, 1)
          db.collection("ADDRESS").doc(addressId).remove().then(res => {
            console.log(res);
            that.setData({
              address: that.data.address
            })
          }).catch(err => {
            console.log(err)
          })
          instance.close();
        }).catch(err => {
          console.log(err)
          instance.close();
        });
        break;
    }
  },
  newAddress(event) {
    var that = this;
    console.log(event)
    wx.setStorageSync("defaultAddressId", {
      defaultAddressIdStorage: that.data.defaultAddressId
    })
    wx.navigateTo({
      url: '../addressEdit/addressEdit?scence=1',
    })
  },
  selectAddress(event) {
    var that = this
    if (that.data.addressScence!=1){
        return;
    }
    console.log(event)
    var addressId = event.target.dataset.addressid;
    wx.setStorageSync("selectAddressInfo", {
      addressInfoStorage: this.data.address[event.target.dataset.index]
    })
    wx.navigateBack({
      delta: 1
    })
  }
})