/*global App, Backbone, JST*/

App.Views = App.Views || {};

(function () {
  'use strict';

  App.Views.AfterNoPay = Backbone.View.extend({

    template: JST['app/scripts/templates/afterNoPay.ejs'],

    tagName: 'div',

    el: '#afterNoPay',

    events: {
      'click .ui-list li':'goPaymentList'
    },

    initialize: function () {
      // this.listenTo(this.model, 'change', this.render);
      this.$el.off();
      
      this.render();
    },

    render: function () {
      this.$el.html(this.template());
    },
    
    goPaymentList: function(event){
      event.stopPropagation();
      var _this=$(event.target).closest("li");
      console.log(_this.data('id'));
      
      Backbone.history.navigate('#paymentList', {trigger: true});
    }

  });

})();

// <div class="roommate-info">
//     <div class="ui-border-t">
//       <img src="">
//     </div>
//   </div>