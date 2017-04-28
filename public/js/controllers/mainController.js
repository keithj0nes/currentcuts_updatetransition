angular.module("ccvApp").controller("mainController", function($scope, mainService){

  $scope.userLoggedIn = false;

  $scope.showModal = function(){
    $scope.lol = true;
    console.log($scope.lol, 'clicked');
  }


  var getAllProducts = function(){
    mainService.getAllProducts().then(function(response){
      $scope.products = response;
    })
  }

  getAllProducts();
})
