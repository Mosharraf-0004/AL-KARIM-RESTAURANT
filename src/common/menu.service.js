(function () {
  "use strict";

  angular.module("common").service("MenuService", MenuService);

  MenuService.$inject = ["$http", "$q", "ApiPath"];
  function MenuService($http, $q, ApiPath) {
    var service = this;

    // Explicit beef dishes across categories
    var explicitBeefCodes = [
      "B1", "B12", "B15",
      "A11",
      "SP1", "SP4", "SP5", "SP7", "SP8",
      "L13", "L14", "L15", "L16", "L17",
      "D8", "D9", "D10",
      "FR3", "FR5",
      "NL3", "NL5",
      "NF12", "NF13",
      "CM3", "CM5",
      "PF3", "PF5",
      "CU22"
    ];

    // Dishes whose photos are "picture coming soon" placeholders or missing (404)
    var comingSoonCodes = [
      "NL4", "NL5",
      "VG13",
      "SO7",
      "SR17", "SR18", "SR19", "SR20", "SR21", "SR22", "SR23", "SR24", "SR25",
      "SR26", "SR27", "SR28", "SR29", "SR30", "SR31", "SR32", "SR33", "SR34",
      "SR35", "SR36", "SR37", "SR38", "SR39", "SR40", "SR41", "SR42", "SR43"
    ];

    function isExcludedItem(item) {
      if (!item) return false;
      var shortName = (item.short_name || "").toUpperCase();
      var name = (item.name || "").toLowerCase();
      var desc = (item.description || "").toLowerCase();

      // Check if image is flagged as not present
      if (item.image_present === false) {
        return true;
      }

      // Check dishes with "picture coming soon" placeholder photos
      if (comingSoonCodes.indexOf(shortName) !== -1) {
        return true;
      }

      // Beef category dishes (F1..F12) or Egg Foo Young dishes (FY1..FY5)
      // Note: "FR" is Fried Rice, so ignore FR
      if ((shortName.indexOf("F") === 0 && shortName.indexOf("FR") !== 0) || shortName.indexOf("FY") === 0) {
        return true;
      }

      // Explicit beef dishes across all other categories
      if (explicitBeefCodes.indexOf(shortName) !== -1) {
        return true;
      }

      // Check name text for beef or egg foo young
      if (name.indexOf("beef") !== -1 || name.indexOf("egg foo young") !== -1) {
        return true;
      }

      // Check description text (excluding L26 / L27 which get sanitized)
      if (desc.indexOf("beef") !== -1 && shortName !== "L26" && shortName !== "L27") {
        return true;
      }

      return false;
    }

    function cleanItem(item) {
      if (!item) return item;
      var cleaned = angular.copy(item);
      if (cleaned.description) {
        cleaned.description = cleaned.description
          .replace(/OR beef\s*/gi, "")
          .replace(/beef\s*OR\s*/gi, "")
          .replace(/beef,\s*/gi, "")
          .replace(/,\s*beef/gi, "")
          .replace(/beef/gi, "")
          .replace(/\$/g, "₹");
      }
      return cleaned;
    }

    function filterCategories(categories) {
      if (!angular.isArray(categories)) return categories;
      return categories.filter(function (cat) {
        var sn = (cat.short_name || "").toUpperCase();
        var nm = (cat.name || "").toLowerCase();
        // Remove Beef (F) and Egg Foo Young (FY)
        if (sn === "F" || sn === "FY") return false;
        if (nm.indexOf("beef") !== -1 || nm.indexOf("egg foo young") !== -1) return false;
        return true;
      });
    }

    function filterMenuItemsPayload(data) {
      if (!data) return data;
      var payload = angular.copy(data);

      if (payload.category && payload.category.special_instructions) {
        payload.category.special_instructions = payload.category.special_instructions.replace(/\$/g, "₹");
      }

      if (payload.menu_items && angular.isArray(payload.menu_items)) {
        payload.menu_items = payload.menu_items
          .filter(function (item) {
            return !isExcludedItem(item);
          })
          .map(cleanItem);
      } else if (angular.isArray(payload)) {
        return payload
          .filter(function (item) {
            return !isExcludedItem(item);
          })
          .map(cleanItem);
      }

      return payload;
    }

    service.getCategories = function () {
      return $http
        .get(ApiPath + "/categories.json")
        .then(function (response) {
          return filterCategories(response.data);
        });
    };

    service.getMenuItems = function (category) {
      var catUpper = (category || "").toUpperCase();
      if (catUpper === "F" || catUpper === "FY") {
        return $q.resolve({
          category: { name: "", special_instructions: "" },
          menu_items: []
        });
      }

      var config = {};
      if (category) {
        config.params = { category: category };
      }

      return $http
        .get(ApiPath + "/menu_items.json", config)
        .then(function (response) {
          return filterMenuItemsPayload(response.data);
        });
    };

    service.getMenuItem = function (shortName) {
      if (!shortName) {
        return $q.reject("No shortName provided");
      }
      var upper = shortName.toUpperCase();
      if (isExcludedItem({ short_name: upper })) {
        return $q.reject("Item not available");
      }

      return $http
        .get(ApiPath + "/menu_items/" + upper + ".json")
        .then(function (response) {
          if (isExcludedItem(response.data)) {
            return $q.reject("Item not available");
          }
          return cleanItem(response.data);
        });
    };

    service.doesMenuItemExist = function (shortname) {
      if (!shortname) {
        return $q.resolve(false);
      }
      var upper = shortname.toUpperCase();
      if (isExcludedItem({ short_name: upper })) {
        return $q.resolve(false);
      }

      return service
        .getMenuItem(shortname)
        .then(function () {
          return $q.resolve(true);
        })
        .catch(function () {
          return $q.resolve(false);
        });
    };
  }
})();