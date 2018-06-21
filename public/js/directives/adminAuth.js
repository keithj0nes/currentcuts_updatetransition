angular.module("ccvApp").directive("adminAuth", function(){

  return {
    restrict: "AE",
    controller: function($scope, mainService){

      mainService.getAuth().then(function(response){
        // //console.log(response);
        if(response.reqUserAdmin === true){
          $scope.auth = true;
        }
      })
    }
  }
})
