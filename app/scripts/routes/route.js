/*global App, Backbone*/

App.Routers = App.Routers || {};

(function () {
  'use strict';

  App.Routers.Route = Backbone.Router.extend({
    routes: {
      'index?:openId&:universityId': 'index',//&:hqbOpenId&:VenderInterface&:code&:state
      '': 'init',
      'index': 'init',
      'history': 'history',
      'historydetail?:deatilno': 'historydetail',
      'billhistorydetail?:billId':'billhistorydetail',
      'userinfo': 'userinfo',
      'unpaybilldetail?:billId':'unpaybilldetail'
    },
  });

})();
