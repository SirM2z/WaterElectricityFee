/*global App, Backbone, JST*/

App.Views = App.Views || {};

(function () {
  'use strict';

  App.Views.History = Backbone.View.extend({

    template: JST['app/scripts/templates/history.ejs'],

    tagName: 'div',
    
    el: '#history',

    events: {
      'click .history-choose div':'chooseList',
      'click .ul-1 li':'paymentList',
      'click .ul-2 li':'historyDetail'
    },

    initialize: function () {
      // this.listenTo(this.model, 'change', this.render);
      this.$el.off();
      
      this.render();
    },

    render: function () {
      this.$el.html(this.template());
    },
    
    chooseList: function(event){
      var _this=$(event.target);
      $('.history-active').removeClass('history-active');
      _this.addClass('history-active');
      if(_this.hasClass('div-1')){
        $('.ul-2').addClass('hide');
        if($('.ul-1 li').length==0){
          $('.ul-1').addClass('hide');
          $('.no-bill-message span').text('暂未查询到缴费清单')
          $('.no-bill-message').removeClass('hide');
        }else{
          $('.ul-1').removeClass('hide');
          $('.no-bill-message').addClass('hide');
        }
      }else{
        $('.ul-1').addClass('hide');
        if($('.ul-2 li').length==0){
          $('.ul-2').addClass('hide');
          $('.no-bill-message').removeClass('hide');
        }else{
          $('.ul-2').removeClass('hide');
          $('.no-bill-message span').text('暂未查询到缴费历史')
          $('.no-bill-message').addClass('hide');
        }
      }
    },
    
    paymentList: function(event){
      event.stopPropagation();
      var _this=$(event.target).closest("li");
      console.log(_this.data('id'));
      
      Backbone.history.navigate('#paymentList', {trigger: true});
    },
    
    historyDetail: function(event){
      event.stopPropagation();
      var _this=$(event.target).closest("li");
      console.log(_this.data('id'));
      
      Backbone.history.navigate('#historyDetail', {trigger: true});
    }

  });

})();
