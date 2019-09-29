import { mapMutations } from 'vuex'

import Vue from 'vue'
import { CITY } from '../store/mutation-types'

const Location = {
  //转换后的城市
  /*
  city_id: "13"
  city_name: "长沙"
  full_pinyin: "ChangSha"
  is_hot: 1
  is_jm: 0
  is_zy: 1
  joinShopTitle: "蜜匠婚礼策划"
  joinType: 3
  joinTypeName: "蜜匠直营"
  photo: "https://files.mijwed.com/new/city/201706/20170614_B814F8B1A317528A7325484D649E4DAB.png"
  pinyin: "cs"
  tag_id: 0*/
  //转换后的城市
  matchCity: null,
  //定位城市
  loctioncity: null,
  //定位的区、县
  loctiondistrict: null,

  //自己后台所有的城市列表
  citys: null,

  //定位完成后的回调
  callback: null,

  /*请求城市定位
  /* callback : 回调函数，默认为空，有会返回定位的城市
  /* isReLocate : Bool 是否需要重新定位
  /*             --- null,false 如果已经有定位信息不会重新定位 ,跳过
  /*             --- true 强制重新定位
  /*
  */
  //如果有 callback，不会自动存储
  getLocationMatchedCity: (callback, isReLocate) => {
    let settingCity = Vue.prototype.$store.getters.city
    if ((isReLocate === null || !isReLocate) && settingCity) {
      if (callback) {
        callback(settingCity)
      }
      return
    }
    Location.citys = null //防止城市数据没有刷新
    Location.callback = callback
    Location.getMyselfCityList()
    Location.getCoordinate()
  },
  //获取坐标
  //在百度会直接获取到
  getCoordinate: () => {
    uni.getLocation({
      type: 'gcj02',
      success: geo => {
        console.log('location ', geo)
        if (geo.city && geo.district) {
          Location.loctioncity = geo.city
          Location.loctiondistrict = geo.district
          Location.mapperLocation()
        } else {
          Location.gecoderCoordinated(geo.longitude, geo.latitude)
        }
      },
      fail: error => {
        Location.matchCity = {
          city_id: '1',
          city_name: '全国'
        }
        Location.commitCity()
      }
    })
  },

  //获取后台的城市列表
  getMyselfCityList: () => {
    const hosturl = Vue.prototype.environment
      ? 'https://intf.mijwed.com/mijwed'
      : 'https://intf.mijwed.com/zyz'

    uni.request({
      url: `${hosturl}/azsort/city`,
      data: {},
      header: {
        'Content-Type': 'application/json'
      },
      success: function(res) {
        if (
          res &&
          res.statusCode == 200 &&
          res.data &&
          !(res.data.error && res.data.error != 0)
        ) {
          Location.citys = res.data.data.citys
          Location.mapperLocation()
        } else {
          Location.matchCity = {
            city_id: '1',
            city_name: '全国'
          }
          Location.commitCity()
        }
      },
      fail: function(e) {
        Location.matchCity = {
          city_id: '1',
          city_name: '全国'
        }
        Location.commitCity()
      }
    })
  },
  //根据经纬度，地图上逆地理位置
  gecoderCoordinated: (longitude, latitude) => {
    uni.request({
      url: `https://api.map.baidu.com/geocoder/v2/?ak=16IOLqTO3MLG5QixIhKzzzZe8Hp9pW7C&location=${latitude},${longitude}&output=json`,
      data: {},
      header: {
        'Content-Type': 'application/json'
      },
      success: function(res) {
        if (
          res &&
          res.data &&
          res.data.result &&
          res.data.result.addressComponent
        ) {
          const component = res.data.result.addressComponent
          Location.loctioncity = component.city
          Location.loctiondistrict = component.district
          Location.mapperLocation()
        } else {
          Location.matchCity = {
            city_id: '1',
            city_name: '全国'
          }
          Location.commitCity()
        }
      },
      fail: function(e) {
        Location.matchCity = {
          city_id: '1',
          city_name: '全国'
        }
        Location.commitCity()
      }
    })
  },

  //匹配规则：
  // 地图地址：长沙市 长沙县
  // 蜜匠地址：长沙   长沙县
  // 先匹配 长沙县, 长沙县 == 长沙县
  // 在匹配 长沙市, 长沙市 contain 长沙
  mapperLocation: () => {
    //没有获取到定位的 市、区或者县
    if (Location.loctioncity === null && Location.loctiondistrict === null) {
      return
    }
    //没有获取到后台的城市列表
    if (Location.citys === null) {
      return
    }
    //先匹配 区
    let firstMapper = Location.mapperCity(
      Location.citys,
      Location.loctiondistrict,
      true
    )
    if (firstMapper) {
      Location.matchCity = firstMapper
      Location.commitCity()
      return
    }
    //再匹配 市
    firstMapper = Location.mapperCity(
      Location.citys,
      Location.loctioncity,
      false
    )
    if (firstMapper) {
      Location.matchCity = firstMapper
      Location.commitCity()
      return
    }
    //没有找到默认全国
    Location.matchCity = {
      city_id: '1',
      city_name: '全国'
    }
    Location.commitCity()
  },

  //根据地图得到的市、区，转换成自己的city_id,city_name
  // private 外面最好不要直接调用
  mapperCity: (citys, city, isDistrict) => {
    for (let i = 0, len = citys.length; i < len; i++) {
      let section = citys[i]
      for (let j = 0, len2 = section.list.length; j < len2; j++) {
        let item = section.list[j]
        if (isDistrict && city === item.city_name) {
          return item
        }
        if (city.search(item.city_name) != -1) {
          return item
        }
      }
    }
    return null
  },
  //vuex save city
  commitCity: () => {
    if (!Vue.prototype.$store.getters.city) {
      Vue.prototype.$store.commit(CITY, Location.matchCity)
    }
    if (Location.callback) {
      Location.callback(Location.matchCity)
    }
  }
}

export default Location
