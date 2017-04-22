angular.module("ccvApp", ["ui.router"])

.config(function($stateProvider, $urlRouterProvider){



  var adminResolve = {
    security: (mainService, $state) => {
      return mainService.getAuth()
        .catch((err) => {
          console.log(err);
          if(err.status === 401){
            $state.go("login");
          } else if (err.status === 403){
            $state.go("home");
          }
        })
    }
  }



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
    .state("login",{
      url: "/login",
      templateUrl: "views/login.html",
      // controller: "adminController"
    })
    .state("loginsuccess",{
      url: "/login-success",
      templateUrl: "views/login-success.html",
      // controller: "adminController"
    })
    .state("adventure",{
      url: "/adventure",
      templateUrl: "views/categories/adventure.html",
      // controller: "adminController"
    })
    .state("admin",{
      url: "/admin",
      templateUrl: "views/admin.html",
      controller: "adminController",
      resolve: adminResolve
    })
    .state("orderhistory",{
      url: "/orders",
      templateUrl: "views/orderhistory.html",
      controller: "userController"
    })
    .state("orderdetails", {
      url: "/orders/:orderid",
      templateUrl: "views/orderdetails.html",
      controller: "userController"
    })

    $urlRouterProvider
  .otherwise("/");
})
