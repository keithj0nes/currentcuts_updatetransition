angular.module("ccvApp").controller("searchController", function($scope, $stateParams, mainService){


  console.log($stateParams, "state params search");
  console.log($stateParams.search);
var searchTerm = $stateParams.search;

$scope.test = "HEY";
// $scope.searchProducts = [
//   {
//     name: "hello",
//     price: 555
//   }
// ];
  // $scope.searchProduct = function(searchTerm){
  //   mainService.getProductByName(searchTerm).then(function(response){
  //   // $scope.$apply(function() {
  //
  //     $scope.searchProducts = response;
  //   // })
  //   // $scope.searchProducts = response;
  //     console.log(response, "response in controller");
  //     // var arr = []
  //     // for(var i = 0; i < response.length; i++) {
  //     //   console.log(response[i].name);
  //     // }
  //     // console.log($scope.searchProducts, "should be same as line controller line 12");
  //
  //   })
  // }

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
