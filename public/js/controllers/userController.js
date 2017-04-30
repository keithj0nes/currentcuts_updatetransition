angular.module("ccvApp").controller("userController", function($scope, $rootScope, $state, mainService){

var getOrderHistory = function(){
  mainService.getOrderHistory().then(function(response){
    $scope.history = response;
    // console.log(response, "getOrderHistory being hit");
    // console.log($scope.history, "scope.history");
    if(response.requser === false){
      $state.go("login");
    }
  })
}

// console.log($state, "logging state");
// console.log($state.params, "logging state params");



if($state.params.orderid){
  console.log("order details");

  mainService.getAuth().then(function(response){
    console.log(response, "userController");
    if(response.reqUser){
      mainService.getOrderById($state.params.orderid).then(function(response){
        if(response.results === false){
          console.log("LOGGING FALSE, SENDING TO ORDERHISTOR YPAGE");
          $state.go("orderhistory");
        }
        $rootScope.$broadcast('cartCount')
        console.log(response, "here is the response");
        $scope.orderNumber = $state.params.orderid;
        $scope.orderProducts = response;

        $scope.shipping = parseInt($scope.orderProducts[0].shipping);

      })
    } else {
      console.log("going to orderhistory");
      $state.go("orderhistory");
    }
  })

} else {
  console.log("order history");
  getOrderHistory();
}






})
