/*global App, Backbone*/

App.Routers = App.Routers || {};

(function () {
  'use strict';

  App.Routers.Route = Backbone.Router.extend({
    routes: {
      'index?:openId&:universityId': 'init',
      'index': 'index',//&:hqbOpenId&:VenderInterface&:code&:state
      'beforePayNoFactory': 'beforePayNoFactory',
      'afterIndex': 'afterIndex',
      'afterIndexNoBill': 'afterIndexNoBill',
      'afterNoPay': 'afterNoPay',
      'roomBind':'roomBind',
      'history': 'history',//2
      'historyDetail/:id':'historyDetail',
      'paymentList/:id':'paymentList',
      'beforePayNoFactoryHistory': 'beforePayNoFactoryHistory'//1
    },
    init: function(openId,universityId){
      console.log(openId);
      console.log(universityId);
      
      App.loading(true);
      var _selfthis=this;
      $.ajax({
        url:App.URL.Token,
        data:{
          grant_type:'password',
          username:openId,
          password:universityId,
          client_id:'wx'
        },
        type:'POST',
        dataType:'JSON',
        success:function(response){
          var result = JSON.parse(response);
          if(result && result.access_token){
            App.g.openId=openId;
            App.g.universityId=universityId;
            App.g.universityName=result.universityName;
            App.g.studentIdentity=universityId+'_'+openId;
            App.g.accessToken=result.access_token;
            App.g.headImage = result.headImg;
            
            //获取楼栋信息
            _selfthis.getFlat();
            
          }else{
            $.tips({
              content:'初始化失败，服务器出错！',
              stayTime:2000,
              type:"warn"
            });
            App.loading();
          }
        },error:function(){
          $.tips({
            content:'登录失败，请重试！',
            stayTime:2000,
            type:"warn"
          });
          App.loading();
        }
      });
    },
    
    getFlat: function(){
      var _selfthis=this;
      $.ajax({
        url: App.URL.FLAT + App.g.universityId,
        type: 'GET',
        dataType: 'JSON',
        success: function success(response) {
          var result = JSON.parse(response);
          if (result.Status === "SUCCESS") {
            if (result.Message === 'NOTFOUND') {
              $.tips({
                content: '暂无楼栋信息，请稍后重试！',
                stayTime: 2000,
                type: "warn"
              });
              return;
            }
            App.g.flatList=new App.Collections.FlatList();
            for(var i=0,ilen=result.Data.Areas.length;i<ilen;i++){
              App.g.flatList.push(result.Data.Areas[i]);
            }
            //判断学校付费方式
            _selfthis.judgeMode();
          }else{
            $.tips({
              content:'初始化失败，服务器出错！',
              stayTime:2000,
              type:"warn"
            });
            App.loading();
          }
        }, error: function error() {
          $.tips({
            content: '获取楼栋信息失败，请重试！',
            stayTime: 2000,
            type: "warn"
          });
          //Backbone.history.navigate('#', {trigger: true});
          App.loading();
        }
      });
    },
    
    judgeMode: function(){
      var _selfthis=this;
      $.ajax({
        url: App.URL.SFB + App.g.studentIdentity+'/'+App.g.universityId,
        type: 'GET',
        dataType: 'JSON',
        success: function success(response) {
          var result = JSON.parse(response);
          if (result.Status === "SUCCESS") {
            if (result.Message === 'NOTFOUND') {
              Backbone.history.navigate('#roomBind', {trigger: true});
              return;
            }
            App.g.userFlatModel = new App.Models.UserFlatModel(result.Data.FlatInfo);
            App.g.payMode = result.Data.FlatInfo.PayMode;
            App.g.venderInterface = result.Data.FlatInfo.VenderInterface;
            
            switch(App.g.payMode){
              case 0://前付费
                switch(App.g.venderInterface){
                  case 1://有查询接口 未做
                    break;

                  case 2://有支付接口
                    // Backbone.history.navigate('#beforePayNoFactory', {trigger: true});
                    _selfthis.beforePayNoFactory();
                    break;

                  case 3://有查询和支付接口
                    App.g.balanceAmount=result.Data.BalanceAmount;
                    App.g.balanceMeterReading=result.Data.BalanceMeterReading;
                    // Backbone.history.navigate('#index', {trigger: true});
                    _selfthis.index();
                    break;
                  
                  default:break;
                }
                break;
              case 1://后付费
                switch(App.g.venderInterface){
                  case 1://有查询接口
                    // Backbone.history.navigate('#afterNoPay', {trigger: true});
                    _selfthis.afterNoPay();
                    break;

                  case 2://有支付接口 未做
                    break;

                  case 3://有查询和支付接口
                    // Backbone.history.navigate('#afterIndex', {trigger: true});
                    _selfthis.afterIndex();
                    break;

                  default:break;
                }
                break;
              default:break;
            }
            App.loading();
          }else{
            $.tips({
              content: '获取缴费历史失败，服务器出错！',
              stayTime: 2000,
              type: "warn"
            });
            Backbone.history.navigate('#', {trigger: true});
            App.loading();
          }
        }, error: function error() {
          $.tips({
            content: '获取支付方式失败，请重试！',
            stayTime: 2000,
            type: "warn"
          });
          //Backbone.history.navigate('#', {trigger: true});
          App.loading();
        }
      });
    },
    
    index: function(){
      $('.ui-header').addClass('hide');
      var index = new App.Views.Index();
      $('section').addClass('hide');
      $('#index').removeClass('hide');
    },
    
    beforePayNoFactory: function(){
      $('.ui-header').removeClass('hide');
      $('.ui-header h1').text('水电费充值');
      $('.ui-header .ui-personal').removeClass('hide');
      new App.Views.BeforePayNoFactory();
      $('section').addClass('hide');
      $('#beforePayNoFactory').removeClass('hide');
    },
    
    afterIndex: function(){
      $('.ui-header').addClass('hide');
      new App.Views.AfterIndex();
      $('section').addClass('hide');
      $('#afterIndex').removeClass('hide');
    },
    
    afterIndexNoBill: function(){
      $('.ui-header').addClass('hide');
      new App.Views.AfterIndexNoBill();
      $('section').addClass('hide');
      $('#afterIndexNoBill').removeClass('hide');
    },
    
    afterNoPay: function(){
      $('.ui-header').addClass('hide');
      new App.Views.AfterNoPay();
      $('section').addClass('hide');
      $('#afterNoPay').removeClass('hide');
    },
    
    roomBind: function(){
      $('.ui-header').removeClass('hide');
      $('.ui-header h1').text('寝室绑定');
      $('.ui-header .ui-personal').addClass('hide');
      new App.Views.RoomBind();
      $('section').addClass('hide');
      $('#roomBind').removeClass('hide');
    },
    
    history: function(){
      $('.ui-header').removeClass('hide');
      $('.ui-header h1').text('充缴费历史');
      $('.ui-header .ui-personal').addClass('hide');
      new App.Views.History();
      $('section').addClass('hide');
      $('#history').removeClass('hide');
    },
    
    historyDetail: function(id){
      $('.ui-header').removeClass('hide');
      $('.ui-header h1').text('充缴费详情');
      $('.ui-header .ui-personal').addClass('hide');
      new App.Views.HistoryDetail(id);
      $('section').addClass('hide');
      $('#historyDetail').removeClass('hide');
    },
    
    beforePayNoFactoryHistory: function(){
      $('.ui-header').removeClass('hide');
      $('.ui-header h1').text('充缴费历史');
      $('.ui-header .ui-personal').addClass('hide');
      new App.Views.BeforePayNoFactoryHistory();
      $('section').addClass('hide');
      $('#beforePayNoFactoryHistory').removeClass('hide');
    },
    
    paymentList: function(id){
      $('.ui-header').removeClass('hide');
      $('.ui-header h1').text('详情');
      $('.ui-header .ui-personal').addClass('hide');
      new App.Views.PaymentList(id);
      $('section').addClass('hide');
      $('#paymentList').removeClass('hide');
    }
  });

})();
