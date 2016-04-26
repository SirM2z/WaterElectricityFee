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
    
    myUnScroll:null,
    
    myScroll:null,
    
    isFinishUnHistory:false,
    
    isFinishHistory:false,
    
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
      App.g.unHistoryEpage=1;
      App.g.historyEpage=1;
      this.isFinishUnHistory=false;
      this.isFinishHistory=false;
      App.g.historyList = new App.Collections.HistoryList();
      App.g.unPayedBillHistoryList = new App.Collections.UnPayedBillHistoryList();
      
      // //获取历史缴费列表
      // this.getHistoryList();
      
      // if(App.g.payMode === 1){
      //   //获取历史欠费列表
      //   this.getUnPayedBillHistoryList();
      // }
      
      var _this=this;
      //获取历史欠费列表
      if(App.g.payMode === 1){
        this.getUnPayedBillHistoryList(function(){
          _this.currentAjax++;
          _this.sureAjax();
        });
      }
      //获取历史缴费列表
      this.getHistoryList(function(){
        _this.currentAjax++;
        _this.sureAjax();
      });
      
      //this.render();
    },

    render: function () {
      this.historyList = App.g.historyList.toJSON();
      this.unPayedBillHistoryList = App.g.unPayedBillHistoryList.toJSON();
      this.userFlatModel = App.g.userFlatModel.toJSON();
      
      this.$el.html(this.template({
        historyList:this.historyList,
        unPayedBillHistoryList:this.unPayedBillHistoryList,
        userFlatModel:this.userFlatModel,
        isFinishUnHistory:this.isFinishNoReply,
        isFinishHistory:this.isFinishHaveReply,
        currentTabReply:App.g.currentTabReply
      }));
      
      if(this.unPayedBillHistoryList.length>5){
        //, bounceEasing: 'elastic', bounceTime: 1200
        var _this=this;
        setTimeout(function(){
          _this.myUnScroll = new IScroll('.wrapper-un', { mouseWheel: true, click: true });
        },100 );
      }
      
      if(this.historyList.length>5){
        //, bounceEasing: 'elastic', bounceTime: 1200
        var _this=this;
        setTimeout(function(){
          _this.myScroll = new IScroll('.wrapper', { mouseWheel: true, click: true });
          _this.myScroll.on('scrollEnd', function () {
            //如果滑动到底部，则加载更多数据（距离最底部10px高度）
            if ((this.y - this.maxScrollY) <= 0) {
              console.log('un-history end');
              //getMore();
              if(_this.isFinishHistory && !App.g.ajaxIng)return;
              _this.getHistoryList(function(list){
                for(var i=0,ilen=list.length;i<ilen;i++){
                  var str='';
                  str+='<li class="ui-border-t" data-id="'+list[i].OrderNo+'">';
                  str+='<h4 class="pay-list-info">'+list[i].typeValue;
                  str+='<span class="pay-list-fr">'+(list[i].Amount)/100+'</span></h4>';
                  str+='<p>'+list[i].CreatedBy+'<span class="pay-list-fr">';
                  str+=list[i].CreatedOn.replace('T',' ')+'</span></p>';
                  str+='</li>';
                  $('.wrapper .ui-list').append(str)
                  _this.myScroll.refresh();
                }
              });
            }
          });
         },100 );
      }
      
    },
    
    getUnPayedBillHistoryList: function(callback){
      var _selfthis=this;
      App.loading(true);
      App.g.ajaxIng=true;
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
            callback(result.Data);
            App.loading();
          }else{
            $.tips({
              content: '获取历史欠费失败，服务器出错！',
              stayTime: 2000,
              type: "warn"
            });
            Backbone.history.navigate('#', {trigger: true});
            App.loading();
          }
          App.g.ajaxIng=false;
        }, error: function error() {
          $.tips({
            content: '获取缴费历史失败，请重试！',
            stayTime: 2000,
            type: "warn"
          });
          //Backbone.history.navigate('#', {trigger: true});
          App.loading();
          App.g.ajaxIng=false;
        }
      });
    },
    
    getHistoryList: function(callback){
      var _selfthis=this;
      App.loading(true);
      $.ajax({
        url: App.URL.HISTORY + App.g.userFlatModel.get('AreaId')+'-'+App.g.userFlatModel.get('FlatId')+'-'+App.g.userFlatModel.get('RoomId')+'/'+App.g.universityId+'/'+App.g.historyEpage+'/'+App.g.pagesize,
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
            for(var i=0,ilen=result.Data[0].list.length;i<ilen;i++){
              App.g.historyList.push(result.Data[0].list[i]);
            }
            if(result.Data[0].lastPage){
              _selfthis.isFinishHistory=true;
              $('.wrapper #more').text('已无更多数据');
            }
            App.g.historyEpage++;
            callback(result.Data[0].list)
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
          App.g.ajaxIng=false;
        }, error: function error() {
          $.tips({
            content: '获取缴费历史失败，请重试！',
            stayTime: 2000,
            type: "warn"
          });
          //Backbone.history.navigate('#', {trigger: true});
          App.loading();
          App.g.ajaxIng=false;
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
      var _selfthis=this;
      $('.history-active').removeClass('history-active');
      _this.addClass('history-active');
      if(_this.hasClass('div-1')){
        $('.wrapper').addClass('hide');
        if($('.ul-1 li').length==0){
          $('.wrapper-un').addClass('hide');
          $('.no-bill-message span').text('暂未查询到缴费清单')
          $('.no-bill-message').removeClass('hide');
        }else{
          $('.wrapper-un').removeClass('hide');
          $('.no-bill-message').addClass('hide');
        }
      }else{
        $('.wrapper-un').addClass('hide');
        if($('.ul-2 li').length==0){
          $('.wrapper').addClass('hide');
          $('.no-bill-message').removeClass('hide');
        }else{
          $('.wrapper').removeClass('hide');
          $('.no-bill-message span').text('暂未查询到缴费历史')
          $('.no-bill-message').addClass('hide');
          if(_selfthis.myScroll){
            _selfthis.myScroll.refresh();
          }
        }
      }
    },
    
    paymentList: function(event){
      event.stopPropagation();
      var _this=$(event.target).closest("li");
      //console.log(_this.data('id'));
      var id=_this.data('id');
      App.g.currentTabReply = 1;
      Backbone.history.navigate('#paymentList/'+id, {trigger: true});
    },
    
    historyDetail: function(event){
      event.stopPropagation();
      var _this=$(event.target).closest("li");
      //console.log(_this.data('id'));
      var id=_this.data('id');
      App.g.currentTabReply = 2;
      Backbone.history.navigate('#historyDetail/'+id, {trigger: true});
    }

  });

})();
