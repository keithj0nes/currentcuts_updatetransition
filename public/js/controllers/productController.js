angular.module("ccvApp").controller("productController", function($scope, $rootScope, $stateParams, mainService, modalService, $sce){

  $scope.productQuantity = 1;
  $scope.favorited = false;
  var outlineCheckbox = false;

  // $sceDelegateProvider.resourceUrlWhitelist(['self', 'http://svgshare.com/i/**'])

  $scope.openModal =function(id){
    modalService.Open(id);
  }

  $scope.closeMyModal = function(id){
    console.log("clicked button in controllers");
    modalService.Close(id);
  }

  var getProductById = function() {
    mainService.getProductById($stateParams.id).then(function(response) {
      //response[0] gives us description, id, images, and name
      $scope.product = response[0];
      //set image on load
      // $scope.vectorFile = $sce.trustAsResourceUrl(response[0].imgmainvector);
      $scope.vectorFile = $sce.trustAsResourceUrl("https://s3-us-west-2.amazonaws.com/currentcuts/mets.svg");
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
      $scope.product2 = response.product;
      //response gives us the total number of favorites
      console.log($scope.product2, 'p2');
      $scope.favCount = response.totalFavs[0].count;
      console.log(response);
      if(response.favFound){
        console.log(true);
        $scope.favorited = true;
      }
    })
  }


  $scope.addFavorite = function(){
    mainService.addFavorite($stateParams.id).then((res) => {
      if(res.reqUser === false){
        $scope.openModal('user-login-modal');
      } else if(res.favFound === true){
        swal("this is already a favorite");
        $scope.favorited = true;
      } else if (res[0]){
        $scope.favCount = res[0].count;
        // $scope.favorited = true;
        $scope.favorited = !$scope.favorited;

        console.log($scope.favorited ? "added to favorite!" : "delted from favorites!");
      }
    })
  }

  //checkQuantity checks to make sure the quantity entered is greater than 0
  //if not, set the productQuantity to 1
  $scope.checkQuantity = function(){
    console.log($scope.productQuantity, 'pq');
    if($scope.productQuantity <= 0){
      $scope.productQuantity = 1;
    } else if($scope.productQuantity > 20){
      $scope.productQuantity = 20;
    }
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

    if(productQuantity <= 0){
      swal("Please update quantity number")
    } else {
        //send object to service to push to cart
        mainService.addProductsToCart(cartData);
        $scope.openModal('product-added-modal');
        $rootScope.$broadcast('cartCount')
    }
  }

    getProductById();
})
