angular.module("ccvApp").controller("adminController", function($scope, mainService){

  $scope.products = [];
  $scope.selectedProductToEdit;
  console.log($scope.products);
  var getAllProducts = function(){
    mainService.getAllProducts().then(function(response){
      $scope.products = response;
      console.log($scope.products);

    })
  }

  getAllProducts();



//editProducts function displays information about specific product when called with the Edit Button
  $scope.editProducts = function(product){
    $scope.productName = product.name;
    $scope.productDescription = product.description;
    $scope.productPrice = product.price;
    $scope.productImgOne = product.img1;
    $scope.productImgTwo = product.img2;
  }

  $scope.clearForm = function(){
    $scope.productName = "";
    $scope.productDescription = "";
    $scope.productPrice = "";
    $scope.productImgOne = "";
    $scope.productImgTwo = "";
  }

//sweet alerts?
  $scope.deleteProduct = function() {
    alert("are you sure you want to delete this product?");
  }



  $scope.add = function(name, description, price, img1, img2){
    mainService.addProduct(name, description, price, img1, img2);
    console.log(name, description, price, img1, img2);
    $scope.productName = "";
    $scope.productDescription = "";
    $scope.productPrice = "";
    $scope.productImgOne = "";
    $scope.productImgTwo = "";

  }


})
