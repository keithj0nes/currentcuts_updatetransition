angular.module("ccvApp").controller("accountController", function($scope, $rootScope, $state, mainService, modalService){

  $scope.test = "testing123"

  let errIcon = "error";
  let sucIcon = "check_circle";

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
    //console.log(newEmail);
    mainService.updateAccount(newEmail).then(function(response){

      //console.log(response, "logging response");
      if(response.success === true){
        $scope.messageIcon = sucIcon;
        $scope.accountMessage = "Your account has been updated!"
      } else {
        $scope.messageIcon = errIcon;
        $scope.accountMessage = "Sorry, that email already exists"
      }
      $rootScope.$broadcast('signupSuccess')

      modalService.Open(id);

    })

  }

  $scope.updatePass = function(id, currentPass, newPass, confirmPass){
      let updatePass = {
        currentPass, newPass
      }
      if(newPass !== confirmPass){
        // alert("passwords don't match")
        $scope.messageIcon = errIcon;
        $scope.accountMessage = "New passwords don't match";
        // modalService.Open(id);

      } else {
        // //console.log(updatePass, "newPass");
        mainService.updatePass(updatePass).then((res) => {
          //console.log(res, "new pass");
          if(res.passwordUpdated === true){
            $scope.messageIcon = sucIcon;
            $scope.accountMessage = "Your password has been updated!";

            $scope.currentPass = "";
            $scope.newPass = "";
            $scope.confirmPass = "";
          } else if (res.passwordUpdated === false && res.passwordMatch === false){
            $scope.messageIcon = errIcon;
            $scope.accountMessage = "Your current password is incorrect";
          }

          // switch(res){
          //   case res.passwordUpdated: $scope.accountMessage = "updated!"; break;
          // }
          // modalService.Open(id);
        })
      }
      modalService.Open(id);

  }



  mainService.getUsername().then(function(res){
    //console.log(res);

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
