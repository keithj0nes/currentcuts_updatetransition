angular.module("ccvApp").controller("thankyouController", function($scope, $rootScope, $state, mainService){

    mainService.getThankYouById($state.params.orderid).then(function(response){
      if(response.length >= 1){
        $rootScope.$broadcast('cartCount')
        $scope.thankyouResponse = true;
        $scope.orderNumber = $state.params.orderid;
        $scope.thankyouOrder = response;
        //console.log(response, 'RESPONSE IN THANKYOUUUUUUU');
        $scope.shipping = parseInt($scope.thankyouOrder[0].shipping);
        $scope.orderTotal = parseInt($scope.thankyouOrder[0].ordertotal)
      } else {
        $scope.thankyouResponse = false;
      }
    })

    //dummy data for layout switch
    // $scope.thankyouResponse = true;
    //
    // $scope.thankyouOrder = [{
    //   name: 'Snowboard Chair Lift Dual',
    //   color: 'Dark Gray',
    //   height: 5.0,
    //   width: 10.0,
    //   price: 10,
    //   quantsold: 4,
    //   shipping: 3,
    //   orderTotal: 70,
    //   email: 'hello@hello.com',
    //   datesold: "2018-05-29T05:56:32.247Z"
    // }, {
    //   name: 'Star Wars',
    //   color: 'Tomato Red',
    //   height: 5.0,
    //   width: 10.0,
    //   price: 3,
    //   quantsold: 10,
    //   shipping: 3,
    //   orderTotal: 70
    // }]
    //
    //
    // $scope.orderTotal = $scope.thankyouOrder[0].orderTotal
    // $scope.shipping = $scope.thankyouOrder[0].shipping



})
