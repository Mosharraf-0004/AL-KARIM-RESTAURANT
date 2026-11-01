(function () {
  "use strict";

  /**
   * Restaurant module that includes the public module as a dependency
   */
  angular
    .module("restaurant", ["public", "admin"])
    .config(config)
    .run(runBlock);

  config.$inject = ["$urlRouterProvider"];
  function config($urlRouterProvider) {
    // If user goes to a path that doesn't exist, redirect to public root
    $urlRouterProvider.otherwise("/");
  }

  runBlock.$inject = ["$rootScope", "OrderService"];
  function runBlock($rootScope, OrderService) {
    $rootScope.orderTotalCount = OrderService.getTotalCount();
    $rootScope.orderTotalAmount = OrderService.getTotalAmount();
  }
})();
