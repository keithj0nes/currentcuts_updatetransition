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
        var modal = document.getElementById('my-modal');

        scope.showModal = function(){
          console.log("shoing modal");
          scope.userModal = true;
        }

        scope.closeModal = function(){
          console.log('closing modal');
          scope.userModal = false;
        }

        window.onclick = function(e) {
          if (e.target == modal) {
            scope.userModal = false;
            scope.$apply(); //resets digest cycle so angular knows scope.userModal updated
          }
        }


        scope.openModal =function(id, track, note){
          console.log(track, "loggig");
          console.log("openModal in controller");
          console.log(id, track, note);
              modalService.Open(id, track);
          }

        scope.closeMyModal = function(id){
          console.log(id,"clicked button in loggied");
          modalService.Close(id);
        }

        // $scope.completeOrder = function(id, track, note){
        //   console.log(track, note);
        //   modalService.Close(id);
        //   console.log($scope.parentIndex, "logging parent");
        //   $scope.getOpenOrders()
        //   // console.log($scope.open);
        //   // $scope.open.trackingNumber = "";
        //   // console.log($scope.open.trackingNumber, "sam is kool");
        // }

        getUsername();
    }
  }


})
