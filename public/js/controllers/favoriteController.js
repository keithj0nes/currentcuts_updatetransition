angular.module("ccvApp").controller("favoriteController", function($scope, $state, mainService){

  $scope.test = "here is a message";

  var getFavorites = function(){
    mainService.getFavorites().then((res)=>{
      console.log(res);
      console.log(res.length);

      if(res.reqUser === false){
        $state.go("login");
      } else if(res.length === 0){
        $scope.favorites = false;
      } else {
        $scope.favorites = res;
      }
    })
  }


getFavorites();

})
