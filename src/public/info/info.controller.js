(function () {
  "use strict";

  angular.module("public").controller("InfoController", InfoController);

  InfoController.$inject = ["userPreferences", "menuItem"];
  function InfoController(userPreferences, menuItem) {
    var controller = this;
    controller.userPreferences = userPreferences;
    controller.menuItem = menuItem;
  }
})();
