angular.module("ccvApp").controller("adminController", function($scope, mainService){

  $scope.products = [];
  $scope.selectedProductToEdit;
  var getAllProducts = function(){
    mainService.getAllProducts().then(function(response){
      $scope.products = response;
    })
  }

  getAllProducts();



  $scope.decalType = [
      {category:'Adventure'},
      {category:'Sports'},
      {category:'Schools'},
      {category:'Games'},
      {category:'Characters'},
      {category:'Animals'},
    ];





//editProducts function displays information about specific product when called with the Edit Button
  $scope.editProducts = function(product){
    $scope.productId = product.id;
    $scope.productName = product.name;
    $scope.productDescription = product.description;
    $scope.productPrice = product.price;
    $scope.productImgOne = product.img1;
    $scope.productImgTwo = product.img2;
  }

  $scope.clearForm = function(){
    $scope.productId = "";
    $scope.productName = "";
    $scope.productDescription = "";
    $scope.productPrice = "";
    $scope.productImgOne = "";
    $scope.productImgTwo = "";
  }


  $scope.add = function(name, description, price, img1, img2){
    mainService.addProduct(name, description, price, img1, img2);
    $scope.productId = "";
    $scope.productName = "";
    $scope.productDescription = "";
    $scope.productPrice = "";
    $scope.productImgOne = "";
    $scope.productImgTwo = "";
    getAllProducts();
  }

  $scope.update = function(id, name, description, price, img1, img2){
    mainService.updateProduct(id, name, description, price, img1, img2);
    getAllProducts();

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
    })
  }

  var getUsername = function() {
    mainService.getUsername().then(function(response){
      $scope.username = response;
    })
  }

  getUsername();

})
