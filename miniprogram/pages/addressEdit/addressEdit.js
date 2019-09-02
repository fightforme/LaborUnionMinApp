// miniprogram/pages/addressEdit/addressEdit.js
var tcity = require("citys.js");
var db = wx.cloud.database();
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

    selectList: ['是', '否'],
    isDefault: '否',
    
    //完整的地址信息
    allAddressInfo:'',

   // 默认地址的id
    defaultAddressId: '',


   // 需要编辑的地址信息项
    region: ['湖南省', '长沙市', '芙蓉区'],
    postCode: '410011',
    provinceName: '湖南省',
    cityName: '长沙市',
    countyName: '芙蓉区',
    scence: '',
    addressInfo: '',
    userName: '',
    detailInfo: '',
    telNumber: '',
    
    //地址收货信息
    addressInfo1:{
      postalCode: '',
      provinceName: '',
      cityName: '',
      countyName: '',
      userName: '',
      detailInfo: '',
      telNumber: '',
    }
  },
  bindIsDefault: function(event) {
    console.log(event.detail.value);
    this.setData({
      isDefault: this.data.selectList[event.detail.value]
    })
  },
  userName(event) {
    this.setData({
      userName: event.detail
    })
  },
  telNumber(event) {
    this.setData({
      telNumber: event.detail
    })
  },
  detailInfo(event) {
    this.setData({
      detailInfo: event.detail
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options.scence)
    var addressInfo;
    var provinceName;
    var cityName;
    var countyName;
    var that = this;
    var region = [];
    var postalCode = '';
    var userName = '';
    var detailInfo = '';
    var isDefault = '';
    var telNumber = '';
    if (options.scence == 1) {
      var defaultAddressId = wx.getStorageSync('defaultAddressId').defaultAddressIdStorage
      that.setData({
        scence: options.scence,
        defaultAddressId: defaultAddressId
      })
      wx.removeStorageSync('defaultAddressId')
    } else {
      var editAddressInfo = wx.getStorageSync("editAddressInfo")
      var addressInfoStorage = editAddressInfo.addressInfoStorage;
      var defaultAddressId = editAddressInfo.defaultAddressIdStorage;
      addressInfo = addressInfoStorage.ADDRESS_INFO;
      that.data.allAddressInfo = addressInfoStorage;
      provinceName = addressInfo.provinceName;
      cityName = addressInfo.cityName;
      countyName = addressInfo.countyName;
      region = [provinceName, cityName, countyName];
      postalCode = addressInfo.postalCode;
      userName = addressInfo.userName;
      detailInfo = addressInfo.detailInfo;
      telNumber = addressInfo.telNumber;
      isDefault = addressInfoStorage.IS_DEFAULT;
      that.setData({
        provinceName: provinceName,
        cityName: cityName,
        countyName: countyName,
        addressInfo: addressInfo,
        region: region,
        postCode: postalCode,
        userName: userName,
        detailInfo: detailInfo,
        telNumber: telNumber,
        isDefault: isDefault,
        scence: options.scence,
        defaultAddressId: defaultAddressId
      })
      wx.removeStorageSync('editAddressInfo');
    }
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

  },
  bindRegionChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail)
    this.setData({
      region: e.detail.value,
      postCode: e.detail.postcode,
      provinceName: e.detail.value[0],
      cityName: e.detail.value[1],
      countyName: e.detail.value[2]
    })
  },

  saveAddress() {
    var that = this
    wx.showLoading({
      title: '地址信息提交中···',
    })
    if (this.data.userName == '') {
      wx.hideLoading();
      wx.showToast({
        title: '请输入收货人姓名',
        icon: 'none',
      })
      return
    }else if(this.data.telNumber == ''){
      wx.hideLoading();
      wx.showToast({
        title: '请输入收货人手机号码',
        icon: 'none',
      })
      return
    }else if(this.data.provinceName == ''){
      wx.hideLoading();
      wx.showToast({
        title: '请输入所在省份',
        icon: 'none',
      })
      return
    }else if(this.data.cityName == ''){
      wx.hideLoading();
      wx.showToast({
        title: '请输入所在市',
        icon: 'none',
      })
      return
    }else if(this.data.countyName == ''){
      wx.hideLoading();
      wx.showToast({
        title: '请输入所在区/县',
        icon: 'none',
      })
      return
    } else if (this.data.detailInfo == '') {
      wx.hideLoading();
      wx.showToast({
        title: '请输入详细地址',
        icon: 'none',
      })
      return
    } 
     this.data.addressInfo1.userName = this.data.userName;
     this.data.addressInfo1.provinceName= this.data.provinceName;
     this.data.addressInfo1.cityName = this.data.cityName;
     this.data.addressInfo1.countyName = this.data.countyName;
     this.data.addressInfo1.detailInfo = this.data.detailInfo;
    this.data.addressInfo1.postalCode = this.data.postCode;
     this.data.addressInfo1.telNumber = this.data.telNumber;
    //若新建或编辑的地址为默认地址
    if(this.data.isDefault == '是'){
       // 若为新建地址，同时不存在默认地址，同时设置地址为默认地址，则需要新加改地址为默认地址
      if(this.data.defaultAddressId == ''&&this.data.scence == '1'){
        db.collection("ADDRESS").add({
          data:{
               ADDRESS_INFO: that.data.addressInfo1,
               CREATE_DATE : new Date(),
               UPDATE_DATE:new Date(),
               IS_DEFAULT:"是"
          }
        }).then(res=>{
          console.log(res)
          wx.hideLoading();
          wx.showToast({
            title: '提交成功',
            icon: 'success',
          })
          wx.navigateBack({
            delta: 1
          })
        }).catch(err=>{
          console.log(err)
          wx.hideLoading();
          wx.showToast({
            title: '提交失败',
            icon: 'none',
          })
        })
        //若为新建地址，同时存在默认地址，在新加地址的同时，将原默认地址设置为非默认地址
      } else if (this.data.defaultAddressId != '' && this.data.scence == '1'){
        db.collection("ADDRESS").add({
          data: {
            ADDRESS_INFO: that.data.addressInfo1,
            CREATE_DATE: new Date(),
            UPDATE_DATE: new Date(),
            IS_DEFAULT: "是"
          }
        }).then(res=>{
          db.collection("ADDRESS").doc(that.data.defaultAddressId).update({
            data: {
              IS_DEFAULT: "否"
            }
          }).then(res=>{
            console.log(res)
            wx.hideLoading();
            wx.showToast({
              title: '提交成功',
              icon: 'success',
            })
            wx.navigateBack({
              delta: 1
            })
          }).catch(err=>{
            console.log(err)
            wx.hideLoading();
            wx.showToast({
              title: '提交失败',
              icon: 'none',
            })
          })
        }).catch(err=>{
          console.log(err)
          wx.hideLoading();
          wx.showToast({
            title: '提交失败',
            icon: 'none',
          })
        })
        //若为编辑地址，同时默认地址为本地址，则只需要更新自己
      } else if (this.data.scence == '2'&& this.data.defaultAddressId != ''&&this.data.defaultAddressId == this.data.allAddressInfo._id){
        db.collection("ADDRESS").doc(that.data.defaultAddressId).update({
          data:{
             ADDRESS_INFO:that.data.addressInfo1,
             UPDATE_DATE:new Date()
          }
        }).then(res=>{
           console.log(res)
          wx.hideLoading();
          wx.showToast({
            title: '提交成功',
            icon: 'success',
          })
          wx.navigateBack({
            delta: 1
          })
        }).catch(err=>{
           console.log(err)
          wx.hideLoading();
          wx.showToast({
            title: '提交失败',
            icon: 'none',
          })
          wx.navigateBack({
            delta: 1
          })
        })
      }
      //若为编辑地址，同时默认地址不是为自己，则需要更新自己为默认地址，同时取消原默认地址的默认属性
      else if (this.data.scence == '2'  && this.data.defaultAddressId != this.data.allAddressInfo._id){
        db.collection("ADDRESS").doc(that.data.allAddressInfo._id).update({
          data: {
            ADDRESS_INFO: that.data.addressInfo1,
            UPDATE_DATE: new Date(),
            IS_DEFAULT:"是"
          }
         }).then(res=>{
              console.log(res)
           if (that.data.defaultAddressId!=""){
             db.collection("ADDRESS").doc(that.data.defaultAddressId).update({
               data: {
                 IS_DEFAULT: "否"
               }
             }).then(res=>{
               console.log(res)
               wx.hideLoading();
               wx.showToast({
                 title: '提交成功',
                 icon: 'success',
               })
               wx.navigateBack({
                 delta: 1
               })
             }).catch(err=>{
               console.log(err)
               wx.hideLoading();
               wx.showToast({
                 title: '提交失败',
                 icon: 'none',
               })
             })
           }
         }).catch(err=>{
             console.log(err)
           wx.hideLoading();
           wx.showToast({
             title: '提交失败',
             icon: 'none',
           })
         })
      }
    } else if (this.data.isDefault == '否' || this.data.isDefault == ''){
        if(that.data.scence == '1'){
          db.collection("ADDRESS").add({
            data:{
              ADDRESS_INFO:that.data.addressInfo1,
              CREATE_DATE:new Date(),
              UPDATE_DATE:new Date(),
              IS_DEFAULT:"否"
            }
          }).then(res=>{
              console.log(res)
            wx.hideLoading();
            wx.showToast({
              title: '提交成功',
              icon: 'success',
            })
            wx.navigateBack({
              delta: 1
            })
          }).catch(err=>{
             console.log(err)
            wx.hideLoading();
            wx.showToast({
              title: '提交失败',
              icon: 'none',
            })
          })
        }else{
           db.collection("ADDRESS").doc(that.data.allAddressInfo._id).update({
             data:{
               ADDRESS_INFO: that.data.addressInfo1,
               UPDATE_DATE: new Date(),
               IS_DEFAULT: "否"
             }
           }).then(res=>{
             console.log(res)
             wx.hideLoading();
             wx.showToast({
               title: '提交成功',
               icon: 'success',
             })
             wx.navigateBack({
               delta : 1
             })
           }).catch(err=>{
             console.log(err)
             wx.hideLoading();
             wx.showToast({
               title: '提交失败',
               icon: 'none',
             })
           })
        }
    }

      
  }
})