/*global App, Backbone*/

App.Models = App.Models || {};

(function () {
  'use strict';

  App.Models.UnPayedBill = Backbone.Model.extend({

    url: '',

    initialize: function() {
    },

    defaults: {
        Id:0,
        TotalAmount:0,
        RemainingAmount:0,
        BillType:'',
        ExpireDate:'',
        BillPeroid:'',
        Payments:[],
        BStatus:'',
        Details:[]
    },

    validate: function(attrs, options) {
    },

    parse: function(response, options)  {
      return response;
    }
  });

})();
