(function () {
  "use strict";

  angular.module("public").controller("OrderController", OrderController);

  OrderController.$inject = ["OrderService", "UserPreferenceService"];
  function OrderController(OrderService, UserPreferenceService) {
    var $ctrl = this;

    $ctrl.orderPlaced = false;
    $ctrl.lastOrder = null;

    // Prefill customer details if registered
    var prefs = UserPreferenceService.getUserPreferences();
    $ctrl.customer = {
      name: prefs ? (prefs.firstName + " " + prefs.lastName).trim() : "",
      phone: prefs ? prefs.phone : "",
      email: prefs ? prefs.email : "",
      address: "Clock Tower, Lake Town, Sreebhumi Road, Kolkata, West Bengal",
      notes: "",
    };

    $ctrl.getItems = function () {
      return OrderService.getItems();
    };

    $ctrl.getTotalCount = function () {
      return OrderService.getTotalCount();
    };

    $ctrl.getTotalAmount = function () {
      return OrderService.getTotalAmount();
    };

    $ctrl.increaseItem = function (item) {
      OrderService.addItem(item);
    };

    $ctrl.decreaseItem = function (item) {
      OrderService.decreaseItem(item);
    };

    $ctrl.removeItem = function (shortName) {
      OrderService.removeItem(shortName);
    };

    $ctrl.clearOrder = function () {
      OrderService.clearOrder();
    };

    $ctrl.placeOrder = function () {
      if ($ctrl.getItems().length === 0) return;

      var itemsSnapshot = angular.copy($ctrl.getItems());
      var totalSnapshot = $ctrl.getTotalAmount();
      var orderId = "AK-" + Math.floor(100000 + Math.random() * 900000);

      $ctrl.lastOrder = {
        id: orderId,
        date: new Date(),
        customer: angular.copy($ctrl.customer),
        items: itemsSnapshot,
        total: totalSnapshot,
      };

      $ctrl.orderPlaced = true;
      OrderService.clearOrder();
    };

    $ctrl.resetOrder = function () {
      $ctrl.orderPlaced = false;
      $ctrl.lastOrder = null;
    };
  }
})();

