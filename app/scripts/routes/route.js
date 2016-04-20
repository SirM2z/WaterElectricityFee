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
      'afterNoPay': 'afterNoPay',
      'roomBind':'roomBind',
      'history': 'history',
      'historyDetail':'historyDetail',
      'paymentList':'paymentList',
      'beforePayNoFactoryHistory': 'beforePayNoFactoryHistory'
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
            App.g.studentIdentity=universityId+'_'+openId;
            App.g.accessToken=result.access_token;
            App.g.headImage = result.headImg;
            
            //判断学校付费方式
            _selfthis.judgeMode();
            
          }else{
            $.tips({
              content:'初始化失败，请稍后重试！',
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
    
    judgeMode: function(){
      var _selfthis=this;
      $.ajax({
        url: App.URL.SFB + App.g.studentIdentity+'/'+App.g.universityId,
        type: 'GET',
        dataType: 'JSON',
        success: function success(response) {
          var result = JSON.parse(response);
          if (result.Status == "SUCCESS") {
            App.g.userFlatModel = new App.Models.UserFlatModel(result.Data.FlatInfo);
            App.g.payMode = result.Data.FlatInfo.PayMode;
            App.g.venderInterface = result.Data.FlatInfo.VenderInterface;
            
            
            switch(App.g.payMode){
              case 0://前付费
                switch(App.g.venderInterface){
                  case 1://有查询接口
                    break;

                  case 2://有支付接口
                    _selfthis.beforePayNoFactory();
                    break;

                  case 3://有查询和支付接口
                    _selfthis.index();
                    break;
                  
                  default:break;
                }
                break;
              case 1://后付费
                switch(App.g.venderInterface){
                  case 1://有查询接口
                    _selfthisafterNoPay
                    break;

                  case 2://有支付接口                                                    
                    break;

                  case 3://有查询和支付接口
                    _selfthis.afterIndex();
                    break;

                  default:break;
                }
                break;
              default:break;
            }
          }
          if (response.Message === 'NOTFOUND' && App.g.venderInterface !== 1 && App.g.venderInterface !== 2) {
            Backbone.history.navigate('#roomBind', {trigger: true});
          }
          if(App.g.venderInterface !== 2) {
            
          }
          if(App.g.venderInterface === 2){
            
          }
          App.loading();
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
      new App.Views.Index();
      this.hidesection();
      $('#index').removeClass('hide')
    },
    
    beforePayNoFactory: function(){
      $('.ui-header').removeClass('hide');
      $('.ui-header h1').text('水电费充值');
      $('.ui-header .ui-personal').removeClass('hide');
      new App.Views.BeforePayNoFactory();
      this.hidesection();
      $('#beforePayNoFactory').removeClass('hide')
    },
    
    afterIndex: function(){
      $('.ui-header').addClass('hide');
      new App.Views.AfterIndex();
      this.hidesection();
      $('#afterIndex').removeClass('hide')
    },
    
    afterNoPay: function(){
      $('.ui-header').addClass('hide');
      new App.Views.AfterNoPay();
      this.hidesection();
      $('#afterNoPay').removeClass('hide')
    },
    
    roomBind: function(){
      $('.ui-header').removeClass('hide');
      $('.ui-header h1').text('寝室绑定');
      $('.ui-header .ui-personal').addClass('hide');
      new App.Views.RoomBind();
      this.hidesection();
      $('#roomBind').removeClass('hide')
    },
    
    history: function(){
      $('.ui-header').removeClass('hide');
      $('.ui-header h1').text('充缴费历史');
      $('.ui-header .ui-personal').addClass('hide');
      new App.Views.History();
      this.hidesection();
      $('#history').removeClass('hide')
    },
    
    historyDetail: function(){
      $('.ui-header').removeClass('hide');
      $('.ui-header h1').text('充缴费详情');
      $('.ui-header .ui-personal').addClass('hide');
      new App.Views.HistoryDetail();
      this.hidesection();
      $('#historyDetail').removeClass('hide')
    },
    
    beforePayNoFactoryHistory: function(){
      $('.ui-header').removeClass('hide');
      $('.ui-header h1').text('充缴费历史');
      $('.ui-header .ui-personal').addClass('hide');
      new App.Views.BeforePayNoFactoryHistory();
      this.hidesection();
      $('#beforePayNoFactoryHistory').removeClass('hide')
    },
    
    paymentList: function(){
      $('.ui-header').removeClass('hide');
      $('.ui-header h1').text('详情');
      $('.ui-header .ui-personal').addClass('hide');
      new App.Views.PaymentList();
      this.hidesection();
      $('#paymentList').removeClass('hide')
    },
    
    hidesection: function(){
      $('section').addClass('hide');
    }
  });

})();
