angular.module("ccvApp").directive("checkLoggedIn", function(mainService, modalService){

  return {
    restrict: "AE",
    link: function(scope, elem, attr){
      var getUsername = function() {
          mainService.getUsername().then(function(response){
            scope.username = response.firstname;
            scope.useremail = response.email;

          })
        }

        // modal functionality when clicking username in desktop view
        scope.openModal =function(id){
          modalService.Open(id);
        }

        scope.closeMyModal = function(id){
          modalService.Close(id);
        }

        getUsername();
    }
  }


})
