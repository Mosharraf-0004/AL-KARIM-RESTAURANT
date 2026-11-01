(function () {
  "use strict";

  angular.module("admin").config(routeConfig);

  routeConfig.$inject = ["$stateProvider"];
  function routeConfig($stateProvider) {
    $stateProvider
      .state("admin", {
        abstract: true,
        url: "/admin",
        template: "<ui-view></ui-view>",
      })
      .state("admin.auth", {
        url: "/auth",
        template:
          '<div class="container"><h2>Admin Login</h2><p>Admin area coming soon.</p></div>',
      });
  }
})();

