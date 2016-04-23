/*global App, Backbone*/

App.Collections = App.Collections || {};

(function () {
  'use strict';

  App.Collections.UnPayedBillHistoryList = Backbone.Collection.extend({

    model: App.Models.UnPayedBill

  });

})();
