/*global App, Backbone*/

App.Collections = App.Collections || {};

(function () {
  'use strict';

  App.Collections.FlatList = Backbone.Collection.extend({

    model: App.Models.Flat

  });

})();
