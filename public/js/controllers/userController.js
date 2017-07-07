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

$scope.test = "here is a test"
// console.log($state, "logging state");
// console.log($state.params, "logging state params");



if($state.params.orderid){
  console.log("order details");

  mainService.getAuth().then(function(response){
    console.log(response, "userController");
    if(response.reqUser){
      mainService.getOrderById($state.params.orderid).then(function(response){
        console.log(response, "HERE IS THE RESPONSE");
        if(response.results === false){
          console.log("LOGGING FALSE, SENDING TO ORDERHISTOR YPAGE");
          console.log(response.results, "lol");
          $state.go("orderhistory");
        } else if (response){
          $rootScope.$broadcast('cartCount')
          console.log(response, "here is the response");
          $scope.orderNumber = $state.params.orderid;
          $scope.orderProducts = response;
          $scope.shipping = parseInt($scope.orderProducts[0].shipping);
        }


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
