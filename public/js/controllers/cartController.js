angular.module("ccvApp").controller("cartController", function($scope, $http, $state, $rootScope, mainService, $timeout){

  $scope.guestistrue = false;
  $scope.cartTotal = 0;
  $scope.shippingCost = 0;
  $scope.orderTotal = 0;
  $rootScope.cartQuant = 0;
  let shipAddressConfirmed;

  $scope.guestUser = () => {
    $scope.guestistrue = !$scope.guestistrue;
  }

  $scope.cartDelete = function(item){
    mainService.deleteProductsInCart(item).then(function(response){
      $scope.cart = response.data;
      var costs = calculate($scope.cart);
      $scope.cartTotal = costs.total;
      $scope.shippingCost = costs.shipping;
      $scope.orderTotal = costs.total + costs.shipping;
      getProductsInCart();
      $rootScope.$broadcast('cartCount')
    });
  }


  $scope.updateCart = function(index){
    var value = document.getElementById("itemincartid_"+index).value;
    if(value === "0" || value === 0 || value === "") {
      swal("enter a price")
    } else {
      $scope.cart[index].productQuantity = value;
      mainService.updateProductsInCart($scope.cart).then((response) => {
        getProductsInCart();
        $rootScope.$broadcast('cartCount');
      })

      $scope.spinIndex = index;

      $timeout(function(){
        $scope.spinIndex = false;
      }, 500);
    }


  }




  function calculate(cart) {
    var total = 0;
    var shipping = 0;

    for (var i = 0; i < cart.length; i++) {
      total += (parseInt(cart[i].productPrice) * parseInt(cart[i].productQuantity));
    }
    console.log(total, "calculate total");

    //shipping prices marked here - based on order total
         if (total >= 1 && total <= 20 ){
           shipping = 3;
         } else if (total >= 21 && total <= 40){
           shipping = 4;
         } else if (total >= 41){
           shipping = 5;
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
    }
    console.log($scope.cartTotalItems, "total items function here");

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
    $rootScope.shippingCost2 = costs.shipping;
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

  $scope.stripeBtn = function(shipNameFirst, shipNameLast, shipAddress, shipAddress2, shipCity, shipState, shipZip, shipNote){

    //
    // if(!shipNameFirst){
    //   swal("please enter your name")
    // }

    let orderData = {
      order: {
      },
      user: {
      },
      isguestuser: $scope.guestistrue

    }

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

    //using document.getElementById('userEmail').value to get the value of email instead of passing it through the stripeBtn function
    $rootScope.email = {
      email: document.getElementById('userEmail').value
    }

    // console.log($rootScope.details, "scopedetailsbeinglogged");

    $scope.value = $rootScope.details

    if($rootScope.note.note){
      // console.log($rootScope.note.note, "rootScope.no.note");
      orderData.order.note = $rootScope.note.note;
    }

    if($rootScope.email.email){
      // console.log($rootScope.email.email, "rootScope.email");
      orderData.email = $rootScope.email.email;
    }

    orderData.user = $scope.value;
    orderData.product = [];
    orderData.shipping = $rootScope.shippingCost2;
    console.log(orderData.shipping, "orderData.shipping");

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
      email: $rootScope.email.email,
      allowRememberMe: false,
      token: function(token) {
    // You can access the token ID with `token.id`.
    // Get the token ID to your server-side code for use.
      let newCard = token.card;
      newCard.metadata = {guestUser: orderData.isguestuser}

        $http.post('/api/charge', {
          stripeToken: token.id,
          price: stripeTotal,
          // email: token.email,
          // email: "hello@hahaomg.com",
          stripeTokenCard: newCard,
        }).then(function (response) {
          console.log(response, "response in cartController charge lololololol");
          $rootScope.cart = [];
          //set timeout so thankyou page loads after orderData is saved to backend
          setTimeout(function(){
            $state.go('thankyou', {"orderid": response.data});
          }, 150)
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



})
