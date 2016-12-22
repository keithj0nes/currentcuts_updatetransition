angular.module("ccvApp").controller("productController", function($scope, $stateParams, mainService){

  console.log("$stateParams", $stateParams);
  console.log("$stateParams.id", $stateParams.id);



  var getProductById = function() {
    mainService.getProductById($stateParams.id).then(function(response) {
      $scope.product = response[0];
      //response[0] gives us description,id,image,name and price
      console.log($stateParams);
      console.log(response);
    })
  }

    getProductById();
})
