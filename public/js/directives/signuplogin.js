angular.module("ccvApp").directive("signupLogin", function(){

  return {
    restrict: "AE",
    controller: function($scope, $rootScope, $state, mainService, modalService){


      $scope.openModal =function(id){
        modalService.Open(id);
      }

      $scope.closeMyModal = function(id){
        modalService.Close(id);
      }

      $scope.existingUserLogin = true;

      $scope.signUp = function(firstname, lastname, email, password, confirmPassword){
        const newUser = {firstname, lastname, email, password};
        $scope.signupFirstnameR = false;
        $scope.signupLastnameR = false;
        $scope.signupEmailR = false;
        $scope.signupPasswordR = false;
        $scope.signupConfirmPassR = false;
        $scope.passwordMatchMessage = "";


        if(!firstname){$scope.signupFirstnameR = true;}
        if(!lastname){$scope.signupLastnameR = true;}
        if(!email){$scope.signupEmailR = true;}
        if(!password){$scope.signupPasswordR = true;}
        if(!confirmPassword){$scope.signupConfirmPassR = true;}

        if(password !== confirmPassword){
          $scope.passwordMatchMessage = "Passwords do not match"
        } else if(email){

          console.log("getting here");
          mainService.newUserSignUp(newUser).then((res) => {
            console.log(res, "response in newUserSignUp");

            if(res.success === false){
              $scope.signupMessage = res.message;
            }

            if(res.success === true){
              // $scope.signupMessage = "Your account has been created!"
              $scope.closeMyModal('user-login-modal');
              $rootScope.$broadcast('signupSuccess')
            }
          })
        }
      }

      $scope.logIn = function(email, password, mobile){

        $scope.loginEmailR = false;
        $scope.loginPasswordR = false;
        console.log(mobile);

        if(!email){$scope.loginEmailR = true;}
        if(!password){$scope.loginPasswordR = true;}

        if(email && password){
          const existingUser = {email, password};

          mainService.existingLogIn(existingUser).then((res) => {
            console.log(res, "response in existingLogIn");

            if(res.success === false){
              $scope.loginMessage = res.message;
            }

            if(res.success === true){
              // $scope.signupMessage = "Your account has been created!"
              if(mobile){
                $state.go('loginsuccess')
              } else {
                $scope.closeMyModal('user-login-modal');

              }
              $rootScope.$broadcast('signupSuccess')
            }
          })
        }


        // console.log(existingUser);
      }


      $scope.resetPassword = function(email){
        $scope.resetMessage = false;
        console.log(email, "email");
        $scope.resetEmailR = false;
        if(!email){
          $scope.resetEmailR = true;
        } else {
          let emailobj = {
            email
          }
          mainService.resetPasswordEmail(emailobj)
          $scope.resetMessage = "email sent"
        }

      }

    }
  }
})
