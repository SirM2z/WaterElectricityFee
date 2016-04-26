/*global App, Backbone, JST*/

App.Views = App.Views || {};

(function () {
  'use strict';

  App.Views.BeforePayNoFactoryHistory = Backbone.View.extend({

    template: JST['app/scripts/templates/beforePayNoFactoryHistory.ejs'],

    tagName: 'div',

    el: '#beforePayNoFactoryHistory',
    
    historyList: null,
    
    myScroll:null,
    
    isFinish:false,//滑动分页加载是否加载完毕

    events: {
      'click .ui-list li':'historyDetail'
    },

    initialize: function () {
      //this.listenTo(this.model, 'change', this.render);
      this.$el.off();
      
      App.g.beforePayNoFactoryHistoryEpage=1;
      
      this.isFinish=false;
      
      App.g.historyList = new App.Collections.HistoryList();
      
      //获取历史缴费列表
      var _this=this;
      this.getHistoryList(function(){
        _this.render();
      });
      
      // this.render();
    },

    render: function () {
      this.historyList = App.g.historyList.toJSON();
      this.$el.html(this.template({
        historyList:this.historyList,
        isFinish:this.isFinish
      }));
      
      if(this.historyList.length>4){
        //, bounceEasing: 'elastic', bounceTime: 1200
        var _this=this;
        setTimeout(function(){
          _this.myScroll = new IScroll('.beforePayNoFactoryHistory-wrapper', { mouseWheel: true, click: true });
          _this.myScroll.on('scrollEnd', function () {
            //如果滑动到底部，则加载更多数据（距离最底部10px高度）
            if ((this.y - this.maxScrollY) <= 0) {
              console.log('beforePayNoFactoryHistory-end');
              //getMore();
              if(_this.isFinish && !App.g.ajaxIng)return;
              _this.getHistoryList(function(list){
                for(var i=0,ilen=list.length;i<ilen;i++){
                  var str='';
                  str+='<li class="ui-border-t" data-id="'+list[i].OrderNo+'">';
                  str+='<h4 class="pay-list-info">'+list[i].typeValue;
                  str+='<span class="pay-list-fr">'+(list[i].Amount)/100+'</span></h4>';
                  str+='<p>'+list[i].CreatedBy+'<span class="pay-list-fr">';
                  str+=list[i].CreatedOn.replace('T',' ')+'</span></p>';
                  str+='</li>';
                  $('.beforePayNoFactoryHistory-wrapper .ui-list').append(str);
                  _this.myScroll.refresh();
                }
              });
            }
          });
        },100 );
      }
      
    },
    
    getHistoryList: function(callback){
      var _selfthis=this;
      App.loading(true);
      App.g.ajaxIng=true;
      $.ajax({
        url: App.URL.HISTORY + App.g.userFlatModel.get('AreaId')+'-'+App.g.userFlatModel.get('FlatId')+'-'+App.g.userFlatModel.get('RoomId')+'/'+App.g.universityId+'/'+App.g.beforePayNoFactoryHistoryEpage+'/'+App.g.pagesize,
        type: 'GET',
        dataType: 'JSON',
        success: function success(response) {
          var result = JSON.parse(response);
          if (result.Status === "Success") {
            if (result.Message === 'NOTFOUND') {
              _selfthis.render();
              App.loading();
              return;
            }
            for(var i=0,ilen=result.Data[0].list.length;i<ilen;i++){
              App.g.historyList.push(result.Data[0].list[i]);
            }
            if(result.Data[0].lastPage){
              _selfthis.isFinish=true;
              $('.beforePayNoFactoryHistory-wrapper #more').text('已无更多数据');
            }
            App.g.beforePayNoFactoryHistoryEpage++;
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
    
    historyDetail: function(event){
      event.stopPropagation();
      var _this=$(event.target).closest("li");
      //console.log(_this.data('id'));
      var id=_this.data('id');
      Backbone.history.navigate('#historyDetail/'+id, {trigger: true});
    }

  });

})();
