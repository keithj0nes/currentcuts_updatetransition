angular.module("ccvApp").controller("productController", function($scope, $rootScope, $stateParams, mainService, $sce){

  $scope.addToCartModal = false;
  $scope.productQuantity = 1;

// console.log($stateParams);
  // $sceDelegateProvider.resourceUrlWhitelist(['self', 'http://svgshare.com/i/**'])

  var outlineCheckbox = false;
  var getProductById = function() {
    mainService.getProductById($stateParams.id).then(function(response) {
      //response[0] gives us description, id, images, and name
      $scope.product = response[0];
      //set image on load
      $scope.vectorFile = $sce.trustAsResourceUrl(response[0].imgmainvector);
      $scope.vec = response[0].imgmainvector
      console.log($scope.vec);
      //if there's an outline image, set ng if to true to show outline toggle
      $scope.product.imgoutlinevector ? $scope.outlineImage = true : $scope.outlineImage = false;
      //change inverted image
      $scope.changeInverted = function(inverted){
        console.log(inverted);
        //if inverted = true, set the image to second outline image
        inverted ? ($scope.vectorFile = $sce.trustAsResourceUrl($scope.product.imgoutlinevector), outlineCheckbox = true) : ($scope.vectorFile= $sce.trustAsResourceUrl($scope.product.imgmainvector), outlineCheckbox = false);
      }
      //change color of vector graphic
      $scope.updateImgColor = function(productColor){
        //if productColor = true, set the new color to be selected color
        if(productColor){
          $scope.newColor = JSON.parse(productColor)
          console.log($scope.newColor.secon);
        }
      }
    })
    mainService.getProductById2($stateParams.id).then(function(response) {
      //response gives us all heights, widths and prices
      $scope.product2 = response;
    })
  }


  $scope.addFavorite = function(){
    console.log("clicked");
    mainService.addFavorite($stateParams.id).then((res) => {
      console.log(res, "res in addFavorite");
      if(res.reqUser === false){
        swal("you must be logged in")
      }
    })
  }


  $scope.addToCart = function(productColor,productQuantity, productObject){
    //create object to send to service to push to cart
    const cartData = {
      productSize: productObject.height + "H x " + productObject.width + "W",
      productColor: JSON.parse(productColor).prime,
      productQuantity: productQuantity,
      productName: $scope.product.name,
      productPrice: productObject.price,
      productImage: $scope.product.img1,
      productId: $scope.product.id,
      productOutline: outlineCheckbox
    }
    console.log(productQuantity, "TONY IS THE MAN");
// Quick fix - if quantity is zero, do not add to cart
    // if(productQuantity !== "0" || productQuantity !== 0){
    //   //send object to service to push to cart
    //   mainService.addProductsToCart(cartData);
    //
    //   $scope.addToCartModal = true;
    //
    //   $rootScope.$broadcast('cartCount')
    // } else {
    //   swal("Please update quantity number")
    // }

    if(productQuantity === 0){
      swal("Please update quantity number")
    } else {
        //send object to service to push to cart
        mainService.addProductsToCart(cartData);

        $scope.addToCartModal = true;

        $rootScope.$broadcast('cartCount')
    }
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
