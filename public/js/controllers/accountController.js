angular.module("ccvApp").controller("accountController", function($scope, $state, mainService){

  $scope.test = "testing123"



  mainService.getUsername().then(function(res){
    console.log(res);

    if(res.reqUser){
      $scope.userName = response.firstname;
      $scope.userEmail = response.email;
    } else {
      $state.go('login');
    }


  })

})
