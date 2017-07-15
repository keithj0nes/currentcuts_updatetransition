angular.module("ccvApp").controller("favoriteController", function($scope, $state, mainService){

  $scope.test = "here is a message";

  var getFavorites = function(){
    mainService.getFavorites().then((res)=>{
      if(res.reqUser === false){
        $state.go("login");
      } else {
        $scope.favorites = res;
      }
    })
  }


getFavorites();

})
