/*global App, Backbone*/

App.Collections = App.Collections || {};

(function () {
  'use strict';

  App.Collections.UnPayedBillList = Backbone.Collection.extend({

    model: App.Models.UnPayedBill,
    
    url:App.URL.UNPAID

  });

})();
