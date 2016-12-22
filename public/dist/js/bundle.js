"use strict";

angular.module("ccvApp", ["ui.router"]).config(function ($stateProvider, $urlRouterProvider) {

  $stateProvider.state("home", {
    url: "/",
    templateUrl: "views/home.html",
    controller: "mainController"
  });
  // .state("stats",{
  //   url: "/stats",
  //   templateUrl: "views/stats.html",
  //   controller: "statsController"
  // })

  $urlRouterProvider.otherwise("/");
});
"use strict";

angular.module("ccvApp").service("mainService", function ($http) {

  this.getAllProducts = function () {

    return $http({
      method: "GET",
      url: "/api/products"
    }).then(function (response) {

      console.log(response.data);
      return response.data;
    });
  };
});
"use strict";

angular.module("ccvApp").controller("mainController", function ($scope, mainService) {

  var getAllProducts = function getAllProducts() {
    mainService.getAllProducts().then(function (response) {
      $scope.products = response;
    });
  };

  getAllProducts();
  // console.log(mainService.getAllProducts());
});
//# sourceMappingURL=bundle.js.map
