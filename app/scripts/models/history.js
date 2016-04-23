/*global App, Backbone*/

App.Models = App.Models || {};

(function () {
  'use strict';

  App.Models.History = Backbone.Model.extend({

    url: '',

    initialize: function() {
    },

    defaults: {
      OrderNo: '',
      CreatedBy: '',
      Amount: '',
      CreatedOn:'',
      StatusValue:''
    },

    validate: function(attrs, options) {
    },

    parse: function(response, options)  {
      return response;
    }
  });

})();
