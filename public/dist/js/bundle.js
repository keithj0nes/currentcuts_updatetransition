"use strict";

angular.module("ccvApp", ["ui.router"]).config(function ($stateProvider, $urlRouterProvider) {

  $stateProvider.state("home", {
    url: "/",
    templateUrl: "views/home.html",
    controller: "mainController"
  }).state("products", {
    url: "/products/:id",
    templateUrl: "views/productSingle.html",
    controller: "productController"
  });

  $urlRouterProvider.otherwise("/");
});
"use strict";

angular.module("ccvApp").controller("mainController", function ($scope, mainService) {

  var getAllProducts = function getAllProducts() {
    mainService.getAllProducts().then(function (response) {
      $scope.products = response;
    });
  };

  getAllProducts();
});
"use strict";

angular.module("ccvApp").controller("productController", function ($scope, $stateParams, mainService) {

  console.log("$stateParams", $stateParams);
  console.log("$stateParams.id", $stateParams.id);

  var getProductById = function getProductById() {
    mainService.getProductById($stateParams.id).then(function (response) {
      $scope.product = response[0];
      //response[0] gives us description,id,image,name and price
      console.log($stateParams);
      console.log(response);
    });
  };

  getProductById();
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

  this.getProductById = function (id) {
    return $http({
      method: "GET",
      url: "/api/products/" + id
    }).then(function (response) {
      console.log(response.data, "in service");
      return response.data;
    });
  };
});
"use strict";

angular.module("ccvApp").service("productService", function ($http) {});
//# sourceMappingURL=bundle.js.map
