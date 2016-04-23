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
      this.detailinfo = _.find(App.g.historyList.models[0].attributes.list, function(detail) {
        return detail.OrderNo === id;
      });
      this.render();
    },

    render: function () {
      this.$el.html(this.template({
        detailinfo:this.detailinfo
      }));
    }

  });

})();
