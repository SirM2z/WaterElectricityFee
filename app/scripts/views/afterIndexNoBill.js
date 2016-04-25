/*global App, Backbone, JST*/

App.Views = App.Views || {};

(function () {
  'use strict';

  App.Views.AfterIndexNoBill = Backbone.View.extend({

    template: JST['app/scripts/templates/afterIndexNoBill.ejs'],

    tagName: 'div',

    el: '#afterIndexNoBill',
    
    userFlatModel:null,

    events: {
      'click .ui-list li':'goPaymentList'
    },

    initialize: function () {
      // this.listenTo(this.model, 'change', this.render);
      this.$el.off();
      
      this.userFlatModel = App.g.userFlatModel.toJSON();
      
      this.render();
    },

    render: function () {
      this.$el.html(this.template({
        userFlatModel:this.userFlatModel,
        universityName:App.g.universityName
      }));
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