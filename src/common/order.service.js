(function () {
  "use strict";

  angular.module("common").service("OrderService", OrderService);

  OrderService.$inject = ["$rootScope"];
  function OrderService($rootScope) {
    var service = this;
    var STORAGE_KEY = "alkarim_restaurant_order";

    function loadOrder() {
      try {
        var saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          return JSON.parse(saved);
        }
      } catch (e) {
        // Fallback if localStorage is inaccessible
      }
      return [];
    }

    function saveOrder(items) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      } catch (e) {}
      notifyUpdate();
    }

    function notifyUpdate() {
      var count = service.getTotalCount();
      var amount = service.getTotalAmount();
      $rootScope.orderTotalCount = count;
      $rootScope.orderTotalAmount = amount;
      $rootScope.$broadcast("order:updated", { count: count, amount: amount });
    }

    var orderItems = loadOrder();

    // Initialize rootScope values
    $rootScope.orderTotalCount = 0;
    $rootScope.orderTotalAmount = 0;
    for (var i = 0; i < orderItems.length; i++) {
      $rootScope.orderTotalCount += orderItems[i].quantity;
      $rootScope.orderTotalAmount += orderItems[i].quantity * (orderItems[i].price || 0);
    }

    service.getItems = function () {
      return orderItems;
    };

    service.getItemQuantity = function (shortName) {
      if (!shortName) return 0;
      var upper = shortName.toUpperCase();
      for (var i = 0; i < orderItems.length; i++) {
        if (orderItems[i].short_name && orderItems[i].short_name.toUpperCase() === upper) {
          return orderItems[i].quantity;
        }
      }
      return 0;
    };

    service.addItem = function (menuItem) {
      if (!menuItem || !menuItem.short_name) return;
      var upper = menuItem.short_name.toUpperCase();
      var found = false;

      for (var i = 0; i < orderItems.length; i++) {
        if (orderItems[i].short_name && orderItems[i].short_name.toUpperCase() === upper) {
          orderItems[i].quantity++;
          found = true;
          break;
        }
      }

      if (!found) {
        var price = Number(menuItem.price_large || menuItem.price_small || 150);
        var portion = menuItem.price_large
          ? (menuItem.large_portion_name || "Large")
          : (menuItem.small_portion_name || "Small");
        orderItems.push({
          short_name: menuItem.short_name,
          name: menuItem.name,
          description: menuItem.description || "",
          price: price,
          portion: portion,
          quantity: 1,
        });
      }

      saveOrder(orderItems);
    };

    service.decreaseItem = function (menuItem) {
      if (!menuItem || !menuItem.short_name) return;
      var upper = menuItem.short_name.toUpperCase();

      for (var i = 0; i < orderItems.length; i++) {
        if (orderItems[i].short_name && orderItems[i].short_name.toUpperCase() === upper) {
          orderItems[i].quantity--;
          if (orderItems[i].quantity <= 0) {
            orderItems.splice(i, 1);
          }
          break;
        }
      }

      saveOrder(orderItems);
    };

    service.removeItem = function (shortName) {
      if (!shortName) return;
      var upper = shortName.toUpperCase();
      for (var i = 0; i < orderItems.length; i++) {
        if (orderItems[i].short_name && orderItems[i].short_name.toUpperCase() === upper) {
          orderItems.splice(i, 1);
          break;
        }
      }
      saveOrder(orderItems);
    };

    service.clearOrder = function () {
      orderItems = [];
      saveOrder(orderItems);
    };

    service.getTotalCount = function () {
      var count = 0;
      for (var i = 0; i < orderItems.length; i++) {
        count += orderItems[i].quantity;
      }
      return count;
    };

    service.getTotalAmount = function () {
      var amount = 0;
      for (var i = 0; i < orderItems.length; i++) {
        amount += orderItems[i].quantity * (orderItems[i].price || 0);
      }
      return amount;
    };
  }
})();

