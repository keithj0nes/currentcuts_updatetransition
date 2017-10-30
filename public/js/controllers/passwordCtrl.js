angular.module("ccvApp").controller("passwordCtrl", function($scope, $state, $stateParams, $timeout, mainService){
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
      $scope.resetMessage = "HAHA YES!";
      mainService.saveNewPassword($stateParams.token, {pass}).then((res) => {
        console.log(res, "loged");
        if(res.success === true){
          $scope.resetMessage = res.message += "! Redirecting..."

          $timeout(()=>{
            $state.go("login");
          }, 1500);
        }
      })
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
