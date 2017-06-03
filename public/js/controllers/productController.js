angular.module("ccvApp").controller("productController", function($scope, $rootScope, $stateParams, mainService, $sce){

  // console.log("$stateParams", $stateParams);
  // console.log("$stateParams.id", $stateParams.id);

  $scope.addToCartModal = false;
  var getProductById = function() {
    mainService.getProductById($stateParams.id).then(function(response) {
      $scope.product = response[0];
      //response[0] gives us description,id,image,name and price
    })
    mainService.getProductById2($stateParams.id).then(function(response) {
      console.log(response, "HDLKKJDLGJALG");
      $scope.product2 = response;
      console.log($stateParams);
      console.log($scope.product2);
    })
  }

$scope.updateImgColor = function(productColor){
  if(productColor){
    $scope.newColor = JSON.parse(productColor)
    console.log($scope.newColor.secon);
  }

}

//set img on load
$scope.vectorFile = "img/dog1.svg"

//change img when inverted is clicked
$scope.changeInverted = function(inverted){
  console.log(inverted);
  inverted ? $scope.vectorFile = "img/dog1-inverted2.svg" : $scope.vectorFile= "img/dog1.svg";

  // if(imgz){
  //   $scope.vectorFile = "img/dog1-inverted2.svg"
  // } else {
  //   $scope.vectorFile= "img/dog1.svg";
  //   // $scope.newColor.secon = "#fff";
  // }
}

console.log($sce.isEnabled());
console.log($scope.hellooo);

$scope.funx = function(x){
  console.log(x);
}

// console.log($scope.productColor.secon, "HELLO");

  $scope.productQuantity = 1;
  $scope.addToCart = function(productColor,productQuantity, productObject){

    var productName = $scope.product.name;
    var productPrice = productObject.price;
    var productColorPrime = JSON.parse(productColor)
    // console.log(hello.prime, "HERE IS THE RICE LOL");
    var productSize = productObject.height + "H x " + productObject.width + "W";
    var productImage = $scope.product.img1;
    var productId = $scope.product.id;
    console.log(productSize, "psize");

// Quick fix - if quantity is zero, do not add to cart
    if(productQuantity !== "0"){
      mainService.addProductsToCart(productSize,productColorPrime.prime,productQuantity,productName,productPrice,productImage,productId);
      $scope.addToCartModal = true;

      $rootScope.$broadcast('cartCount')
      console.log($scope.addToCartModal);
    } else {
      swal("Please update quantity number")
    }

          // swal("Item added to cart!")


  }

  //modal to confirm item has been added to cart

  var modal = document.getElementById('modalz');

  $scope.closeModal = function(){
    $scope.addToCartModal = false;
    console.log($scope.addToCartModal, "close");
  }

  window.onclick = function(e) {
    if (e.target == modal) {
      $scope.addToCartModal = false;
      $scope.$apply(); //resets digest cycle so angular knows scope.userModal updated
      console.log($scope.addToCartModal, "close window");
    }
  }





    getProductById();
})
