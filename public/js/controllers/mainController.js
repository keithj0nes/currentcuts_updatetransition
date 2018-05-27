angular.module("ccvApp").controller("mainController", function($scope, mainService){

  //how many products per limit
  const row = 3;

  const getAllProducts = function(){
    mainService.getAllProducts().then(function(response){
      $scope.products = response.products;
      $scope.count = response.count[0].count - row;
    })
  }

  $scope.loadMore = function(){
    $scope.count -= row;
    mainService.loadMore().then((res) => {
      $scope.products = [...$scope.products, ...res]
    })
  }
  getAllProducts();
})
