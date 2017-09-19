angular.module("ccvApp").directive("signupLogin", function(){

  return {
    restrict: "AE",
    controller: function($scope, $rootScope, mainService){

      $scope.existingUserLogin = true;

      $scope.signUp = function(firstname, lastname, email, password, confirmPassword){
        const newUser = {firstname, lastname, email, password};
        // console.log(newUser);
        $scope.signupFirstnameR = false;
        $scope.signupLastnameR = false;
        $scope.signupEmailR = false;
        $scope.signupPasswordR = false;
        $scope.signupConfirmPassR = false;


        if(!firstname){$scope.signupFirstnameR = true;}
        if(!lastname){$scope.signupLastnameR = true;}
        if(!email){$scope.signupEmailR = true;}
        if(!password){$scope.signupPasswordR = true;}
        if(!confirmPassword){$scope.signupConfirmPassR = true;}

        if(email){
          mainService.newUserSignUp(newUser).then((res) => {
            console.log(res, "response in newUserSignUp");

            if(res.success === false){
              $scope.signupMessage = "Email is already being used"
            }

            if(res.success === true){
              $scope.signupMessage = "Your account has been created!"
              $rootScope.$broadcast('signupSuccess')
            }
          })
        }


      }

      $scope.logIn = function(email, password){

        const existingUser = {email, password};

        mainService.existingLogIn(existingUser).then((res) => {
          console.log(res, "response in existingLogIn");
        })

        // console.log(existingUser);
      }

    }
  }
})
