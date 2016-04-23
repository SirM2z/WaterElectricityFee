/*global App, Backbone*/

App.Collections = App.Collections || {};

(function () {
  'use strict';

  App.Collections.HistoryList = Backbone.Collection.extend({

    model: App.Models.History

  });

})();
