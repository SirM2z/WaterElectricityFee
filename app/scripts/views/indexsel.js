/*global App, Backbone, JST*/

App.Views = App.Views || {};

(function () {
  'use strict';

  App.Views.indexsel = Backbone.View.extend({

    template: JST['app/scripts/templates/indexsel.ejs'],

    tagName: 'div',
    
    el:'#indexsel',

    events: {
      'click .ui-btn-select':'paySelect',
      'click .charge-btn':'paySure',
      'click .ui-icon-close':'clearInput',
      'click .cancle':'canclePay',
      'click .pay-confirm':'payConfirm'
    },
    
    balanceAmount:null,
    
    balanceMeterReading:null,
    
    chargeMoney:null,

    initialize: function () {
      //this.listenTo(this.model, 'change', this.render);
      this.$el.off();
      
      this.balanceAmount=App.g.balanceAmount;
      this.balanceMeterReading=App.g.balanceMeterReading;
      
      this.render();
    },

    render: function () {
      this.$el.html(this.template({
        balanceAmount:this.balanceAmount,
        balanceMeterReading:this.balanceMeterReading
      }));
    },
    
    paySelect: function(event){
      var _this=$(event.target);
      $('.ui-btn-select.active').removeClass('active');
      _this.addClass('active');
      if(!_this.data('number')){
        $('.pay-other').removeClass('hide')
      }else{
        $('.pay-other').addClass('hide')
      }
    },
    
    clearInput: function(){
      $('#pay-num').val('');
    },
    
    canclePay: function(){
      $('.ui-dialog').dialog("hide");
    },
      

  });

})();
