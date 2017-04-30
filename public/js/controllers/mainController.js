angular.module("ccvApp").controller("mainController", function($scope, mainService){

  // $scope.userLoggedIn = false;

  var getAllProducts = function(){
    mainService.getAllProducts().then(function(response){
      $scope.products = response;
    })
  }

  getAllProducts();
})
