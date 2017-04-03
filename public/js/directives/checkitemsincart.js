angular.module("ccvApp").directive("checkitemsincart",function($rootScope){

  return {
    restrict: "AE",
    // template: "({{totalItems}})",

    controller: "cartController",
    link: function(scope, elem, attr){
      // scope.itemsIncart = 1;
// $rootScope.totalItems = 20;
      console.log($rootScope.cartQuant, 'hello');
      // if($rootScope.cartQuant === 0){
      //   scope.anyItemsInCart = false;
      // } else {
      //   // scope.itemsIncart = $rootScope.cartQuant;
      //   scope.totalItems = $rootScope.cartQuant
      //   console.log($rootScope.cartQuant, "roosope in directive");
      // }

      $rootScope.$watch("cartQuant", function(){
        console.log("it changed again");
      })
    }


// template: "({{totalItems}})",
// scope: {},
// controller: ($scope, mainService, $rootScope, $state) => {
//   $rootScope.$watch('cartTotal', function(){
//     console.log('it changed');
//     console.log($rootScope.cartQuant);
//     $scope.totalItems = $rootScope.cartQuant
//   })
// }
  }



})
