/*global App, Backbone, JST*/

App.Views = App.Views || {};

(function () {
  'use strict';

  App.Views.RoomBind = Backbone.View.extend({

    template: JST['app/scripts/templates/roomBind.ejs'],

    tagName: 'div',
    
    el:'#roomBind',

    events: {
      'click .ui-icon-close':'clearInput',
      'click .room-btn':'sureRoom'
    },

    initialize: function () {
      // this.listenTo(this.model, 'change', this.render);
      this.$el.off();
      
      this.render();
    },

    render: function () {
      this.$el.html(this.template());
    },
    
    clearInput: function(){
      $('#room').val('');
    },
    
    sureRoom: function(){
      var _selfthis=this;
      var livearea = $('.livearealist-select');
      var ban = $('.ban-select');
      var room = $('#room');
      if(livearea.val()==0){
        $.tips({
          content:'请选择生活区！',
          stayTime:2000,
          type:"warn"
        });
        return;
      }
      if(ban.val()==0){
        $.tips({
          content:'请选择楼栋！',
          stayTime:2000,
          type:"warn"
        });
        return;
      }
      if(room.val().trim().length<1){
        $.tips({
          content:'请填写寝室号！',
          stayTime:2000,
          type:"warn"
        });
        room.focus();
        return;
      }
      
      //ajax
      
      
    }

  });

})();
