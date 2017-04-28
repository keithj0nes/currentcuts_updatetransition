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
          if(scope.username){
            scope.usernameFirst = scope.username.charAt(0);
            console.log(scope.usernameFirst, "scope.usernameFirst");
          }
          })
        }
        // setTimeout(function () {

        // }, 1000);
        var modal = document.getElementById('my-modal');

        scope.showModal = function(){
          scope.userModal = true;
          console.log(scope.userModal, 'show');
        }

        scope.closeModal = function(){
          scope.userModal = false;
          console.log(scope.userModal, 'close');
        }

        window.onclick = function(event) {
          console.log(event.target, "clicked window");
          if (event.target == modal) {
            scope.userModal = false;
            scope.$apply(); //resets digest cycle so angular knows scope.userModal updated
            console.log(scope.userModal, 'close again');
          }
        }

        getUsername();
    }
  }


})
