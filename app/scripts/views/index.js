/*global App, Backbone, JST*/

App.Views = App.Views || {};

(function () {
  'use strict';

  App.Views.Index = Backbone.View.extend({

    template: JST['app/scripts/templates/index.ejs'],

    tagName: 'div',
    
    el:'#index',

    events: {
      'click .ui-btn-select':'paySelect',
      'click .charge-btn':'paySure',
      'click .ui-icon-close':'clearInput',
      'click .cancle':'canclePay',
      'click .pay-confirm':'payConfirm',
      'click .success-pay-sure':'surePay',
      'click .success-pay-history':'surePayHistory'
    },
    
    balanceAmount:null,
    
    balanceMeterReading:null,
    
    chargeMoney:null,

    initialize: function () {
      //this.listenTo(this.model, 'change', this.render);
      this.$el.off();
      
      this.balanceAmount=App.g.balanceAmount;
      this.balanceMeterReading=App.g.balanceMeterReading;
      
      this.render();
    },

    render: function () {
      this.$el.html(this.template({
        balanceAmount:this.balanceAmount,
        balanceMeterReading:this.balanceMeterReading
      }));
    },
    
    paySelect: function(event){
      var _this=$(event.target);
      $('.ui-btn-select.active').removeClass('active');
      _this.addClass('active');
      if(!_this.data('number')){
        $('.pay-other').removeClass('hide')
      }else{
        $('.pay-other').addClass('hide')
      }
    },
    
    clearInput: function(){
      $('#pay-num').val('');
    },
    
    paySure: function(){
      var selectBtn=$('.ui-btn-select.active');
      var chargeMoney='';
      if(selectBtn.length===0){
        $.tips({
          content:'请选择充值金额！',
          stayTime:2000,
          type:"warn"
        });
        return;
      }
      if(!selectBtn.data('number')){
        chargeMoney=$('#pay-num').val().trim();
        if(chargeMoney.length<1){
          $.tips({
            content:'请填写充值金额！',
            stayTime:2000,
            type:"warn"
          });
          return;
        }
      }else{
        chargeMoney=selectBtn.data('number');
      }
      
      //ajax
      // console.log(chargeMoney);
      this.chargeMoney=chargeMoney;
      var str='您确定要为'+App.g.userFlatModel.get('AreaName')+'-'+App.g.userFlatModel.get('FlatName')+'-'+App.g.userFlatModel.get('RoomId')+'充值'+chargeMoney+'元电费吗？'
      $('.pay-sure .ui-dialog-bd div').text(str);
      $('.pay-sure').dialog("show");
    },
    
    canclePay: function(){
      $('.pay-sure').dialog("hide");
    },
    
    payConfirm: function(){
      var billId=0;
      var payItem = '水电费充值: ';
      var itemDesc = '水电费充值';
      App.loading(true);
      var _selfthis=this;
      $.ajax({
        url:App.URL.WPP,
        data:{
          Description: payItem + App.g.userFlatModel.get('AreaName') + '-' + App.g.userFlatModel.get('FlatName') + '-' + App.g.userFlatModel.get('RoomId'),
					ItemDescription:itemDesc,
					AttachData: App.g.userFlatModel.get('AreaId') + '-' + App.g.userFlatModel.get('FlatId') + '-' + App.g.userFlatModel.get('RoomId'),
					OrderType:App.g.payMode === 0?'POWER':'POWERPOST',
          TotalFee:_selfthis.chargeMoney*100,
					BillId:billId,
					HqbOpenId:App.g.hqbOpenId,
					OpenId: App.g.openId,
          UniversityId: App.g.universityId,
          AccessToken: App.g.accessToken
        },
        type:'POST',
        dataType:'JSON',
        success:function(response){
          var result = JSON.parse(response);
          if(result.Status === "SUCCESS"){
            App.g.orderNo=result.Data.OrderNo;
            App.g.payParams=result.Data.PayParams;
            //调用微信支付接口
            _selfthis.weixinPay();
          }else{
            $.tips({
              content:'服务器出错,请稍后重试！',
              stayTime:2000,
              type:"warn"
            });
            App.loading();
          }
        },error:function(){
          $.tips({
            content:'充值失败，请刷新重试！',
            stayTime:3000,
            type:"warn"
          });
          App.loading();
        }
      });
    },
    
    weixinPay: function(){
      if(!WeixinJSBridge){
				return;
			}
      var params = JSON.parse(App.g.payParams);
      var url = App.URL.ChangeOrder + App.g.orderNo;
      WeixinJSBridge.invoke('getBrandWCPayRequest', {
        'appId': params.appId, //公众号名称，由商户传入
        'timeStamp': params.timeStamp, //时间戳，自1970年以来的秒数
        'nonceStr': params.nonceStr, //随机串
        'package': params.package,
        'signType': 'MD5', //微信签名方式：
        'paySign': params.paySign //微信签名
      },function(res) {
        if (res.err_msg === 'get_brand_wcpay_request:ok') {
          $.ajax({
            type:'POST',//此处如果用put方法会调用出错，返回status 0
            url:url,
            headers:{
              'Authorization': 'bearer ' + App.g.accessToken
            },
            success:function() {
              App.loading();
              $('.success-pay').dialog("show");
            },
            error:function(xhr, ajaxOptions, thrownError){
              App.loading();
              $.tips({
                content:'网络异常，请联系客服人员！',
                stayTime:2000,
                type:"warn"
              });
              Backbone.history.stop();
              Backbone.history.navigate('#index?'+App.g.openId+'&'+App.g.universityId, {trigger: true});
              Backbone.history.start();
            }
          });	
        }
      },false);
    },
    
    surePay: function(){
      $('.success-pay').dialog("hide");
      Backbone.history.stop();
      Backbone.history.navigate('#index?'+App.g.openId+'&'+App.g.universityId, {trigger: true});
      Backbone.history.start();
    },
    
    surePayHistory: function(){
      $('.success-pay').dialog("hide");
      Backbone.history.stop();
      Backbone.history.navigate('#history', {trigger: true});
      Backbone.history.start();
    }
      

  });

})();
