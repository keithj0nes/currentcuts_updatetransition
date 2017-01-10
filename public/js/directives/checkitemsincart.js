angular.module("ccvApp").directive("checkitemsincart",function(){

  return {
    restrict: "AE",
    controller: "cartController",
    link: function(scope, elem, attr){
      scope.itemsIncart = 1;
      scope.$watch(console.log(scope.cart, "total"));
      scope.$watch(console.log(scope.cartQuant, "inside directive"));

      if(scope.itemsIncart === 0){
        scope.anyItemsInCart = false;
      }
    }
  }



})
