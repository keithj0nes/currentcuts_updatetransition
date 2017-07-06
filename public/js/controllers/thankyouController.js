angular.module("ccvApp").controller("thankyouController", function($scope, $state, mainService){

  console.log($state.params.orderid, "order id passed from cart");
  $scope.test = $state.params.orderid + " here is order id haha"

  mainService.getThankYouById($state.params.orderid).then(function(response){
    console.log(response, "HERE IS THE RESPONSE");
    $scope.orderNumber = $state.params.orderid;
    $scope.thankyouOrder = response;
    $scope.shipping = parseInt($scope.thankyouOrder[0].shipping);

    // if(response.results === false){
    //   console.log("LOGGING FALSE, SENDING TO ORDERHISTOR YPAGE");
    //   console.log(response.results, "lol");
    //   $state.go("orderhistory");
    // } else if (response){
    //   $rootScope.$broadcast('cartCount')
    //   console.log(response, "here is the response");
    //   $scope.orderNumber = $state.params.orderid;
    //   $scope.orderProducts = response;
    //   $scope.shipping = parseInt($scope.orderProducts[0].shipping);
    // }


  })

})
