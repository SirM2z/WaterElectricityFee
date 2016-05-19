/*global App, Backbone, JST*/

App.Views = App.Views || {};

(function () {
  'use strict';

  App.Views.BeforePayNoFactory = Backbone.View.extend({

    template: JST['app/scripts/templates/beforePayNoFactory.ejs'],

    tagName: 'div',

    el: '#beforePayNoFactory',
    
    userFlatModel:null,
    
    flatList:null,
    
    chargeMoney:null,

    events: {
      'change .livearealist-select':'liveSelect',
      'change .ban-select':'banSelect',
      'click .ui-btn-select':'paySelect',
      'click .charge-btn':'paySure',
      'click .ui-icon-close':'clearInput',
      'click .cancle':'canclePay',
      'click .pay-confirm':'payConfirm',
      'click .success-pay-sure':'surePay',
      'click .success-pay-history':'surePayHistory'
    },

    initialize: function () {
      //this.listenTo(this.model, 'change', this.render);
      this.$el.off();
      
      this.userFlatModel = App.g.userFlatModel.toJSON();
      this.flatList = App.g.flatList.toJSON();
      
      this.render();
    },

    render: function () {
      this.$el.html(this.template({
        userFlatModel:this.userFlatModel,
        flatList:this.flatList
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
    
    liveSelect:function(event){
      //$('#test option:selected').val();
      var optionSelected=$(event.target.options[event.target.options.selectedIndex]);
      App.g.areaId=optionSelected.val();
      App.g.areaName=optionSelected.text();
      var ban_select=$('.ban-select');
      ban_select.empty();
      ban_select.append('<option value="0" selected >请选择楼栋</option>')
      var flats=App.g.flatList.where({AreaId:App.g.areaId})[0].attributes.Flats;
      for(var i=0;i<flats.length;i++){
        ban_select.append('<option value="'+flats[i].FlatId+'" data-paymode="'+flats[i].PayMode+'">'+flats[i].FlatName+'</option>');
      }
    },
    
    banSelect: function(event){
      var optionSelected=$(event.target.options[event.target.options.selectedIndex]);
      $('#room').val('');
      App.g.flatId=optionSelected.val();
      App.g.flatName=optionSelected.text();
      App.g.payMode=optionSelected.data('paymode');
    },
    
    clearInput: function(event){
      event.preventDefault();
      var _input=$(event.target).prev();
      _input.val('');
    },
    
    paySure: function(){
      var livearea = $('.livearealist-select');
      var ban = $('.ban-select');
      var room = $('#room');
      var selectBtn=$('.ui-btn-select.active');
      var chargeMoney='';
      if(livearea.val()==0){
        $.tips({
          content:'请选择生活区！',
          stayTime:2000,
          type:"warn"
        });
        return;
      }
      if(ban.val()==0){
        $.tips({
          content:'请选择楼栋！',
          stayTime:2000,
          type:"warn"
        });
        return;
      }
      if(room.val().trim().length<1){
        $.tips({
          content:'请填写寝室号！',
          stayTime:2000,
          type:"warn"
        });
        room.focus();
        return;
      }
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
      
      this.chargeMoney = chargeMoney;
      App.g.userFlatModel.set({
        AreaId: livearea.val(),
        AreaName: $(livearea[0].options[livearea[0].selectedIndex]).text().trim(),
        FlatId: ban.val(),
        FlatName: $(ban[0].options[ban[0].selectedIndex]).text().trim(),
        RoomId: room.val()
      });
      var str='您确定要为'+App.g.userFlatModel.get('AreaName')+'-'+App.g.userFlatModel.get('FlatName')+'-'+App.g.userFlatModel.get('RoomId')+'充值'+chargeMoney+'元电费吗？'
      $('.pay-sure .ui-dialog-bd div').text(str);
      $('.pay-sure ').dialog("show");
    },
    
    canclePay: function(){
      $('.pay-sure ').dialog("hide");
      App.loading();
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
