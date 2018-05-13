angular.module("ccvApp").controller("searchController", function($scope, $stateParams, mainService){


  $scope.searchTerm = $stateParams.search;

  mainService.getProductByName($scope.searchTerm).then(function(response){
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
