describe("MenuService", () => {
  var MenuService;
  var UserPreferenceService;
  var $httpBackend;
  var ApiBasePath;

  beforeEach(function () {
    module("public");

    inject(($injector) => {
      MenuService = $injector.get("MenuService");
      $httpBackend = $injector.get("$httpBackend");
      ApiBasePath = $injector.get("ApiPath");
      UserPreferenceService = $injector.get("UserPreferenceService");
    });
  });

  it("should return a promise that resolves to true if the menu item exists", () => {
    const validShortName = "L7";
    const validResponse = "";

    $httpBackend
      .whenGET(`${ApiBasePath}/menu_items/${validShortName}.json`)
      .respond(200, validResponse);

    MenuService.doesMenuItemExist(validShortName).then((response) => {
      expect(response).toEqual(true);
    });

    $httpBackend.flush();
  });

  it("should be able to detect invalid menu item", () => {
    const invalidShortName = "Ethan";
    const invalidResponse = "Internal Server Error";

    $httpBackend
      .whenGET(`${ApiBasePath}/menu_items/${invalidShortName}.json`)
      .respond(500, invalidResponse);

    MenuService.doesMenuItemExist(invalidShortname).then((response) => {
      expect(response).toEqual(false);
    });

    $httpBackend.flush();
  });
});
