angular.module("ccvApp").controller("searchController", function($scope, $stateParams, mainService){


  console.log($stateParams, "state params search");
  console.log($stateParams.search);
var searchTerm = $stateParams.search


  $scope.searchProduct = function(searchTerm){
    mainService.getProductByName(searchTerm).then(function(response){
      $scope.searchProducts = response;
      console.log(response, "controller");
      // var arr = []
      for(var i = 0; i < response.length; i++) {
        console.log(response[i].name);

      }
      console.log($scope.searchProducts);

    })

  }

})


//add $stateParams.id because sid told me to
