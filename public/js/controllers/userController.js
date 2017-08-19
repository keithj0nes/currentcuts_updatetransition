angular.module("ccvApp").controller("userController", function($scope, $rootScope, $state, mainService){

$scope.updateSuccess = false;

var getOrderHistory = function(){
  mainService.getOrderHistory().then(function(response){
    console.log(response, "HAHA HERE IS THE RESPONSE");
    $scope.history = response;
    // if(response.requser === false){
    //   $state.go("login");
    // }
    if(response.reqUser === false){
      $state.go("login");
    }
  })
}

$scope.updateAccount = function(userEmail){
  let newEmail = {
    email: userEmail
  }

  mainService.updateAccount(newEmail).then(function(response){
    if(response.success === true){
      $scope.updateSuccess = true;
      $scope.accountMessage = "Your account has been updated!"
    } else {
      $scope.updateSuccess = true;
      $scope.accountMessage = "Sorry, that email already exists"
    }
  })

}



if($state.params.orderid){
  console.log("order details");

  // mainService.getAuth().then(function(response){
  //   console.log(response, "userController");
  //   if(response.reqUser){
      mainService.getOrderById($state.params.orderid).then(function(response){
        console.log(response, "HERE IS THE RESPONSE");
        if(response.reqUser === false){
          console.log("no reqUser");
          $state.go("login");
        } else if(response.results === false){
          console.log("LOGGING FALSE, SENDING TO ORDERHISTOR YPAGE");
          console.log(response.results, "lol");
          $state.go("orderhistory");
        } else if (response){
          $rootScope.$broadcast('cartCount')
          // console.log(response, "here is the response");
          $scope.orderNumber = $state.params.orderid;
          $scope.orderProducts = response;
          $scope.shipping = parseInt($scope.orderProducts[0].shipping);
        }


      })
  //   } else {
  //     console.log("going to orderhistory");
  //     $state.go("orderhistory");
  //   }
  // })

} else {
  console.log("order history");
  getOrderHistory();
}


//modal to confirm account update successfull

  // var modal = document.getElementById('modalz');
  //
  // $scope.closeAccountModal = function(){
  //   $scope.updateSuccess = false;
  //   console.log($scope.updateSuccess, "close");
  // }
  // 
  // window.onclick = function(e) {
  //   console.log(e.target, "logging target");
  //   if (e.target == modal) {
  //     $scope.updateSuccess = false;
  //     $scope.$apply(); //resets digest cycle so angular knows scope.userModal updated
  //     console.log($scope.updateSuccess, "close window");
  //   }
  // }



})
