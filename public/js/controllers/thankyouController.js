angular.module("ccvApp").controller("thankyouController", function($scope, $rootScope, $state, mainService){

  mainService.getThankYouById($state.params.orderid).then(function(response){
    if(response.length >= 1){
      $rootScope.$broadcast('cartCount')
      $scope.thankyouResponse = true;
      $scope.orderNumber = $state.params.orderid;
      $scope.thankyouOrder = response;
      $scope.shipping = parseInt($scope.thankyouOrder[0].shipping);
    } else {
      $scope.thankyouResponse = false;
    }
  })

})
