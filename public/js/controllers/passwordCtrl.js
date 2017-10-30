angular.module("ccvApp").controller("passwordCtrl", function($scope, $stateParams, mainService){
  console.log($stateParams, "logging stateParams");
  $scope.invalidToken = false;

  $scope.submitReset = function(pass, confirmPass){
    $scope.resetMessage = "";
    $scope.resetNewPassR = false;
    $scope.resetNewPassConfirmR = false;

    if(!pass){$scope.resetNewPassR = true;}
    if(!confirmPass){$scope.resetNewPassConfirmR = true;}


    if(pass !== confirmPass){
      $scope.resetMessage = "Passwords do not match";
    } else if(pass && confirmPass) {
      $scope.resetMessage = "HAHA YES!"
    }
  }

  if($stateParams.token){
    mainService.confirmPassResetToken($stateParams.token).then((res) => {
      console.log(res, "logging result in toekn");
      if(res.success === false){
        $scope.invalidToken = true;
      }
    })
  } else {
    $scope.invalidToken = true;
  }

})
