(function () {
  "use strict";

  angular.module("public").config(routeConfig);

  /**
   * Configures the routes and views
   */
  routeConfig.$inject = ["$stateProvider"];
  function routeConfig($stateProvider) {
    // Routes
    $stateProvider
      .state("public", {
        abstract: true,
        templateUrl: "src/public/public.html",
      })
      .state("public.home", {
        url: "/",
        templateUrl: "src/public/home/home.html",
      })

      // Menu and Menu Item Pages
      .state("public.menu", {
        url: "/menu",
        templateUrl: "src/public/menu/menu.html",
        controller: "MenuController",
        controllerAs: "menuCtrl",
        resolve: {
          menuCategories: [
            "MenuService",
            (MenuService) => {
              return MenuService.getCategories();
            },
          ],
        },
      })
      .state("public.menuitems", {
        url: "/menu/{category}",
        templateUrl: "src/public/menu-items/menu-items.html",
        controller: "MenuItemsController",
        controllerAs: "menuItemsCtrl",
        resolve: {
          menuItems: [
            "$stateParams",
            "MenuService",
            ($stateParams, MenuService) => {
              return MenuService.getMenuItems($stateParams.category);
            },
          ],
        },
      })

      // Order Page (Cart & Checkout)
      .state("public.order", {
        url: "/order",
        templateUrl: "src/public/order/order.html",
        controller: "OrderController",
        controllerAs: "orderCtrl",
      })

      // Signup Page
      .state("public.signup", {
        url: "/signup",
        templateUrl: "src/public/signup/signup.html",
        controller: "SignupController",
        controllerAs: "signupCtrl",
      })

      // Info Page
      .state("public.info", {
        url: "/info",
        templateUrl: "src/public/info/info.html",
        controller: "InfoController",
        controllerAs: "infoCtrl",
        resolve: {
          userPreferences: [
            "UserPreferenceService",
            (UserPreferenceService) => {
              return UserPreferenceService.getUserPreferences();
            },
          ],
          menuItem: [
            "MenuService",
            "userPreferences",
            function (MenuService, userPreferences) {
              if (!userPreferences) {
                return null;
              }
              return MenuService.getMenuItem(userPreferences.favDish)
                .then((response) => response)
                .catch(() => null);
            },
          ],
        },
      });
  }
})();
