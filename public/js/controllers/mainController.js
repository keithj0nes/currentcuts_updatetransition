angular.module("ccvApp").controller("mainController", function($scope, mainService){



  var getAllProducts = function(){
    mainService.getAllProducts().then(function(response){
      $scope.products = response;
    })
  }

  getAllProducts();

})
