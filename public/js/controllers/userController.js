angular.module("ccvApp").controller("userController", function($scope, mainService){

var getOrderHistory = function(){
  mainService.getOrderHistory().then(function(response){
    $scope.history = response;

    console.log($scope.history, "scope.history");
  })
}

getOrderHistory();


})
