angular.module("ccvApp", ["ui.router"])

.config(function($stateProvider, $urlRouterProvider){

  $stateProvider
    .state("home",{
      url: "/",
      templateUrl: "views/home.html",
      controller: "mainController"
    })
    .state("products",{
      url: "/products/:id",
      templateUrl: "views/productSingle.html",
      controller: "productController"
    })
    .state("cart",{
      url: "/cart",
      templateUrl: "views/cart.html",
      controller: "cartController"
    })
    .state("search",{
      url: "/search/:search",
      templateUrl: "views/search.html",
      controller: "searchController"
    })

    $urlRouterProvider
  .otherwise("/");
})
