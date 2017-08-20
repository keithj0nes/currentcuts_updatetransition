angular.module("ccvApp").directive("checkLoggedIn", function(mainService, modalService){

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
        scope.openModal =function(id){
          console.log("openModal in controller");
          modalService.Open(id);
        }

        scope.closeMyModal = function(id){
          console.log(id,"clicked button in loggied");
          modalService.Close(id);
        }

        getUsername();
    }
  }


})
