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
  }).state("cart", {
    url: "/cart",
    templateUrl: "views/cart.html",
    controller: "cartController"
  }).state("search", {
    url: "/search/:search",
    templateUrl: "views/search.html",
    controller: "searchController"
  });

  $urlRouterProvider.otherwise("/");
});
"use strict";

angular.module("ccvApp").controller("cartController", function ($scope) {});
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

  // var addToCart


  getProductById();
});
"use strict";

angular.module("ccvApp").controller("searchController", function ($scope, $stateParams, mainService) {

  console.log($stateParams, "state params search");
  console.log($stateParams.search);
  var searchTerm = $stateParams.search;

  $scope.searchProduct = function (searchTerm) {
    mainService.getProductByName(searchTerm).then(function (response) {
      $scope.searchProducts = response;
      console.log(response, "controller");
      // var arr = []
      for (var i = 0; i < response.length; i++) {
        console.log(response[i].name);
      }
      console.log($scope.searchProducts);
    });
  };
});

//add $stateParams.id because sid told me to
"use strict";

angular.module("ccvApp").service("mainService", function ($http) {

  this.getAllProducts = function () {
    return $http({
      method: "GET",
      url: "/api/products"
    }).then(function (response) {
      // console.log(response.data);
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

  this.getProductByName = function (name) {
    console.log(name, "searched letters in service");
    return $http({
      method: "GET",
      url: "/api/search/" + name
    }).then(function (response) {
      console.log(response.data, "search by name");
      return response.data;
    });
  };
});
"use strict";

angular.module("ccvApp").service("productService", function ($http) {});
//# sourceMappingURL=bundle.js.map
