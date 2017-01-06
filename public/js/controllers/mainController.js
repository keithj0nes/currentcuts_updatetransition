angular.module("ccvApp").controller("mainController", function($scope, mainService){

  $scope.userLoggedIn = false;


  var getAllProducts = function(){
    mainService.getAllProducts().then(function(response){
      $scope.products = response;
    })
  }
//   $scope.random = function(){
//    1 - Math.random();
// };
//   console.log($scope.random);

  getAllProducts();


  $scope.customer = {
      name: 'Naomi',
      address: '1600 Amphitheatre'
    };

//   var getUsername = function() {
//     mainService.getUsername().then(function(response){
//       $scope.username = response;
//       $scope.userLoggedIn = true;
// console.log($scope.userLoggedIn, "inside function");
//     })
//   }
//   console.log($scope.userLoggedIn);
//   getUsername();


})
