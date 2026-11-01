(function () {
  "use strict";

  angular.module("public").component("menuCategory", {
    templateUrl: "src/public/menu-category/menu-category.html",
    bindings: {
      category: "<",
    },
    controller: MenuCategoryController,
  });

  MenuCategoryController.$inject = ["ApiPath"];
  function MenuCategoryController(ApiPath) {
    var $ctrl = this;
    $ctrl.basePath = ApiPath;
  }
})();
