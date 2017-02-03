angular.module("ccvApp").directive("checkitemsincart",function($rootScope){

  return {
    restrict: "AE",
    controller: "cartController",
    link: function(scope, elem, attr){
      // scope.itemsIncart = 1;
$rootScope.cartQuant = 20;
      console.log($rootScope.cartQuant, 'hello');
      if($rootScope.cartQuant === 0){
        scope.anyItemsInCart = false;
      } else {
        scope.itemsIncart = $rootScope.cartQuant;
        console.log($rootScope.cartQuant, "roosope in directive");
      }
    }
  }



})
