angular.module("ccvApp", ["ui.router"])

.config(function($stateProvider, $urlRouterProvider){



  var adminResolve = {
    security: (mainService, $state) => {
      return mainService.getAuth().then(function(response){
        if(response.reqUser === false){
          $state.go("login");
        } else if (response.reqUserAdmin === false){
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
    .state("thankyou", {
      url: "/thankyou/:orderid",
      templateUrl: "views/thankyou.html",
      controller: "thankyouController"
    })
    .state("accountsettings", {
      url: "/user/account",
      templateUrl: "views/accountsettings.html",
      controller: "accountController"
    })
    .state("userfavorites", {
      url: "/user/favorites",
      templateUrl: "views/favorites.html",
      controller: "favoriteController"
    })
    .state("category", {
      url: "/categories/:catname",
      templateUrl: "views/categories.html",
      controller: "categoryController"
    })
    .state("contact", {
      url: "/contact",
      templateUrl: "views/contact.html",
      controller: "contactController"
    })
    .state("passwordreset", {
      url: "/passwordreset/:token",
      templateUrl: "views/passwordreset.html",
      controller: "passwordCtrl"
    })

    $urlRouterProvider
  .otherwise("/contact");
})
