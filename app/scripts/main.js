/*global app, $*/

//var APIServerHost= 'http://120.26.48.150:8089/';
//var APIServerHost= 'http://pay.houqinbao.com:8089/';
var APIServerHost= 'http://121.41.82.81:8090/';

window.App = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  g:{
    openId:null,  //微信id
    universityId:null,  //学校id
    studentIdentity:null,  //universityId+'_'+openId
    accessToken:null,  //accessToken
    headImage:null, //headImage头像
    userFlatModel:null, //App.Models.UserFlatModel
    payMode:null, //支付方式
    venderInterface:null, //厂商接口
    flatList:null,  //App.Collections.FlatList 学生所在学校楼栋列表
    areaId:null,  //当前生活区id
    areaName:null,  //当前生活区名称
    flatId:null,  //当前楼栋id
    flatName:null,  //当前楼栋名称
    balanceAmount:null, //剩余金额
    balanceMeterReading:null, //可用度数
    historyList:null, //App.Collections.HistoryList 历史缴费列表
    unPayedBillHistoryList:null, //App.Collections.UnPayedBillHistoryList 历史欠费列表
    unPayedBillList:null, //App.Collections.UnPayedBillList 未缴费列表
  },
  loading: function loading(status) {
    if (status) {
      $('#loading').addClass('show').removeClass('hide');
    } else {
      $('#loading').addClass('hide').removeClass('show');
    }
  },
  URL: {
    Token:'http://121.40.49.110/Token',
    //Token:'http://120.26.48.150:82/Geese.Houqinbao.Auth/Token',
    ChangeOrder:APIServerHost + 'api/order/waitpayconfirm?orderNo=',
    SFB:APIServerHost + 'api/studentflat/sfb/',
    FLAT:APIServerHost + 'api/studentflat/la/',
    HISTORY:APIServerHost + 'api/order/ordersofroom/',
    WPP:APIServerHost + 'api/order/wpp',
    MODE:APIServerHost + 'api/studentflat/billingmode/',
    UNPAID:APIServerHost + 'api/bill/unpayed/',
    UNPAIDHIS:APIServerHost + 'api/bill/unpayedhistory/',
    USERFLAT:APIServerHost + 'api/studentflat/sf'
    
  },
  init: function () {
    'use strict';
    new this.Routers.Route();
    Backbone.history.start();
  }
};

$(document).ready(function () {
  'use strict';
  App.init();
});

Date.prototype.Format = function (fmt) { //author: meizz 
  var o = {
    "M+": this.getMonth() + 1, //月份 
    "d+": this.getDate(), //日 
    "h+": this.getHours(), //小时 
    "m+": this.getMinutes(), //分 
    "s+": this.getSeconds(), //秒 
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
    "S": this.getMilliseconds() //毫秒 
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
  if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}
Date.prototype.CHWeek = function(){
  switch (this.getDay()) {
    case 0: return '星期日';
    case 1: return '星期一';
    case 2: return '星期二';
    case 3: return '星期三';
    case 4: return '星期四';
    case 5: return '星期五';
    case 6: return '星期六';
  }
}