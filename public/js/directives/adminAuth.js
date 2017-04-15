angular.module("ccvApp").directive("adminAuth", function(){

  return {
    restrict: "AE",
    controller: function($scope, mainService){

      mainService.getAuth().then(function(response){
        console.log(response, "response in adminAuth directive");
        if(response.data = " "){
          $scope.auth = true;
        }
      })

    }
  }

})
