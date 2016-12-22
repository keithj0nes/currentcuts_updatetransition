angular.module("ccvApp", ["ui.router"])

.config(function($stateProvider, $urlRouterProvider){

  $stateProvider
    .state("home",{
      url: "/",
      templateUrl: "views/home.html",
      controller: "mainController"
    })
    // .state("stats",{
    //   url: "/stats",
    //   templateUrl: "views/stats.html",
    //   controller: "statsController"
    // })

    $urlRouterProvider
  .otherwise("/");
})
