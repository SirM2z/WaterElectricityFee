/*global App, Backbone, JST*/

App.Views = App.Views || {};

(function () {
  'use strict';

  App.Views.HistoryDetail = Backbone.View.extend({

    template: JST['app/scripts/templates/historyDetail.ejs'],

    tagName: 'div',
    
    el: '#historyDetail',
    
    detailinfo: null,
    
    events: {},

    initialize: function (id) {
      // this.listenTo(this.model, 'change', this.render);
      this.$el.off();
      
      if(!id){
        $.tips({
          content: '信息不完善，请重新选择！',
          stayTime: 2000,
          type: "warn"
        });
        Backbone.history.navigate('#history', {trigger: true});
        return;
      }
      // this.detailinfo = _.find(App.g.historyList.models[0].attributes.list, function(detail) {
      //   return detail.OrderNo === id;
      // });
      if(App.g.liveAreaId && App.g.historyList.where({OrderNo:id}).length>0){
        this.detailinfo=App.g.historyList.where({OrderNo:id})[0].attributes;
      }
      this.render();
    },

    render: function () {
      this.$el.html(this.template({
        detailinfo:this.detailinfo
      }));
    }

  });

})();
