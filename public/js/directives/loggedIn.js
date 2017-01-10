angular.module("ccvApp").directive("checkLoggedIn", function(mainService){

  return {
    restrict: "AE",
    // templateUrl: './views/checkloggedindirective.html',
    // controller: "cartController",
    link: function(scope, elem, attr){
      var getUsername = function() {
          mainService.getUsername().then(function(response){
            scope.username = response;
            // console.log(scope.username, "inside directive");
        // console.log(scope.userLoggedIn, "inside directive");
          })
        }
        // setTimeout(function () {

        // }, 1000);
        getUsername();
    }
  }


})
