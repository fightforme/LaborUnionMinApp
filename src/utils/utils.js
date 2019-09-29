const Utils = {

  dateFormat:(fmt,date) =>   { //author: meizz
    let k
    let format = fmt

    let o = {
      "M+" : date.getMonth()+1,                 //月份
      "d+" : date.getDate(),                    //日
      "h+" : date.getHours(),                   //小时
      "m+" : date.getMinutes(),                 //分
      "s+" : date.getSeconds(),                 //秒
      "q+" : Math.floor((date.getMonth()+3)/3), //季度
      "S"  : date.getMilliseconds()             //毫秒
    }

    if (/(y+)/.test(format)) {
      format=format.replace(RegExp.$1, `${date.getFullYear()}`.substr(4 - RegExp.$1.length));
    }
    // eslint-disable-next-line no-restricted-syntax
    for (k in o) {
      if (new RegExp(`(${k})`).test(format)) {
        format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : `00${o[k]}`.substr(String(o[k]).length));
      }
    }
    return format;
  },

  //2018-10-07 00:00 格式时间格式化
  yearToMinuteTimeFormat:(date) => {
    let now = new Date()
    if (date) {
      now = date
    }
    return Utils.dateFormat("yyyy-MM-dd hh:mm",now)
  },

  //2018-10-07 00:00:00 格式时间格式化
  yearToSecondsTimeFormat:(date) => {
    let now = new Date()
    if (date) {
      now = date
    }
    return Utils.dateFormat("yyyy-MM-dd hh:mm:ss",now)
  },

  //图片选择
  chooseImage:() => {

  },

  /**
   * 获取时间 得到一个对象
   * @param {时间戳 可以是10位 可以说13位} timestamp
   */
  timestampToTime:(timestamp) => {
    var date = new Date(`${timestamp}`.length === 10 ? timestamp * 1000 : timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var newDate = {};
    newDate.Y = date.getFullYear();
    newDate.M = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
    newDate.D = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    newDate.h = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
    newDate.m = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
    newDate.s = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();
    return newDate;
    //2014-06-18 10:33:24   Y+M+D+h+m+s;
  },

  mobile_verify: function (mobile) {
    return /^1\d{10}$/.test(mobile)
  },

  //获取网页参数
  getQuery() {
    /* 获取当前路由栈数组 */
    const pages = getCurrentPages()
    const currentPage = pages[pages.length - 1]
    let options = {}
    if (!(currentPage === null) && !(currentPage.options === null)) {
      return currentPage.options
    }
    return options
  },

  mobileVerify(mobile) {
    // 手机号验证
    if (mobile == '') {
      uni.showToast({icon: 'none', title: '请填写你的手机号'});
      return true;
    } if (!/^1\d{10}$/.test(mobile)) {
      uni.showToast({icon: 'none', title: '请填写正确的手机号'});
      return true;
    }
    return false;
  },
  productNull(id, isProduct) {
    // 无id
    if (!id) {
      if (isProduct) {
        uni.redirectTo({
          url: '/pages/products/main'
        });
      } else {
        uni.redirectTo({
          url: '/pages/casedetail/main'
        });

      }
      return true;
    }
    return false;
  },
  formatDate: function (value) {
    // 时间格式
    let date = new Date(value - 0);
    let y = date.getFullYear();
    let MM = date.getMonth() + 1;
    MM = MM < 10 ? `0${MM}` : MM;
    let d = date.getDate();
    d = d < 10 ? `0${d}` : d;
    let h = date.getHours();
    h = h < 10 ? `0${h}` : h;
    let m = date.getMinutes();
    m = m < 10 ? `0${m}` : m;
    let s = date.getSeconds();
    s = s < 10 ? `0${s}` : s;
    return `${y}-${MM}-${d} ${h}:${m}:${s}`;
  }


}
export default Utils