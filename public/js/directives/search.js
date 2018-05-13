angular.module("ccvApp").directive("search",function($state){

  return {
    restrict: "AE",
    controller: function($scope, mainService, $rootScope){

      $scope.searchProduct = function(search){
        //hide and clear search form
        document.getElementsByClassName('search-box-container')[0].classList.remove('open');
        document.getElementsByClassName('search-box')[0].value = "";
        $state.go('search',{search})

      }
    }
  }
})
