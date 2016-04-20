/*global App, Backbone, JST*/

App.Views = App.Views || {};

(function () {
  'use strict';

  App.Views.Index = Backbone.View.extend({

    template: JST['app/scripts/templates/index.ejs'],

    tagName: 'div',
    
    el:'#index',

    events: {
      'click .ui-btn-select':'paySelect',
      'click .charge-btn':'paySure',
      'click .ui-icon-close':'clearInput'
    },

    initialize: function () {
      //this.listenTo(this.model, 'change', this.render);
      this.$el.off();
      
      this.render();
    },

    render: function () {
      this.$el.html(this.template());
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
    
    paySure: function(){
      var selectBtn=$('.ui-btn-select.active');
      var chargeMoney='';
      if(selectBtn.length===0){
        $.tips({
          content:'请选择充值金额！',
          stayTime:2000,
          type:"warn"
        });
        return;
      }
      if(!selectBtn.data('number')){
        chargeMoney=$('#pay-num').val().trim();
        if(chargeMoney.length<1){
          $.tips({
            content:'请填写充值金额！',
            stayTime:2000,
            type:"warn"
          });
          return;
        }
      }else{
        chargeMoney=selectBtn.data('number');
      }
      
      //ajax
      console.log(chargeMoney);
    }

  });

})();
