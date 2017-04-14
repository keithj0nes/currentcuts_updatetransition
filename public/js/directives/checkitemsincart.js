angular.module("ccvApp").directive("checkitemsincart",function(){

  return {
    restrict: "AE",
    controller: ($scope, mainService, $rootScope) => {

      var getNumber = function(){
        mainService.getProductsInCart().then(function(response){
          let cartTotalItems = 0;
          for(var i = 0; i < response.length; i++) {
            cartTotalItems += Number(response[i].productQuantity);
          }
          $scope.itemsInCart = cartTotalItems;
        })
      }

      getNumber();

      $scope.$on('cartCount', function(){
        getNumber();
      })
    }
  }
})
