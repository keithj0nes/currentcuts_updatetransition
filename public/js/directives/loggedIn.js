angular.module("ccvApp").directive("checkLoggedIn", function(mainService){

  return {
    restrict: "AE",
    // templateUrl: './views/checkloggedindirective.html',
    // controller: "cartController",
    link: function(scope, elem, attr){
      // scope.test = "hello"
      console.log("HELLO");
      scope.userLoggedIn = false;
      var getUsername = function() {
          mainService.getUsername().then(function(response){
            scope.username = response;
            console.log(scope.username, "inside directive");
            // scope.userLoggedIn = true;
        // console.log(scope.userLoggedIn, "inside directive");
          })
        }
        // setTimeout(function () {
          console.log(scope.userLoggedIn, "outside function");

        // }, 1000);
        getUsername();
    }
  }


})
