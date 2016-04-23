/*global App, Backbone*/

App.Models = App.Models || {};

(function () {
  'use strict';

  App.Models.Flat = Backbone.Model.extend({

    url: '',

    initialize: function() {
    },

    defaults: {
      AreaId:'',
      AreaName:'',
      Flats:[]
    },

    validate: function(attrs, options) {
    },

    parse: function(response, options)  {
      return response;
    }
  });

})();
