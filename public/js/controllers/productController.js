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

  // $scope.timezzz = moment().format('MMM do YYYY, h:mm:ss a');
// $scope.timmy = moment().format('MMMM Do YYYY, h:mm:ss a'); // December 27th 2016, 6:53:45 pm
  // var addToCart

  // if()

  // console.log($scope.productSize.val(), "value");

  $scope.productQuantity = 1;
  $scope.addToCart = function(productSize,productColor,productQuantity){

    var productName = $scope.product.name;
    var productPrice = $scope.product.price;
    var productImage = $scope.product.img1;
    var productId = $scope.product.id
      // if($scope.productSize === undefined){
      //   swal("Please enter a size")
      // } else if($scope.productColor === undefined){
      //   swal("Please enter a color")
      // } else {
      //   mainService.addProductsToCart(productName,productSize,productColor,productQuantity);
      //   swal("Item added to cart!")
      // }
        mainService.addProductsToCart(productSize,productColor,productQuantity,productName,productPrice,productImage,productId);
          swal("Item added to cart!")

  }





    getProductById();
})
