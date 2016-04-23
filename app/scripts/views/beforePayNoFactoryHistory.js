/*global App, Backbone, JST*/

App.Views = App.Views || {};

(function () {
  'use strict';

  App.Views.BeforePayNoFactoryHistory = Backbone.View.extend({

    template: JST['app/scripts/templates/beforePayNoFactoryHistory.ejs'],

    tagName: 'div',

    el: '#beforePayNoFactoryHistory',
    
    historyList: null,

    events: {
      'click .ui-list li':'historyDetail'
    },

    initialize: function () {
      //this.listenTo(this.model, 'change', this.render);
      this.$el.off();
      App.g.historyList = new App.Collections.HistoryList();
      
      //获取历史缴费列表
      this.getHistoryList();
      
      // this.render();
    },

    render: function () {
      this.historyList = App.g.historyList.toJSON();
      this.$el.html(this.template({
        historyList:this.historyList
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
              _selfthis.render();
              App.loading();
              return;
            }
            App.g.historyList.push(result.Data);
            _selfthis.render();
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
            content: '获取缴费历史失败，请重试！',
            stayTime: 2000,
            type: "warn"
          });
          //Backbone.history.navigate('#', {trigger: true});
          App.loading();
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
