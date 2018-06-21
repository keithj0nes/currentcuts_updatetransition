angular.module("ccvApp").directive("signupLogin", function(){

  return {
    restrict: "AE",
    controller: function($scope, $rootScope, $state, mainService, modalService, $timeout){
      let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/


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
          $scope.signupMessage = "Passwords do not match"
        } else if(email){
          if(emailRegex.test(email) && firstname && lastname){
            mainService.newUserSignUp(newUser).then((res) => {
              if(res.success === false){
                $scope.signupMessage = res.message;
              } else if(res.success === true){
                // $scope.signupMessage = "Your account has been created!"
                $scope.closeMyModal('user-login-modal');
                $rootScope.$broadcast('signupSuccess')
              }
            })
          } else if(!firstname || !lastname) {
            $scope.signupMessage = "";
          } else {
            $scope.signupMessage = "Please enter a valid email";
          }
        }
      }

      $scope.logIn = function(email, password, mobile){
        $scope.loginEmailR = false;
        $scope.loginPasswordR = false;

        if(!password){$scope.loginPasswordR = true;}

        if(!email){
          $scope.loginEmailR = true;
        } else if(emailRegex.test(email)){
          if(email && password){
            const existingUser = {email, password};

            mainService.existingLogIn(existingUser).then((res) => {
              if(res.success === false){
                $scope.loginMessage = res.message;
              } else if(res.success === true){
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
        } else {
          $scope.loginMessage = "Please enter a valid email"
        }
      }

      $scope.resetPassword = function(email){
        $scope.resetMessage = "";
        $scope.resetEmailR = false;
        if(!email){
          $scope.resetEmailR = true;
        } else if(emailRegex.test(email)) {
          let emailobj = {
            email
          }
          mainService.resetPasswordEmail(emailobj).then((res) => {
            $scope.resetMessage = res.message;
          })
        } else {
          $scope.resetMessage = "Please enter a valid email";
        }
      }

      $scope.loginWithFacebook = function(){
        //console.log('clicked facebook button');
        mainService.loginWithFacebook().then((res)=>{
          //console.log(res, 'logged in! loginWithFacebook');
        })
      }

    }
  }
})
