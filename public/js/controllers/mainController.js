angular.module("ccvApp").controller("mainController", function($scope, mainService){

  $scope.showLoadMoreBtn = false;
  $scope.loading = true;



  const getAllProducts = function(){
    mainService.getAllProducts().then(function(response){
      $scope.loading = false;
      $scope.showLoadMoreBtn = true;

      $scope.products = response.products;
      $scope.count = response.count[0].count;
      if ($scope.count <= $scope.products.length){
        $scope.showLoadMoreBtn = false;
      }
    })
  }

  $scope.loadMore = function(){
    mainService.loadMore().then((res) => {
      $scope.products = [...$scope.products, ...res]
      if ($scope.count <= $scope.products.length){
        $scope.showLoadMoreBtn = false;
      }
    })
  }

  getAllProducts();

})
