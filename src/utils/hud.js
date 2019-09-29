const HUD = {

  //showTips
  showTips: (content) => {
    console.log("showTips",content)
    uni.showToast({
      title: content,
      icon: "none",
      duration: 3000
    })
  },

  /* 只显示确定按钮
   * @param [Object]  params  title:标题  content：内容  cbconfirm ：回调函数
   {
     title: String
     content：String
     isCancel: Bool
     cbconfirm：确定回调
     cbcancel : 取消回调
   }
   */
  showAlert: (params) => {
    var title = params && params.hasOwnProperty('title') ? params['title'] : '';
    var content = params && params.hasOwnProperty('content') ? params['content'] : '';

    wx.showModal({
      title: title,
      content: content,
      showCancel: false,
      success: function (res) {
        if (res.confirm) { //用户点击确定
          if (params && params.hasOwnProperty('cbconfirm') && typeof params.cb_confirm == "function") {
            params.cbconfirm();
          }
        }
      }
    })
  },
  /* mark hud
   * @param [Object]  params  title:标题  content：内容  cbconfirm ：回调函数
   {
     mask : Bool
     title: String
   }
   */
  showHUD: (params) => {
    // eslint-disable-next-line no-eq-null
    if (params == null) {
      uni.showLoading({
        mask: true,
        title: '加载中...'
      });
    } else {
      uni.showLoading({
        mask: params && params.hasOwnProperty('mask') ? params['mask'] : true,
        title: params && params.hasOwnProperty('title') ? params['title'] : '加载中...'
      });
    }

  },
  /* mark hud
    dismiss
   */
  dismissHUD: () => {
    uni.hideLoading()
  },
  /*
  error {
    code:
    msg:
  }
  */
  showError: (error) => {
    console.log("showError",error)
    HUD.showTips(error.msg)
  }

}

export default HUD