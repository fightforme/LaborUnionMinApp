/*
 Requestable {
  baseURL, //host optional
  url, // require
  headers, //  optional
  method, //  optional ,default GET\POST
  body, //  optional
  params, //  optional
  responseType, /  optional
  timeout, //  optional, default 20000
  withCredentials, /  optional
}
*/

let API = {
  //API 列表

  //微信code转换成openid
  jscode2session: (code, appid) => {
    return {
      url: '/wx/api/jscode2session',
      method: 'GET',
      params: {
        js_code: code,
        appid: appid
      }
    }
  },
  //检查是否已经绑定
  userIsBind: openId => {
    return {
      url: '/wx/postsale/inner/isbind',
      method: 'POST',
      body: {
        openid: openId
      }
    }
  },
  //绑定后台账号
  bindUser: (openid, username, password, face) => {
    return {
      url: '/wx/postsale/inner/bind',
      method: 'POST',
      body: {
        openid: openid,
        userName: username,
        passwd: password,
        face: face
      }
    }
  },

  /*********************
   *
   *  酒店商家接口
   *
   *
   *
   *
   **********************/
  //酒店查询条件
  htoelQueryCondition: () => {
    return {
      url: '/hotel/hotel-getQueryCondition'
    }
  },
  //热门酒店列表
  hotHotelBanner: () => {
    return {
      url: '/hotel/banner-adv',
      params: {
        limit: 5
      }
    }
  },
  //根据条件查询酒店列表
  hotelList: (conditions, page) => {
    return {
      url: '/hotel/hotel-search',
      params: {
        conditions: conditions,
        limit: 20,
        page: page
      }
    }
  },
  //热门酒店列表
  hotHotelList: page => {
    return {
      url: '/hotel/hotlist',
      params: {
        limit: 10,
        page: page
      }
    }
  },
  //酒店信息
  hotelInfo: hotelId => {
    return {
      url: '/hotel/getHotelInfo',
      params: {
        hotel_id: hotelId
      }
    }
  },
  //酒店详情信息
  hotelDetailInfo: (hotelId, page) => {
    return {
      url: '/hotel/index',
      params: {
        hotel_id: hotelId,
        page: page,
        limit: 20
      }
    }
  },
  //酒店大厅
  hotelHall: hotelId => {
    return {
      url: '/hotel/getHalls',
      params: {
        hotel_id: hotelId
      }
    }
  },
  //酒店菜单
  hotelMenu: hotelId => {
    return {
      url: '/hotel/getMenus',
      params: {
        hotel_id: hotelId
      }
    }
  },

  /*********************
   *
   *  爆款产品接口
   *
   *
   *
   *
   **********************/
  //最热产品
  hotProductsList: (shop_id, page) => {
    return {
      url: '/ziying/hot/products',
      params: {
        shop_id: shop_id,
        limit: 5,
        page: page
      }
    }
  },
  //产品详情
  productDetail(product_id) {
    return {
      url: '/product/detail',
      params: {
        product_id
      }
    }
  },
  //产品概括
  productSummary(product_id) {
    return {
      url: '/product/detail/summary',
      params: {
        product_id
      }
    }
  },
  //产品参数
  productParams(product_id) {
    return {
      url: '/product/detail/params',
      params: {
        product_id
      }
    }
  },
  //产品相册
  productPhotos(product_id) {
    return {
      url: '/product/detail/photos',
      params: {
        product_id
      }
    }
  },
  //产品评论
  productComment(tag_id, page) {
    return {
      url: '/product/comment',
      params: {
        tag_id,
        page,
        limit: 20
      }
    }
  },

  /*********************
   *
   *  案例接口
   *
   *
   *
   **********************/
  //案例列表
  caseList: (shop_id, tag_id, page) => {
    return {
      url: '/custom-case',
      params: {
        shop_id: shop_id,
        tag_id: tag_id,
        limit: 10,
        page: page
      }
    }
  },
  //案例详情
  caseDetail: album_id => {
    return {
      url: '/case/detail',
      params: {
        album_id
      }
    }
  },

  /*********************
   *
   * 婚礼攻略
   *
   *
   *
   **********************/
  //文章列表
  artilceList: (shop_id, catId, filter, page) => {
    return {
      url: '/article/list',
      params: {
        shop_id,
        catId,
        filter,
        page,
        limit: 10
      }
    }
  },
  //文章详情
  articleDetail: articleId => {
    return {
      url: '  /article/details',
      params: {
        articleId
      }
    }
  },

  /*********************
   *
   * 预约接口
   *
   *
   *
   *
   **********************/
  //酒店预约
  hotelBook: (hotelId, mobile, from, note) => {
    return {
      url: '/hotel/book',
      params: {
        hotelId: hotelId,
        mobile: mobile,
        url: from,
        note: note
      }
    }
  },
  //商家预约
  shopBook: (shop_id, product_id, mobile, from) => {
    return {
      url: '/shop/book',
      params: {
        shop_id: shop_id,
        product_id: product_id,
        mobile: mobile,
        url: from
      }
    }
  },

  //文章预约
  articleBook: (articleId, mobile, from, note) => {
    return {
      url: '/article/book',
      params: {
        articleId: articleId,
        mobile: mobile,
        url: from,
        note: note
      }
    }
  },

  /*********************
   *
   * 城市接口
   *
   *
   *
   *
   **********************/
  //排序城市列表
  azsortCity: () => {
    return {
      url: 'azsort/city'
    }
  }
}

module.exports = API
