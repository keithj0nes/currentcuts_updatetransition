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

  $scope.sameAsShipping = function(checked, shipNameFirst, shipNameLast, shipAddress, shipAddress2, shipCity, shipState, shipZip){
    $scope.sameShip = {};

    this.billNameFirst = "";
    this.billNameLast = "";
    this.billAddress = "";
    this.billAddress2 = "";
    this.billCity = "";
    this.billState = "";
    this.billZip = "";

    if(checked){
      $scope.sameShip.shipNameFirst = shipNameFirst;
      $scope.sameShip.shipNameLast = shipNameLast;
      $scope.sameShip.shipAddress = shipAddress;
      $scope.sameShip.shipAddress2 = shipAddress2;
      $scope.sameShip.shipCity = shipCity;
      $scope.sameShip.shipState = shipState;
      $scope.sameShip.shipZip = shipZip;
    } else {
      $scope.sameShip = {}
    }
    this.billNameFirst = $scope.sameShip.shipNameFirst;
    this.billNameLast = $scope.sameShip.shipNameLast;
    this.billAddress = $scope.sameShip.shipAddress;
    this.billAddress2 = $scope.sameShip.shipAddress2;
    this.billCity = $scope.sameShip.shipCity;
    this.billState = $scope.sameShip.shipState;
    this.billZip = $scope.sameShip.shipZip;
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
    var value = Number(document.getElementById("itemincartid_"+index).value);
    // if(value === "0" || value === 0 || value === "") {
    if(value <= 0) {
      $scope.cart[index].productQuantity = 1;
      document.getElementById("itemincartid_"+index).value = 1;
      mainService.updateProductsInCart($scope.cart).then((response) => {
        getProductsInCart();
        $rootScope.$broadcast('cartCount');
      })
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
      total += (Number(cart[i].productPrice) * Number(cart[i].productQuantity));
    }
    console.log(total, "calculate total");

    //shipping prices marked here - based on order total
         if (total >= 1 && total <= 20 ){
           shipping = 3;
         } else if (total > 20 && total <= 40){
           shipping = 4;
         } else if (total > 40){
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

  ///////////
  ///////////
  ///////////
  ///////////
  // FINISH SWITCH CASE
  ///////////
  ///////////
  ///////////

  $scope.clearInput = function(model){
    switch(model){
      case 'cartEmail': $scope.cartEmailR = false; break;

      case 'cartNameFirst': $scope.cartNameFirstR = false; break;
      case 'contactSubject': $scope.contactSubjectR = false; break;
      case 'contactMessage': $scope.contactMessageR = false; break;
    }
  }

  $scope.stripeBtn = function(shipNameFirst, shipNameLast, shipAddress, shipAddress2, shipCity, shipState, shipZip, shipNote, billNameFirst, billNameLast, billAddress, billAddress2, billCity, billState, billZip){
    let email = document.getElementById('userEmail').value;
    var validShipZip = /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(shipZip);
    var validBillZip = /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(billZip);

    $scope.cartEmailR = false;
    $scope.cartNameFirstR = false;
    $scope.cartNameLastR = false;
    $scope.cartAddressR = false;
    $scope.cartCityR = false;
    $scope.cartStateR = false;
    $scope.cartZipR = false;
    $scope.billNameFirstR = false;
    $scope.billNameLastR = false;
    $scope.billAddressR = false;
    $scope.billCityR = false;
    $scope.billStateR = false;
    $scope.billZipR = false;

    if(!email){$scope.cartEmailR = true;}
    if(!shipNameFirst){$scope.cartNameFirstR = true;}
    if(!shipNameLast){$scope.cartNameLastR = true;}
    if(!shipAddress){$scope.cartAddressR = true;}
    if(!shipCity){$scope.cartCityR = true;}
    if(!shipState){$scope.cartStateR = true;}
    if(!shipZip){$scope.cartZipR = true;}
    if(!validShipZip){$scope.cartZipR = true;}
    if(!billNameFirst){$scope.billNameFirstR = true;}
    if(!billNameLast){$scope.billNameLastR = true;}
    if(!billAddress){$scope.billAddressR = true;}
    if(!billCity){$scope.billCityR = true;}
    if(!billState){$scope.billStateR = true;}
    if(!billZip){$scope.billZipR = true;}
    if(!validBillZip){$scope.billZipR = true;}

    if($scope.cartEmailR === true ||
       $scope.cartNameFirstR === true ||
       $scope.cartNameLastR === true ||
       $scope.cartAddressR === true ||
       $scope.cartCityR === true ||
       $scope.cartStateR === true ||
       $scope.cartZipR === true ||
       $scope.billNameFirstR === true ||
       $scope.billNameLastR === true ||
       $scope.billAddressR === true ||
       $scope.billCityR === true ||
       $scope.billStateR === true ||
       $scope.billZipR === true){
         //errors will pop up
    } else {

      let orderData = {
        order: {
        },
        user: {
        },
        isguestuser: $scope.guestistrue
      }

      let billingInfo = {
        billNameFirst,
        billNameLast,
        billAddress,
        billAddress2,
        billCity,
        billState,
        billZip
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
        email: email
        // email: document.getElementById('userEmail').value

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
            return $http.post('/api/orders/confirmationemail', orderData);
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

  }

})
