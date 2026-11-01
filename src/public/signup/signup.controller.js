(function () {
  "use strict";

  angular.module("public").controller("SignupController", SignupController);

  SignupController.$inject = ["MenuService", "UserPreferenceService"];
  function SignupController(MenuService, UserPreferenceService) {
    var controller = this;

    controller.submit = () => {
      if (!controller.invalidMenuItem) {
        UserPreferenceService.setUserPreferences(controller.user);
        controller.saved = true;
      } else controller.saved = false;
    };

    controller.checkMenuItem = (shortName) => {
      if (shortName) {
        MenuService.doesMenuItemExist(shortName).then(
          (validity) => (controller.invalidMenuItem = !validity)
        );
      }
    };
  }
})();
