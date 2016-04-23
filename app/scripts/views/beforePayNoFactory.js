/*global App, Backbone, JST*/

App.Views = App.Views || {};

(function () {
  'use strict';

  App.Views.BeforePayNoFactory = Backbone.View.extend({

    template: JST['app/scripts/templates/beforePayNoFactory.ejs'],

    tagName: 'div',

    el: '#beforePayNoFactory',
    
    userFlatModel:null,
    
    flatList:null,

    events: {
      'change .livearealist-select':'liveSelect',
      'change .ban-select':'banSelect',
      'click .ui-btn-select':'paySelect',
      'click .charge-btn':'paySure',
      'click .ui-icon-close':'clearInput'
    },

    initialize: function () {
      //this.listenTo(this.model, 'change', this.render);
      this.$el.off();
      
      this.userFlatModel = App.g.userFlatModel.toJSON();
      this.flatList = App.g.flatList.toJSON();
      
      this.render();
    },

    render: function () {
      this.$el.html(this.template({
        userFlatModel:this.userFlatModel,
        flatList:this.flatList
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
    
    liveSelect:function(event){
      //$('#test option:selected').val();
      var optionSelected=$(event.target.options[event.target.options.selectedIndex]);
      App.g.areaId=optionSelected.val();
      App.g.areaName=optionSelected.text();
      var ban_select=$('.ban-select');
      ban_select.empty();
      ban_select.append('<option value="0" selected >请选择楼栋</option>')
      var flats=App.g.flatList.where({AreaId:App.g.areaId})[0].attributes.Flats;
      for(var i=0;i<flats.length;i++){
        ban_select.append('<option value="'+flats[i].FlatId+'" data-paymode="'+flats[i].PayMode+'">'+flats[i].FlatName+'</option>');
      }
    },
    
    banSelect: function(event){
      var optionSelected=$(event.target.options[event.target.options.selectedIndex]);
      $('#room').val('');
      App.g.flatId=optionSelected.val();
      App.g.flatName=optionSelected.text();
      App.g.payMode=optionSelected.data('paymode');
    },
    
    clearInput: function(event){
      event.preventDefault();
      var _input=$(event.target).prev();
      _input.val('');
    },
    
    paySure: function(){
      var livearea = $('.livearealist-select');
      var ban = $('.ban-select');
      var room = $('#room');
      var selectBtn=$('.ui-btn-select.active');
      var chargeMoney='';
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
