/*global App, Backbone, JST*/

App.Views = App.Views || {};

(function () {
  'use strict';

  App.Views.History = Backbone.View.extend({

    template: JST['app/scripts/templates/history.ejs'],

    tagName: 'div',
    
    el: '#history',
    
    historyList: null,
    
    unPayedBillHistoryList: null,
    
    userFlatModel:null,
    
    ajaxNum:2,
    
    currentAjax:0,

    events: {
      'click .history-choose div':'chooseList',
      'click .ul-1 li':'paymentList',
      'click .ul-2 li':'historyDetail'
    },

    initialize: function () {
      // this.listenTo(this.model, 'change', this.render);
      this.$el.off();
      if(App.g.payMode === 1){
        this.ajaxNum=2;
      }else{
        this.ajaxNum=1;
      }
      this.currentAjax=0;
      App.g.historyList = new App.Collections.HistoryList();
      App.g.unPayedBillHistoryList = new App.Collections.UnPayedBillHistoryList();
      
      //获取历史缴费列表
      this.getHistoryList();
      
      if(App.g.payMode === 1){
        //获取历史欠费列表
        this.getUnPayedBillHistoryList();
      }
      
      //this.render();
    },

    render: function () {
      this.historyList = App.g.historyList.toJSON();
      this.unPayedBillHistoryList = App.g.unPayedBillHistoryList.toJSON();
      this.userFlatModel = App.g.userFlatModel.toJSON();
      
      this.$el.html(this.template({
        historyList:this.historyList,
        unPayedBillHistoryList:this.unPayedBillHistoryList,
        userFlatModel:this.userFlatModel
      }));
    },
    
    getHistoryList: function(){
      var _selfthis=this;
      App.loading(true);
      $.ajax({
        url: App.URL.HISTORY + App.g.userFlatModel.get('AreaId')+'-'+App.g.userFlatModel.get('FlatId')+'-'+App.g.userFlatModel.get('RoomId')+'/'+App.g.universityId+'/1/10',
        type: 'GET',
        dataType: 'JSON',
        success: function success(response) {
          var result = JSON.parse(response);
          if (result.Status === "Success") {
            if (result.Message === 'NOTFOUND') {
              _selfthis.currentAjax++;
              _selfthis.sureAjax();
              return;
            }
            App.g.historyList.push(result.Data);
            _selfthis.currentAjax++;
            _selfthis.sureAjax();
            
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
            content: '获取缴费历史失败，请重试！',
            stayTime: 2000,
            type: "warn"
          });
          //Backbone.history.navigate('#', {trigger: true});
          App.loading();
        }
      });
    },
    
    getUnPayedBillHistoryList: function(){
      var _selfthis=this;
      App.loading(true);
      $.ajax({
        url: App.URL.UNPAIDHIS + App.g.universityId +'/'+App.g.userFlatModel.get('FlatId')+'/'+App.g.userFlatModel.get('RoomId'),
        headers:{
          'Authorization': 'bearer ' + App.g.accessToken
        },
        type: 'GET',
        dataType: 'JSON',
        success: function success(response) {
          var result = JSON.parse(response);
          if (result.Status === "SUCCESS") {
            if (result.Message === 'NOTFOUND') {
              _selfthis.currentAjax++;
              _selfthis.sureAjax();
              return;
            }
            App.g.unPayedBillHistoryList.push(result.Data);
            _selfthis.currentAjax++;
            _selfthis.sureAjax();
          }else{
            $.tips({
              content: '获取历史欠费失败，服务器出错！',
              stayTime: 2000,
              type: "warn"
            });
            Backbone.history.navigate('#', {trigger: true});
            App.loading();
          }
        }, error: function error() {
          $.tips({
            content: '获取缴费历史失败，请重试！',
            stayTime: 2000,
            type: "warn"
          });
          //Backbone.history.navigate('#', {trigger: true});
          App.loading();
        }
      });
    },
    
    sureAjax: function(){
      if(this.ajaxNum===this.currentAjax){
        this.render();
        App.loading();
      }
    },
    
    chooseList: function(event){
      var _this=$(event.target);
      $('.history-active').removeClass('history-active');
      _this.addClass('history-active');
      if(_this.hasClass('div-1')){
        $('.ul-2').addClass('hide');
        if($('.ul-1 li').length==0){
          $('.ul-1').addClass('hide');
          $('.no-bill-message span').text('暂未查询到缴费清单')
          $('.no-bill-message').removeClass('hide');
        }else{
          $('.ul-1').removeClass('hide');
          $('.no-bill-message').addClass('hide');
        }
      }else{
        $('.ul-1').addClass('hide');
        if($('.ul-2 li').length==0){
          $('.ul-2').addClass('hide');
          $('.no-bill-message').removeClass('hide');
        }else{
          $('.ul-2').removeClass('hide');
          $('.no-bill-message span').text('暂未查询到缴费历史')
          $('.no-bill-message').addClass('hide');
        }
      }
    },
    
    paymentList: function(event){
      event.stopPropagation();
      var _this=$(event.target).closest("li");
      //console.log(_this.data('id'));
      var id=_this.data('id');
      Backbone.history.navigate('#paymentList/'+id, {trigger: true});
    },
    
    historyDetail: function(event){
      event.stopPropagation();
      var _this=$(event.target).closest("li");
      //console.log(_this.data('id'));
      var id=_this.data('id');
      Backbone.history.navigate('#historyDetail/'+id, {trigger: true});
    }

  });

})();
