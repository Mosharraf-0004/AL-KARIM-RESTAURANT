(function () {
  "use strict";

  angular.module("public").component("menuItem", {
    templateUrl: "src/public/menu-item/menu-item.html",
    bindings: {
      menuItem: "<",
    },
    controller: MenuItemController,
  });

  MenuItemController.$inject = ["ApiPath", "OrderService"];
  function MenuItemController(ApiPath, OrderService) {
    var $ctrl = this;
    $ctrl.basePath = ApiPath;

    $ctrl.getQuantity = function () {
      if (!$ctrl.menuItem) return 0;
      return OrderService.getItemQuantity($ctrl.menuItem.short_name);
    };

    $ctrl.addItem = function ($event) {
      if ($event) {
        $event.preventDefault();
        $event.stopPropagation();
      }
      OrderService.addItem($ctrl.menuItem);
    };

    $ctrl.decreaseItem = function ($event) {
      if ($event) {
        $event.preventDefault();
        $event.stopPropagation();
      }
      OrderService.decreaseItem($ctrl.menuItem);
    };
  }
})();
