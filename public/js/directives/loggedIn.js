angular.module("ccvApp").directive("checkLoggedIn", function(mainService){

  return {
    restrict: "AE",
    link: function(scope, elem, attr){
      var getUsername = function() {
          mainService.getUsername().then(function(response){
            console.log(response, "LOGINGLKJSDLKGJLKDGJLKDSGJLKDGJLKDGJDLSKGJ!!!!!!!!!");
            scope.username = response.firstname;
            scope.useremail = response.email;
          // if(scope.username){
          //   scope.usernameFirst = scope.username.charAt(0);
          //   // console.log(scope.usernameFirst, "scope.usernameFirst");
          // }
          })
        }

        // modal functionality when clicking username in desktop view
        var modal = document.getElementById('my-modal');

        scope.showModal = function(){
          scope.userModal = true;
        }

        scope.closeModal = function(){
          scope.userModal = false;
        }

        window.onclick = function(e) {
          if (e.target == modal) {
            scope.userModal = false;
            scope.$apply(); //resets digest cycle so angular knows scope.userModal updated
          }
        }

        getUsername();
    }
  }


})
