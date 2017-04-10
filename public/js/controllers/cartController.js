angular.module("ccvApp").controller("cartController", function($scope, $rootScope, mainService){

  $scope.cartTotal = 0;
  $scope.shippingCost = 0;
  $scope.orderTotal = 0;
  $rootScope.cartQuant = 0;

  // setTimeout(function () {
  //   $rootScope.cartQuant = 20;
  //
  // }, 2000);
  //
  // setTimeout(function () {
  //   $rootScope.cartQuant = 0;
  //
  // }, 5000);


  $scope.addShippingInfo = ()=>{
    $rootScope.details = {
      recNameFirst: "Keith",
      recNameLast: "THEbest",
      address1: "123 4th st.",
      address2: "apt 255",
      city: "Seattle",
      state: "WA",
      zip: "99999"
    }

    console.log($rootScope.details);

    // mainService.addShippingInfo($rootScope.details);
  }

  $scope.cartDelete = function(item){
    mainService.deleteProductsInCart(item).then(function(response){
      $scope.cart = response.data;
      var costs = calculate($scope.cart);

      $scope.cartTotal = costs.total;
      $scope.shippingCost = costs.shipping;
      $scope.orderTotal = costs.total + costs.shipping;
    });
  }

  function calculate(cart) {
    var total = 0;
    var shipping = 0;

    for (var i = 0; i < cart.length; i++) {
      total += (parseInt(cart[i].productPrice) * parseInt(cart[i].productQuantity));
    }
    console.log(total, "calculate total");
         if (total >= 1 && total <= 9 ){
           shipping = 2;
         } else if (total >= 10){
           shipping = 3;
         }
    return {
      total: total, //whatever the cost is,
      shipping: shipping //whatever shipping is
    }
  }

  let findTotalItems = () => {
    $scope.cartTotalItems = 0;
    for(var i = 0; i < $scope.cart.length; i++) {
      $scope.cartTotalItems += Number($scope.cart[i].productQuantity);
      mainService.cartStorage.push($scope.cart[i].productQuantity)
    }
    console.log($scope.cartTotalItems, "total items function here");
    mainService.getCartStorage();
    return $scope.cartTotalItems;
  }

// findTotalItem();
  mainService.getProductsInCart().then(function(response){

    $scope.cart = response;
    console.log($scope.cart, "SCOPE DOT CART");

    var costs = calculate($scope.cart);

    $scope.cartTotal = costs.total;
    $scope.shippingCost = costs.shipping;
    $scope.orderTotal = costs.total + costs.shipping;


    console.log($scope.cart, "in controller");
    // $rootScope.cartQuant = 0;
    // for (var i = 0; i < $scope.cart.length; i++) {
    //   $rootScope.cartQuant += (parseInt($scope.cart[i].productQuantity));
    //   console.log($rootScope.cartQuant, "cartQuant");
    // }

    $rootScope.cartQuant = findTotalItems();
  });




  // var getProductsInCart = function(){
  //   mainService.getProductsInCart().then(function(response){
  //     console.log(response, "in controller");
  //     $scope.cart = response;
  //     $scope.cartTotal = 0;
  //     console.log($scope.cart.length, "hajksdhgjlka;sdjgl;asd");
  //
  //     var calculate = function(){
  //       for (var i = 0; i < $scope.cart.length; i++) {
  //         $scope.cartTotal += (parseInt($scope.cart[i].productPrice) * parseInt($scope.cart[i].productQuantity));
  //         console.log($scope.cart[i].productQuantity);
  //         console.log($scope.cart[i].productPrice);
  //         //discount if 5 or more items
  //         // if ($scope.cart[i].productQuantity >= 5){
  //         //   $scope.cart[i].productPrice *= .95
  //         // }
  //       }
  //       console.log($scope.cartTotal);
  //
  //       $scope.shippingCost = 0;
  //       if ($scope.cartTotal >= 1 && $scope.cartTotal <= 9 ){
  //         $scope.shippingCost = 2;
  //       } else if ($scope.cartTotal >= 10){
  //         $scope.shippingCost = 3;
  //       }
  //
  //       $scope.orderTotal = $scope.cartTotal + $scope.shippingCost;
  //
  //       $scope.cartDelete = function(item){
  //         for(var i = $scope.cart.length-1; i>=0; i--){
  //           if($scope.cart[i].productName === item.productName){
  //             $scope.cart.splice(i, 1);
  //             $scope.cartTotal -= (parseInt($scope.cart[i].productPrice) * parseInt($scope.cart[i].productQuantity));
  //           }
  //         }
  //         calculate();
  //       }
  //     }
  //     calculate();
  //
  //
  //
  //   })
  // }

  // getProductsInCart();

  // $scope.itemTotal =

})
