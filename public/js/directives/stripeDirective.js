angular.module("ccvApp").directive("stripeDirective", function($http, $state, $rootScope, mainService){

  return {
    restrict: "AE",
    template: "<button class='btn-stripe'>Purchase with Stripe</button>",
    scope: {
            totalPrice: '='
          },
    link: function(scope, elem, attr){



      let orderData = {
        order: {
          number: 5624,
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

      // setTimeout(function () {
      //   var hello = mainService.addShippingInfo()
      //   console.log(hello);
      //
      // }, 2000);

      // setTimeout(function () {
        // scope.value = $rootScope.$on.details
        // console.log(scope.value, "scopedotvalue");
      // }, 2000);


      $('.btn-stripe').on('click', orderData, function(e) {

        // $rootScope.fun()
        // console.log($rootScope.fun());

        scope.value = $rootScope.details
        console.log(scope.value, "scopedotvalue");
        console.log($rootScope.note.note, "rootScope.no.note");
        orderData.user = scope.value;
        orderData.product = [];
        orderData.order.note = $rootScope.note.note;

        mainService.getProductsInCart().then(function(response){
          console.log(response);
          response.forEach(function(item, i){
            console.log(item, "item being logged");
            orderData.product.push(item)
          })

        });
        console.log(orderData, "orderdata logged");
    // Open Checkout with further options:
    // console.log(e.data, "USER DATA STRIPE CLICK");
    if (!scope.value){
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
            var stripeTotal = scope.totalPrice * 100;

            handler.open({
              name: 'Current Cuts Vinyl',
              description: 'Decal purchase',
              amount: stripeTotal
            });
            e.preventDefault();
          }
          });

      // Close Checkout on page navigation:
      //       // $(window).on('popstate', function() {
      //       //   handler.close();
      //       //   $state.go('mainProducts');
      //       // });

    }
  }


})


// angular.module('capriccio')
//   .directive('stripeButton', function ($http, $state, $rootScope) {
//     return {
//       restrict: 'E',
//       template: '<button id="stripePayButton">Pay Now</button>',
//       scope: {
//         totalPrice: '='
//       },
//       link: function (scope, element, attrs) {
//         var totalOrderPrice = scope.totalPrice;
//         var handler = StripeCheckout.configure({
//           key: 'pk_test_q7PtsCCbjWU88u3W834D5hSQ',
//           image: 'assetts/img/thumb-100.png',
//           locale: 'auto',
//           token: function(token) {
//           // You can access the token ID with `token.id`.
//           // Get the token ID to your server-side code for use.
//             $http.post('/api/charge', {
//               stripeToken: token.id,
//               price: totalOrderPrice,
//               email: token.email,
//               stripeTokenCard: token.card
//             }).then(function (response) {
//               $rootScope.userCart = [];
//               $state.go('mainProducts');
//             })
//           }
//         })
//         $('#stripePayButton').on('click', function(e) {
//           // Open Checkout with further options:
//           var stripeTotal = scope.totalPrice * 100;
//
//           handler.open({
//             name: 'Capriccio',
//             description: 'Music purchase',
//             amount: stripeTotal
//           });
//           e.preventDefault();
//         });
//
//       // Close Checkout on page navigation:
//       // $(window).on('popstate', function() {
//       //   handler.close();
//       //   $state.go('mainProducts');
//       // });
//       }
//     }
//   });
