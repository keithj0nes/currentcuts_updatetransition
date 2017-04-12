angular.module("ccvApp").controller("cartController", function($scope, $http, $state, $rootScope, mainService){

  $scope.cartTotal = 0;
  $scope.shippingCost = 0;
  $scope.orderTotal = 0;
  $rootScope.cartQuant = 0;
  let shipAddressConfirmed;

  // setTimeout(function () {
  //   $rootScope.cartQuant = 20;
  //
  // }, 2000);
  //
  // setTimeout(function () {
  //   $rootScope.cartQuant = 0;
  //
  // }, 5000);
// if($scope.details){
//   $scope.shipNameFirst = $rootScope.details.recNameFirst;
//   $scope.shipNameLast = $rootScope.details.recNameLast;
//   $scope.shipAddress = $rootScope.details.address1;
//   $scope.shipAddress2 = $rootScope.details.address2;
//   $scope.shipCity = $rootScope.details.city;
//   $scope.shipState = $rootScope.details.state;
//   $scope.shipZip = $rootScope.details.zip;
//   $scope.shipNote = $rootScope.note.note;
//   console.log("shipAddressConfirmed is true");
// } else {
//   console.log("shipAddressConfirmed is false :(");
// }

// console.log(shipAddressConfirmed, "here is shipAddressConfirmed");
  // $scope.addShippingInfo = (fname, lname, add, add2, city, state, zip, note)=>{
  //   shipAddressConfirmed = true;
  //   console.log(shipAddressConfirmed, "shipAddressConfirmed");
  //   $scope.details = {
  //     recNameFirst: fname,
  //     recNameLast: lname,
  //     address1: add,
  //     address2: add2,
  //     city: city,
  //     state: state,
  //     zip: zip
  //   }
  //
  //   $rootScope.note = {
  //     note: note
  //   }
  //   // $rootScope.details = {
  //   //   recNameFirst: "Keith",
  //   //   recNameLast: "THEbest",
  //   //   address1: "123 4th st.",
  //   //   address2: "apt 255",
  //   //   city: "Seattle",
  //   //   state: "WA",
  //   //   zip: "99999"
  //   // }
  //
  //   console.log($scope.details, "details in addShippingInfo function");
  //   console.log($rootScope.note, "note in addShippingInfo function");
  //
  //
  //   // mainService.addShippingInfo($rootScope.details);
  // }

    // $rootScope.details = {
    //   recNameFirst: $scope.shipNameFirst,
    //   recNameLast: $scope.shipNameLast,
    //   address1: $scope.shipAddress,
    //   address2: $scope.shipAddress2,
    //   city: $scope.shipCity,
    //   state: $scope.shipState,
    //   zip: $scope.shipZip
    // }

    // $rootScope.fun = function(){
    //   console.log($scope.shipNameFirst);
    //   return $rootScope.details = {
    //     recNameFirst: $scope.shipNameFirst,
    //     recNameLast: $scope.shipNameLast,
    //     address1: $scope.shipAddress,
    //     address2: $scope.shipAddress2,
    //     city: $scope.shipCity,
    //     state: $scope.shipState,
    //     zip: $scope.shipZip
    //   }
    //   // console.log($rootScope.fun);
    // }

  $scope.cartDelete = function(item){
    mainService.deleteProductsInCart(item).then(function(response){
      $scope.cart = response.data;
      var costs = calculate($scope.cart);

      $scope.cartTotal = costs.total;
      $scope.shippingCost = costs.shipping;
      $scope.orderTotal = costs.total + costs.shipping;
      getProductsInCart();
      // console.log(getProductsInCart);
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
      // mainService.cartStorage.push($scope.cart[i].productQuantity)
    }
    console.log($scope.cartTotalItems, "total items function here");
    // mainService.getCartStorage();
    return $scope.cartTotalItems;
  }

// findTotalItem();

function getProductsInCart(){
  mainService.getProductsInCart().then(function(response){
    console.log(response, "logging response in getProductsInCart");
    if(response.length === 0){
      $scope.somethingInCart = false;
    } else {
      $scope.somethingInCart = true;
    }


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
}

getProductsInCart();




  let orderData = {
    order: {
      // number: 5624,
      // note: "here is a note from the buyer"
    },
    email: "currentcutstest@gmail.com",
    user: {
    //   name: "Martin",
    //   address: "1234 s 10th st.",
    //   zip: "91482",
    //   note: "Check it, this email is being sent from my server. This is where the 'note from buyer' would go when you checkout."
    },
    product: []//{
    //   pName: "Wanderlust",
    //   pColor: "Red",
    //   pHeight: 6,
    //   pWidth: 12,
    //   pPrice: 15,
    //   pQuantity: 2
    // }
  }

  if($rootScope.details){
    $scope.shipNameFirst = $rootScope.details.recNameFirst;
    $scope.shipNameLast = $rootScope.details.recNameLast;
    $scope.shipAddress = $rootScope.details.address1;
    $scope.shipAddress2 = $rootScope.details.address2;
    $scope.shipCity = $rootScope.details.city;
    $scope.shipState = $rootScope.details.state;
    $scope.shipZip = $rootScope.details.zip;
    $scope.shipNote = $rootScope.note.note;
  }

  // $('.btn-stripe').on('click', orderData, function(e) {
  $scope.stripeBtn = function(shipNameFirst, shipNameLast, shipAddress, shipAddress2, shipCity, shipState, shipZip, shipNote){

    console.log($scope.shipNameFirst, "shipNameFirst being logged");
    // console.log(n, "shipNameFirst being logged");
    $rootScope.details = {
      recNameFirst: shipNameFirst,
      recNameLast: shipNameLast,
      address1: shipAddress,
      address2: shipAddress2,
      city: shipCity,
      state: shipState,
      zip: shipZip
    }

    $rootScope.note = {
      note: shipNote
    }
      console.log($rootScope.details, "scopedetailsbeinglogged");

    console.log("clicked");
    $scope.value = $rootScope.details
    console.log($scope.value, "scopedotvalue");
    if($scope.value){
      console.log(true);
    } else {
      console.log(false);
    }

    if($rootScope.note){
      console.log($rootScope.note.note, "rootScope.no.note");
      orderData.order.note = $rootScope.note.note;
    }
    orderData.user = $scope.value;
    orderData.product = [];

    mainService.getProductsInCart().then(function(response){
      if(response){
        console.log(response);

        response.forEach(function(item, i){
          console.log(item, "item being logged");
          orderData.product.push(item)
        })
      }


    });
    console.log(orderData, "orderdata logged");
  // Open Checkout with further options:
  // console.log(e.data, "USER DATA STRIPE CLICK");
  if (!$scope.value){
  alert("please enter shipping info")
  } else {
    var handler = StripeCheckout.configure({
      key: 'pk_test_o4WwpsoNcyJHEKTa6nJYQSUU',
      image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
      locale: 'auto',
      token: function(token) {
    // You can access the token ID with `token.id`.
    // Get the token ID to your server-side code for use.

        $http.post('/api/charge', {
          stripeToken: token.id,
          price: stripeTotal,
          email: token.email,
          stripeTokenCard: token.card
        }).then(function (response) {
          $rootScope.cart = [];
          $state.go('home');
          return $http.post('/api/email', orderData);
        })
      }
    })
        var stripeTotal = $scope.orderTotal * 100;

        handler.open({
          name: 'Current Cuts Vinyl',
          description: 'Decal purchase',
          amount: stripeTotal,
          // shippingAddress: true,
          // billingAddress: true,
          // zipCode: true
        });
        // e.preventDefault();
      }
  };



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
