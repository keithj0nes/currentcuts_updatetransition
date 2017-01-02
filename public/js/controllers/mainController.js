angular.module("ccvApp").controller("mainController", function($scope, mainService){



  var getAllProducts = function(){
    mainService.getAllProducts().then(function(response){
      $scope.products = response;
    })
  }
//   $scope.random = function(){
//    1 - Math.random();
// };
//   console.log($scope.random);

  getAllProducts();


})
