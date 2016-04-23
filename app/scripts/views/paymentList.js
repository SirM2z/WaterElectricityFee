/*global App, Backbone, JST*/

App.Views = App.Views || {};

(function () {
  'use strict';

  App.Views.PaymentList = Backbone.View.extend({

    template: JST['app/scripts/templates/paymentList.ejs'],

    tagName: 'div',

    el: '#paymentList',
    
    unPayedBillHistoryList:null,
    
    userFlatModel: null,

    events: {},

    initialize: function (id) {
      //this.listenTo(this.model, 'change', this.render);
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
      this.unPayedBillHistoryList=App.g.unPayedBillHistoryList.where({Id:parseInt(id)})[0].attributes;
      
      this.render();
    },

    render: function () {
      this.userFlatModel = App.g.userFlatModel.toJSON();
      this.$el.html(this.template({
        unPayedBillHistoryList:this.unPayedBillHistoryList,
        userFlatModel:this.userFlatModel
      }));
    }

  });

})();
