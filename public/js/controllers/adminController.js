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


  $scope.add = function(name, description, price, img1, img2){
    mainService.addProduct(name, description, price, img1, img2);
    $scope.productName = "";
    $scope.productDescription = "";
    $scope.productPrice = "";
    $scope.productImgOne = "";
    $scope.productImgTwo = "";
    getAllProducts()
  }

  $scope.delete = function(product){
    swal({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(function () {
          for (var i = $scope.products.length-1; i >= 0; i--) {
            if($scope.products[i].id === product.id){
              $scope.products.splice(i, 1);
            }
          }
          mainService.deleteProduct(product);
      // swal(
      //   'Deleted!',
      //   'Your file has been deleted.',
      //   'success'
      // )
    })
  }


})
