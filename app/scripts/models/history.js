/*global App, Backbone*/

App.Models = App.Models || {};

(function () {
  'use strict';

  App.Models.History = Backbone.Model.extend({

    url: '',

    initialize: function() {
    },

    defaults: {
      AdditionalData:'',
      Amount:'',
      ClientId:'',
      CreatedBy:'',
      CreatedOn:'',
      ItemDescription:'',
      OrderNo:'',
      OrderType:'',
      Status:'',
      UpdatedBy:'',
      UpdatedOn:'',
      statusValue:'',
      typeValue:'',
    },

    validate: function(attrs, options) {
    },

    parse: function(response, options)  {
      return response;
    }
  });

})();
