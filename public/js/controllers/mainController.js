angular.module("ccvApp").controller("mainController", function($scope, mainService){

  // $scope.userLoggedIn = false;

  var getAllProducts = function(){
    mainService.getAllProducts().then(function(response){
      $scope.products = response;
    })
  }

  $scope.loadMore = function(){
    console.log('ah');
    mainService.loadMore().then((res) => {
      console.log(res, 'resssssssssss conttroller');
      $scope.products = [...$scope.products, ...res]
      console.log($scope.products);
    })
  }
  getAllProducts();
})
