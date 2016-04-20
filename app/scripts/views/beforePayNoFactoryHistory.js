/*global App, Backbone, JST*/

App.Views = App.Views || {};

(function () {
  'use strict';

  App.Views.BeforePayNoFactoryHistory = Backbone.View.extend({

    template: JST['app/scripts/templates/beforePayNoFactoryHistory.ejs'],

    tagName: 'div',

    el: '#beforePayNoFactoryHistory',

    events: {
      'click .ui-list li':'historyDetail'
    },

    initialize: function () {
      //this.listenTo(this.model, 'change', this.render);
      this.$el.off();
      
      this.render();
    },

    render: function () {
      this.$el.html(this.template());
    },
    
    historyDetail: function(event){
      event.stopPropagation();
      var _this=$(event.target).closest("li");
      console.log(_this.data('id'));
      
      Backbone.history.navigate('#historyDetail', {trigger: true});
    }

  });

})();
