angular.module("ccvApp").directive("signupLogin", function(){

  return {
    restrict: "AE",
    controller: function($scope, mainService){

      $scope.signUp = function(firstname, lastname, email, password){
        console.log(firstname, lastname, email, password);
      }

      $scope.logIn = function(email, password){
        console.log(email, password);
      }
    }
  }
})
