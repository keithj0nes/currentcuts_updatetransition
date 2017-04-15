angular.module("ccvApp").controller("searchController", function($scope, $stateParams, mainService){


  var searchTerm = $stateParams.search;

  mainService.getProductByName(searchTerm).then(function(response){
    $scope.searchProducts = response;
    console.log(response, "response in controller");
    console.log($scope.searchProducts, "scope search prodcutz");

    if(response.length >= 1){
      $scope.search = true;
    } else {
      $scope.search = false
    }
  })

})
