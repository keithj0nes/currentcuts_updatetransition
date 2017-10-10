angular.module("ccvApp").controller("accountController", function($scope, $rootScope, $state, mainService, modalService){

  $scope.test = "testing123"

  $scope.openModal = function(id){
    modalService.Open(id);
  }

  $scope.closeMyModal = function(id){
    modalService.Close(id);
  }

  $scope.updateAccount = function(id, userName, userNameLast, userEmail, currentPass, newPass, confirmPass){
    let newEmail = {
      firstname: userName,
      lastname: userNameLast,
      email: userEmail
    }
    console.log(newEmail);
    mainService.updateAccount(newEmail).then(function(response){

      console.log(response, "logging response");
      if(response.success === true){
        $scope.updateSuccess = true;
        $scope.accountMessage = "Your account has been updated!"
      } else {
        $scope.updateSuccess = true;
        $scope.accountMessage = "Sorry, that email already exists"
      }
      $rootScope.$broadcast('signupSuccess')

      modalService.Open(id);

    })

  }

  mainService.getUsername().then(function(res){
    console.log(res);

    if(res.reqUser === false){
      $state.go('login');
    } else {
      $scope.userName = res.firstname;
      $scope.userNameLast = res.lastname;
      $scope.userEmail = res.email;
      $scope.facebookUser = res.isFBuser;
    }


  })

})
