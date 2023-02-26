// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    region:["北京市","北京市","东城区"],
    province:"北京市",
    city:"北京市",
    town:"东城区",
    now:{icon:"head"},
    loc:""
  },
  // 事件处理函数
  changeRegion:function(e){
    this.setData({
      region:e.detail.value
    })
    this.getWeather();
  },

  getWeatherFirst:function () {
    var that = this
    console.log(that.data.loc)
    wx.request({
      url: 'https://geoapi.qweather.com/v2/city/lookup?',
      data:{
        location:that.data.locat,
        key:'0ffc31e516854cf2bdc9139baac450dc'
      },
      success:function(res){    //如果城市ID找到了，则找对应ID的城市详细信息
        that.setData({
          Place_ID:res.data.location[0].id,
          region:[res.data.location[0].adm1,res.data.location[0].adm2,res.data.location[0].name]
        })  //将城市ID用变量存储
          console.log(res.data);
        wx.request({            //寻找城市的详细信息
          url: 'https://devapi.qweather.com/v7/weather/now?',
          data: {
            location:that.data.Place_ID,
            key:'0ffc31e516854cf2bdc9139baac450dc'
          },
          success:function(res){     //如果找到了
             console.log(res.data)
            that.setData({
              now:res.data.now})    //将详细信息用Place_Message存储
          }
        })
      }
    })
  },

  getWeather:function() {
    var that=this;    //this不可以直接在wxAPI中使用
    wx.request({      //寻找城市ID
      url: 'https://geoapi.qweather.com/v2/city/lookup?',
      data:{
        location:that.data.region[2],
        key:'0ffc31e516854cf2bdc9139baac450dc'
      },
      success:function(res){    //如果城市ID找到了，则找对应ID的城市详细信息
        that.setData({Place_ID:res.data.location[0].id})  //将城市ID用变量存储
          console.log(res.data);
        wx.request({            //寻找城市的详细信息
          url: 'https://devapi.qweather.com/v7/weather/now?',
          data: {
            location:that.data.Place_ID,
            key:'0ffc31e516854cf2bdc9139baac450dc'
          },
          success:function(res){     //如果找到了
             console.log(res.data)
            that.setData({now:res.data.now})    //将详细信息用Place_Message存储
          }
        })
      }
    })
  },
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad() {
    var that = this
    wx.getLocation({
      success:function(res){
        var x = res.longitude.toString()
        var y = res.latitude.toString()
        that.data.locat=x+","+y
         console.log(that.data.locat)
        that.getWeatherFirst()
      },
      fail(){that.getWeather()}
    })
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
