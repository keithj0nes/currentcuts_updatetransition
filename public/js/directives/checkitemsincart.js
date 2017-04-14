angular.module("ccvApp").directive("checkitemsincart",function(){

  return {
    restrict: "AE",
    // template: "{{totalItems}}",
    // scope: {hi: '@'},

    controller: ($scope, mainService, $rootScope) => {

      mainService.getProductsInCart().then(function(response){
        console.log(response, "getProductsInCart directive");
      })

      // var getItemsInCart = mainService.getCartStorage();
      // console.log(getItemsInCart);
      // $scope.itemsInCart = getItemsInCart;
      //
      // console.log($scope.itemsInCart);
      //
      // if($scope.itemsInCart){
      //   $scope.anyItemsInCart = true;
      // }

//       $scope.anyItemsInCart = false;
//
// ////////////////////////// cart number updated only when clicking on "cart" in the nav bar //////////////////////////
//
//       $rootScope.$watch("cartQuant", function(){
//         console.log($rootScope.cartQuant, "it changed again");

        // if($rootScope.cartQuant == 0 || $rootScope.cartQuant == "undefined"){
        //   $scope.anyItemsInCart = false;
        //   console.log($scope.anyItemsInCart, "logging");
        // } else {
        //   // scope.itemsIncart = $rootScope.cartQuant;
        //   // scope.anyItemsInCart = true;
        //   $scope.anyItemsInCart = true;
        //   $scope.itemsInCart = $rootScope.cartQuant
        //   console.log($scope.itemsInCart);
        //   console.log($scope.anyItemsInCart, "logging again");
        //
        //
        //   // console.log($rootScope.cartQuant, "roosope in directive");
        // }
      // })

      // mainService.getCartStorage();

      // setTimeout(function () {
      //   mainService.getCartStorage();
      //
      // }, 8000);

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
