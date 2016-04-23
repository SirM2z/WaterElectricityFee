/*global App, Backbone, JST*/

App.Views = App.Views || {};

(function () {
  'use strict';

  App.Views.AfterIndex = Backbone.View.extend({

    template: JST['app/scripts/templates/afterIndex.ejs'],

    tagName: 'div',

    el: '#afterIndex',
    
    unPayedBillList: null,
    
    userFlatModel: null,

    events: {},

    initialize: function () {
      // this.listenTo(this.model, 'change', this.render);
      this.$el.off();
      
      //获取欠费信息
      this.getUnPayedBillList();
      
      // this.render();
    },

    render: function () {
      this.unPayedBillList = App.g.unPayedBillList.toJSON();
      this.userFlatModel = App.g.userFlatModel.toJSON();
      this.$el.html(this.template({
        unPayedBillList:this.unPayedBillList[0],
        userFlatModel:this.userFlatModel
      }));
    },
    
    getUnPayedBillList: function(){
      var _selfthis=this;
      App.loading(true);
      $.ajax({
        url: App.URL.UNPAID + App.g.universityId + '/' + App.g.userFlatModel.get('FlatId') + '/' + App.g.userFlatModel.get('RoomId'),
        headers:{
          'Authorization': 'bearer ' + App.g.accessToken
        },
        type: 'GET',
        dataType: 'JSON',
        success: function success(response) {
          var result = JSON.parse(response);
          if (result.Status === "SUCCESS") {
            if (result.Message === 'NOTFOUND') {
              Backbone.history.navigate('#afterNoPay', {trigger: true});
              return;
            }
            App.g.unPayedBillList=new App.Collections.UnPayedBillList();
            App.g.unPayedBillList.push(result.Data);
            _selfthis.render();
            App.loading();
          }else{
            $.tips({
              content:'初始化失败，服务器出错！',
              stayTime:2000,
              type:"warn"
            });
            App.loading();
          }
        }, error: function error() {
          $.tips({
            content: '获取欠费信息失败，请重试！',
            stayTime: 2000,
            type: "warn"
          });
          //Backbone.history.navigate('#', {trigger: true});
          App.loading();
        }
      });
    }

  });

})();
