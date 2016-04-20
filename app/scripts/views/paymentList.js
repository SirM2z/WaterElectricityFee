/*global App, Backbone, JST*/

App.Views = App.Views || {};

(function () {
  'use strict';

  App.Views.PaymentList = Backbone.View.extend({

    template: JST['app/scripts/templates/paymentList.ejs'],

    tagName: 'div',

    el: '#paymentList',

    events: {},

    initialize: function () {
      //this.listenTo(this.model, 'change', this.render);
      this.$el.off();
      
      this.render();
    },

    render: function () {
      this.$el.html(this.template());
    }

  });

})();
