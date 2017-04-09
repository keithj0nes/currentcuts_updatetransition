angular.module("ccvApp").directive("checkitemsincart",function(){

  return {
    restrict: "AE",
    // template: "{{totalItems}}",
    // scope: {},

    controller: ($scope, mainService, $rootScope) => {

      $rootScope.$watch("cartQuant", function(){
      console.log($rootScope.cartQuant, "it changed again");

        if($rootScope.cartQuant === 0 || $rootScope.cartQuant === "undefined"){
          $scope.anyItemsInCart = false;
          console.log($scope.anyItemsInCart, "logging");
        } else {
          // scope.itemsIncart = $rootScope.cartQuant;
          // scope.anyItemsInCart = true;
          $scope.anyItemsInCart = true;
          $scope.itemsInCart = $rootScope.cartQuant
          console.log($scope.itemsInCart);
          console.log($scope.anyItemsInCart, "logging again");


          // console.log($rootScope.cartQuant, "roosope in directive");
        }
      })


}



    // controller: "cartController",
    // link: function(scope, elem, attr){
    //
    //   $rootScope.$watch("cartQuant", function(){
    //   console.log($rootScope.cartQuant, "it changed again");
    //
    //     if($rootScope.cartQuant === 0 || $rootScope.cartQuant === "undefined"){
    //       scope.anyItemsInCart = false;
    //       console.log(scope.anyItemsInCart, "logging");
    //     } else {
    //       // scope.itemsIncart = $rootScope.cartQuant;
    //       // scope.anyItemsInCart = true;
    //       scope.anyItemsInCart = true;
    //       scope.itemsInCart = $rootScope.cartQuant
    //       console.log(scope.anyItemsInCart, "logging again");
    //
    //
    //       // console.log($rootScope.cartQuant, "roosope in directive");
    //     }
    //   })
    //
    //
    //
    // }



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
