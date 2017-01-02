angular.module("ccvApp").controller("searchController", function($scope, $stateParams, mainService){


  console.log($stateParams, "state params search");
  console.log($stateParams.search);
var searchTerm = $stateParams.search;

$scope.test = "HEY";

console.log(searchTerm, "searchTerm");

    mainService.getProductByName(searchTerm).then(function(response){
      $scope.searchProducts = response;
      console.log(response, "response in controller");
      console.log($scope.searchProducts, "scope search prodcutz");
    })





  setTimeout(function () {
    console.log($scope.searchProducts);

  }, 4000);

})
