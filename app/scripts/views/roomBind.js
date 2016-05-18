/*global App, Backbone, JST*/

App.Views = App.Views || {};

(function () {
  'use strict';

  App.Views.RoomBind = Backbone.View.extend({

    template: JST['app/scripts/templates/roomBind.ejs'],

    tagName: 'div',
    
    el:'#roomBind',
    
    userFlatModel:null,
    
    flatList:null,

    events: {
      'click .ui-icon-close':'clearInput',
      'change .livearealist-select':'liveSelect',
      'change .ban-select':'banSelect',
      'click .room-btn':'sureRoom'
    },

    initialize: function () {
      // this.listenTo(this.model, 'change', this.render);
      this.$el.off();   
      App.loading(false);  
      /*
      if(App.g.userFlatModel == null)
      {
        this.userFlatModel = new App.Models.UserFlatModel();
      }
      else
      {
         this.userFlatModel =App.g.userFlatModel.toJSON();
      }*/
      this.userFlatModel =App.g.userFlatModel.toJSON();
      this.flatList =App.g.flatList.toJSON();  
      this.render();
    },

    render: function () {
      this.$el.html(this.template({       
        userFlatModel:this.userFlatModel,
        flatList:this.flatList     
      }));
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
      
      //保存信息
      App.loading(true);     
      App.g.userFlatModel.set({
          AreaId: livearea.val(),
          AreaName: $(livearea[0].options[livearea[0].selectedIndex]).text().trim(),
          FlatId: ban.val(),
          FlatName: $(ban[0].options[ban[0].selectedIndex]).text().trim(),
          RoomId: room.val().trim(),
          StudentIdentity: App.g.studentIdentity,
          UserName: ''
      });
     
     
      App.g.userFlatModel.save(null, {
        success: function(model, response) {
          // console.log(response);
          if (response.Status === 'SUCCESS') {
            var el=$.tips({
              content:'保存成功',
              stayTime:2000,
              type:"success"
            })
            el.on("tips:hide",function(){
              Backbone.history.stop();
              window.history.pushState(null, null, '#index?'+App.g.openId+'&'+App.g.universityId);
              Backbone.history.start();
            })
            App.loading();
          }else{
            var el=$.tips({
              content:'服务器出错:' + response.Message,
              stayTime:2000,
              type:"warn"
            })
          }
        },
        error:function(){
          var el=$.tips({
            content:'服务器出错',
            stayTime:2000,
            type:"warn"
          })
        }
      });
      
    }

  });

})();
