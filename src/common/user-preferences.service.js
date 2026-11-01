(function () {
  "use strict";

  angular
    .module("common")
    .service("UserPreferenceService", UserPreferenceService);

  UserPreferenceService.$inject = [];
  function UserPreferenceService() {
    const service = this;
    var preferences;

    service.getUserPreferences = () => {
      return preferences;
    };

    service.setUserPreferences = (userPreferences) => {
      preferences = userPreferences;
    };
  }
})();
