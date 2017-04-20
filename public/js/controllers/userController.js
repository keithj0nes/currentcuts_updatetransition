angular.module("ccvApp").controller("userController", function($scope, $rootScope, $state, mainService){

var getOrderHistory = function(){
  mainService.getOrderHistory().then(function(response){
    $scope.history = response;
    console.log("getOrderHistory being hit");
    // console.log($scope.history, "scope.history");
  })
}

console.log($state, "logging state");
console.log($state.params, "logging state params");



if($state.params.orderid){
  console.log(true);
  mainService.getOrderById($state.params.orderid).then(function(response){
    $rootScope.$broadcast('cartCount')
    console.log(response, "here is the response");
    $scope.orderProducts = response
  })
} else {
  console.log(false);
  getOrderHistory();
}






})
