/*global App, Backbone, JST*/

App.Views = App.Views || {};

(function () {
  'use strict';

  App.Views.HistoryDetail = Backbone.View.extend({

    template: JST['app/scripts/templates/historyDetail.ejs'],

    tagName: 'div',
    
    el: '#historyDetail',

    events: {},

    initialize: function () {
      // this.listenTo(this.model, 'change', this.render);
      this.$el.off();
      
      this.render();
    },

    render: function () {
      this.$el.html(this.template());
    }

  });

})();
